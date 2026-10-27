import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { toast } from '@/components/common/ToastManager'
import {
  ChatMessage,
  HealthChatEvents,
  HealthChatService,
} from '@/services/health-chat.service'

const StoryScreen = () => {
  const { user } = useAuth()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [title, setTitle] = useState('Hỏi đáp sức khỏe')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  const loadConversation = useCallback(async (id: string) => {
    const [conversation, rows] = await Promise.all([
      HealthChatService.getConversation(id),
      HealthChatService.getMessages(id),
    ])
    if (!conversation) {
      setConversationId(null)
      setTitle('Hỏi đáp sức khỏe')
      setMessages([])
      return
    }
    setConversationId(conversation.id)
    setTitle(conversation.title)
    setMessages(rows)
  }, [])

  useEffect(() => {
    return HealthChatEvents.subscribe((id) => {
      if (!id) {
        setConversationId(null)
        setTitle('Hỏi đáp sức khỏe')
        setMessages([])
        return
      }
      loadConversation(id)
    })
  }, [loadConversation])

  useFocusEffect(
    useCallback(() => {
      if (conversationId) loadConversation(conversationId)
    }, [conversationId, loadConversation]),
  )

  useEffect(() => {
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)
    return () => clearTimeout(timer)
  }, [messages, sending])

  const startNewChat = () => {
    setConversationId(null)
    setTitle('Hỏi đáp sức khỏe')
    setMessages([])
    setDraft('')
  }

  const send = async () => {
    const text = draft.trim()
    if (!text || sending) return
    if (!user?.id) {
      toast.error('Cần đăng nhập', 'Đăng nhập để lưu lịch sử hỏi đáp.')
      router.push(ERouteTable.SIGIN_IN)
      return
    }

    setDraft('')
    setSending(true)
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: text,
    }
    setMessages((current) => [...current, optimistic])

    try {
      const result = await HealthChatService.sendMessage(
        user.id,
        conversationId,
        text,
        messages,
      )
      setConversationId(result.conversationId)
      setTitle(result.title)
      setMessages(result.messages)
      if (result.error) toast.error('Chưa trả lời được', result.error)
    } catch (error) {
      setMessages((current) => current.filter((item) => item.id !== optimistic.id))
      setDraft(text)
      toast.error('Lỗi', error instanceof Error ? error.message : 'Không thể gửi câu hỏi.')
    } finally {
      setSending(false)
    }
  }

  const hasMessages = messages.length > 0

  return (
    <SafeAreaView className="flex-1 bg-[#F3F7FB]" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center px-5 pt-2 pb-3">
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.CHAT_HISTORY)}
            activeOpacity={0.85}
            className="w-12 h-12 rounded-full bg-white items-center justify-center"
          >
            <Ionicons name="time-outline" size={22} color="#64748B" />
          </TouchableOpacity>
          <Text
            className={`flex-1 text-lg font-semibold text-gray-900 ${hasMessages ? 'mx-3' : 'text-right ml-3'}`}
            numberOfLines={1}
          >
            {hasMessages ? title : 'Hỏi đáp sức khỏe'}
          </Text>
          {hasMessages && (
            <TouchableOpacity
              onPress={startNewChat}
              activeOpacity={0.85}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
            >
              <Ionicons name="add" size={26} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!hasMessages && !sending ? (
            <View className="flex-1 items-center justify-center pb-16">
              <Text className="text-2xl font-bold text-primary-main mb-2">Xin chào!</Text>
              <Text className="text-base text-gray-800">Tôi có thể giúp gì cho bạn?</Text>
            </View>
          ) : (
            <View className="pt-2">
              {messages.map((message) => {
                const mine = message.role === 'user'
                return (
                  <View
                    key={message.id}
                    className={`mb-3 max-w-[85%] ${mine ? 'self-end' : 'self-start'}`}
                  >
                    <View
                      className={`px-4 py-3 rounded-3xl ${
                        mine ? 'bg-primary-main rounded-br-lg' : 'bg-white rounded-bl-lg'
                      }`}
                    >
                      <Text
                        className={`text-base leading-6 ${mine ? 'text-white' : 'text-gray-800'}`}
                      >
                        {message.content}
                      </Text>
                    </View>
                  </View>
                )
              })}
              {sending && (
                <View className="self-start bg-white rounded-3xl rounded-bl-lg px-4 py-3 mb-3">
                  <ActivityIndicator color="#477AFF" />
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <View className="flex-row items-center px-4 pb-24">
          <View className="flex-1 h-14 rounded-full bg-white px-4 flex-row items-center">
            <Ionicons name="sparkles-outline" size={18} color="#94A3B8" />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Hỏi bất cứ điều gì..."
              placeholderTextColor="#94A3B8"
              className="flex-1 mx-2 text-base text-gray-900"
              editable={!sending}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={() => toast.info('Giọng nói', 'Hiện hãy nhập câu hỏi bằng bàn phím.')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="mic-outline" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={send}
            disabled={sending || !draft.trim()}
            activeOpacity={0.85}
            className="w-14 h-14 rounded-full bg-primary-main items-center justify-center ml-3"
            style={{ opacity: sending || !draft.trim() ? 0.7 : 1 }}
          >
            <Ionicons name="paper-plane" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default StoryScreen
