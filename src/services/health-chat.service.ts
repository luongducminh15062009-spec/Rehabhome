import { supabase } from '@/lib/supabase'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'openai/gpt-4o-mini'

const SYSTEM_PROMPT = `Bạn là trợ lý hỏi đáp sức khỏe của ứng dụng Rehab Home.
Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, phù hợp người tập phục hồi và vận động nhẹ tại nhà.
Không chẩn đoán bệnh, không kê đơn thuốc, không thay thế bác sĩ.
Nếu người dùng mô tả dấu hiệu khẩn cấp như đau ngực, khó thở nặng, ngất, yếu liệt đột ngột hoặc chảy máu nhiều, hãy khuyên họ gọi cấp cứu hoặc đến cơ sở y tế ngay.
Có thể gợi ý thói quen an toàn về tập luyện, dinh dưỡng, giấc ngủ và phục hồi.`

export interface ChatConversation {
  id: string
  title: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type OpenListener = (conversationId: string | null) => void
const openListeners = new Set<OpenListener>()

export const HealthChatEvents = {
  open(conversationId: string | null) {
    openListeners.forEach((listener) => listener(conversationId))
  },
  subscribe(listener: OpenListener) {
    openListeners.add(listener)
    return () => {
      openListeners.delete(listener)
    }
  },
}

const titleFromMessage = (text: string) => {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= 80) return clean
  return `${clean.slice(0, 77)}...`
}

export const HealthChatService = {
  async listConversations(userId: string): Promise<ChatConversation[]> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('id, title, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    if (error) {
      console.error('Error listing chats:', error)
      return []
    }
    return data || []
  },

  async getConversation(id: string): Promise<ChatConversation | null> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('id, title, updated_at')
      .eq('id', id)
      .maybeSingle()
    if (error) {
      console.error('Error loading chat:', error)
      return null
    }
    return data
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) {
      console.error('Error loading messages:', error)
      return []
    }
    return (data || []) as ChatMessage[]
  },

  async renameConversation(id: string, userId: string, title: string): Promise<boolean> {
    const next = title.trim()
    if (!next) return false
    const { error } = await supabase
      .from('chat_conversations')
      .update({ title: next, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
    if (error) console.error('Error renaming chat:', error)
    return !error
  },

  async deleteConversation(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) console.error('Error deleting chat:', error)
    return !error
  },

  async sendMessage(
    userId: string,
    conversationId: string | null,
    content: string,
    history: ChatMessage[],
  ): Promise<{ conversationId: string; title: string; messages: ChatMessage[]; error?: string }> {
    const text = content.trim()
    let id = conversationId
    let title = titleFromMessage(text)

    if (!id) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: userId, title })
        .select('id, title')
        .single()
      if (error || !data) {
        console.error('Error creating chat:', error)
        throw new Error('Không thể tạo đoạn chat.')
      }
      id = data.id
      title = data.title
    } else {
      const existing = await this.getConversation(id)
      title = existing?.title || title
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
    }

    const { error: userError } = await supabase.from('chat_messages').insert({
      conversation_id: id,
      user_id: userId,
      role: 'user',
      content: text,
    })
    if (userError) {
      console.error('Error saving user message:', userError)
      throw new Error('Không thể lưu tin nhắn.')
    }

    let replyError: string | undefined
    try {
      const reply = await requestOpenRouter([
        ...history.map((item) => ({ role: item.role, content: item.content })),
        { role: 'user' as const, content: text },
      ])
      const { error: assistantError } = await supabase.from('chat_messages').insert({
        conversation_id: id,
        user_id: userId,
        role: 'assistant',
        content: reply,
      })
      if (assistantError) {
        console.error('Error saving assistant message:', assistantError)
        replyError = 'Đã nhận câu trả lời nhưng chưa lưu được.'
      }
    } catch (error) {
      console.error('OpenRouter error:', error)
      replyError = 'Không thể kết nối trợ lý. Vui lòng thử lại.'
    }

    const messages = await this.getMessages(id)
    return { conversationId: id, title, messages, error: replyError }
  },
}

const requestOpenRouter = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
) => {
  const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('Missing OpenRouter API key')
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://rehab-home.local',
      'X-Title': 'Rehab Home',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter ${response.status}`)
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const text = payload.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty OpenRouter response')
  return text
}
