import { supabase } from '@/lib/supabase'

export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface MoodLog {
  id: string
  user_id: string
  date: string
  mood_level: MoodLevel
  energy_level: number
  exercised: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export const MOOD_OPTIONS: {
  level: MoodLevel
  label: string
  color: string
}[] = [
  { level: 1, label: 'Rất tệ', color: '#FF5647' },
  { level: 2, label: 'Không ổn', color: '#FF852D' },
  { level: 3, label: 'Bình thường', color: '#FFC529' },
  { level: 4, label: 'Vui', color: '#31CBE8' },
  { level: 5, label: 'Tuyệt vời', color: '#20D979' },
]

export const getMoodMeta = (level: number | null | undefined) =>
  MOOD_OPTIONS.find((item) => item.level === level) ?? null

export const getEnergyLabel = (energy: number | null | undefined) => {
  if (!energy) return '—'
  if (energy >= 7) return 'Cao'
  if (energy >= 4) return 'Trung bình'
  return 'Thấp'
}

export const isFutureMoodDate = (date: string) => {
  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
  return date > today
}

export const MoodService = {
  async getMoodForDate(userId: string, date: string): Promise<MoodLog | null> {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle()

    if (error) {
      console.error('Error fetching mood log:', error)
      return null
    }

    return data as MoodLog | null
  },

  async getMoodsForRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<MoodLog[]> {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching mood range:', error)
      return []
    }

    return (data as MoodLog[]) || []
  },

  async upsertMood(params: {
    userId: string
    date: string
    moodLevel: MoodLevel
    energyLevel?: number
    exercised?: boolean
    notes?: string
  }): Promise<MoodLog | null> {
    if (isFutureMoodDate(params.date)) {
      console.warn('Cannot save mood for a future date:', params.date)
      return null
    }

    const payload = {
      user_id: params.userId,
      date: params.date,
      mood_level: params.moodLevel,
      energy_level: params.energyLevel ?? 7,
      exercised: params.exercised ?? false,
      notes: params.notes ?? null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('mood_logs')
      // @ts-expect-error Database type hiện tại chưa phải output đầy đủ từ Supabase CLI.
      .upsert(payload, { onConflict: 'user_id,date' })
      .select('*')
      .single()

    if (error) {
      console.error('Error upserting mood log:', error)
      return null
    }

    return data as MoodLog
  },
}
