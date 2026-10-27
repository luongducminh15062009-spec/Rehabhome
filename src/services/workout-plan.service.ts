import { ImageSourcePropType } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import {
  ActivityLevelType,
  WeekdayValue,
  WorkoutPeriodType,
} from '@/modules/profile-setup/types/profile-setup.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row']

export type FitnessGoalDetail =
  | 'lose_weight'
  | 'maintain'
  | 'gain_weight'
  | 'body_composition'
  | 'overall_health'
  | 'eat_better'
  | 'feel_better'

export type WorkoutPlanUpdate = {
  goal?: 'lose_weight' | 'maintain' | 'gain_muscle'
  fitness_goal_detail?: FitnessGoalDetail
  activity_level?: ActivityLevelType
  workout_days?: WeekdayValue[]
  workout_period?: WorkoutPeriodType
  workout_start_time?: string
  workout_duration_min?: number
}

export interface WorkoutPlanData {
  profile: Profile
  goalDetail: FitnessGoalDetail
  completedSessions: number
  plannedSessions: number
  completionPercent: number
  totalMinutes: number
  totalCalories: number
  weeklyCompletedDates: Set<string>
  weeklyCounts: number[]
}

export interface ExerciseStep {
  title: string
  detail: string
}

export interface ExerciseSections {
  warmup: { duration: string; steps: string[] }
  main: { duration: string; intro: string; steps: ExerciseStep[] }
  cooldown: { duration: string; steps: string[] }
}

export interface ExerciseTemplate {
  key: string
  title: string
  category: string
  difficulty: string
  durationMinutes: number
  image: ImageSourcePropType
  exerciseType: 'cardio' | 'strength' | 'yoga' | 'sport' | 'other'
  description: string
  /** YouTube video ID (ví dụ: YPUMtNm7Ozc) — hiển thị trên màn chi tiết nếu có */
  videoId?: string
  sections?: ExerciseSections
}

export interface WorkoutPlanItem {
  id: string
  user_id: string
  scheduled_date: string
  exercise_key: string
  title: string
  category: string
  difficulty: string
  duration_minutes: number
  image_url: string | null
  workout_period: WorkoutPeriodType | null
  start_time: string | null
  status: 'pending' | 'completed'
}

/** Thư viện bài tập phục hồi — dùng chung cho Khám phá, thư viện và kế hoạch. */
export const RECOMMENDED_EXERCISES: ExerciseTemplate[] = [
  {
    key: 'belly-breath',
    title: 'Thở bụng thư giãn',
    category: 'Thở & thư giãn',
    difficulty: 'Dễ',
    durationMinutes: 5,
    image: require('../../assets/images/image-bai-tap/thumnail-1.jpg'),
    exerciseType: 'yoga',
    description: 'Hít thở bằng bụng để điều hòa nhịp thở, thư giãn cơ thể và giảm căng thẳng.',
  },
  {
    key: 'shoulder-roll',
    title: 'Xoay vai nhẹ nhàng',
    category: 'Khởi động',
    difficulty: 'Dễ',
    durationMinutes: 3,
    image: require('../../assets/images/image-bai-tap/thumnail-2.jpg'),
    exerciseType: 'other',
    description: 'Xoay vai chậm để làm nóng khớp vai trước khi vận động.',
  },
  {
    key: 'neck-side-stretch',
    title: 'Kéo giãn cổ sang hai bên',
    category: 'Kéo giãn',
    difficulty: 'Dễ',
    durationMinutes: 4,
    image: require('../../assets/images/image-bai-tap/thumnail-3.jpg'),
    exerciseType: 'yoga',
    description: 'Nghiêng đầu nhẹ sang từng bên để giãn cơ cổ, không kéo giật.',
  },
  {
    key: 'seated-knee-extension',
    title: 'Duỗi gối khi ngồi',
    category: 'Bài tập trên ghế',
    difficulty: 'Dễ',
    durationMinutes: 5,
    image: require('../../assets/images/image-bai-tap/thumnail-4.jpg'),
    exerciseType: 'strength',
    description: 'Ngồi trên ghế, duỗi thẳng từng chân để giữ sức mạnh cơ đùi.',
  },
  {
    key: 'march-in-place',
    title: 'Đi bộ tại chỗ',
    category: 'Vận động toàn thân',
    difficulty: 'Trung bình',
    durationMinutes: 10,
    image: require('../../assets/images/image-bai-tap/thumnail-5.jpg'),
    exerciseType: 'cardio',
    description: 'Đi bộ tại chỗ theo nhịp thoải mái để duy trì sức bền.',
  },
  {
    key: 'side-step',
    title: 'Bước ngang nhẹ',
    category: 'Vận động toàn thân',
    difficulty: 'Trung bình',
    durationMinutes: 8,
    image: require('../../assets/images/image-bai-tap/thumnail-6.jpg'),
    exerciseType: 'cardio',
    description: 'Bước sang hai bên với biên độ nhỏ để vận động hông và chân.',
  },
  {
    key: 'supported-sit-to-stand',
    title: 'Đứng lên – ngồi xuống có hỗ trợ',
    category: 'Sức mạnh nhẹ',
    difficulty: 'Trung bình',
    durationMinutes: 8,
    image: require('../../assets/images/image-bai-tap/thumnail-7.jpg'),
    exerciseType: 'strength',
    description: 'Đứng lên và ngồi xuống với ghế có tay vịn, giữ thăng bằng.',
  },
  {
    key: 'wall-push-up',
    title: 'Chống đẩy vào tường',
    category: 'Sức mạnh nhẹ',
    difficulty: 'Trung bình',
    durationMinutes: 6,
    image: require('../../assets/images/image-bai-tap/thumnail-8.jpg'),
    exerciseType: 'strength',
    description: 'Chống tay vào tường và đẩy người ra vào để tập ngực và vai nhẹ.',
  },
  {
    key: 'full-body-stretch',
    title: 'Kéo giãn toàn thân sau vận động',
    category: 'Phục hồi & thư giãn',
    difficulty: 'Dễ',
    durationMinutes: 7,
    image: require('../../assets/images/image-bai-tap/thumnail-9.jpg'),
    exerciseType: 'yoga',
    description: 'Vươn người và thở chậm để cơ thể trở lại trạng thái thư giãn sau khi tập.',
  },
]

export const EXERCISE_LIBRARY: ExerciseTemplate[] = RECOMMENDED_EXERCISES

export const EXERCISE_CATEGORIES = Array.from(
  new Set(EXERCISE_LIBRARY.map((item) => item.category)),
)

export const exerciseImageSource = (
  exerciseKey?: string | null,
  imageUrl?: string | null,
): ImageSourcePropType | undefined => {
  const local = exerciseKey ? EXERCISE_LIBRARY.find((item) => item.key === exerciseKey) : undefined
  if (local) return local.image
  if (imageUrl) return { uri: imageUrl }
  return undefined
}

const hydratePlanItem = (item: WorkoutPlanItem): WorkoutPlanItem => {
  const exercise = EXERCISE_LIBRARY.find((entry) => entry.key === item.exercise_key)
  if (!exercise) return item
  return {
    ...item,
    title: exercise.title,
    category: exercise.category,
    difficulty: exercise.difficulty,
    duration_minutes: exercise.durationMinutes,
  }
}

export const EXERCISE_SETUP: Record<string, { posture: string; equipment: string }> = {
  'belly-breath': { posture: 'Ngồi hoặc nằm thoải mái', equipment: 'Không cần' },
  'shoulder-roll': { posture: 'Ngồi hoặc đứng', equipment: 'Không cần' },
  'neck-side-stretch': { posture: 'Ngồi thoải mái', equipment: 'Không cần' },
  'seated-knee-extension': { posture: 'Ngồi trên ghế', equipment: 'Ghế chắc chắn' },
  'march-in-place': { posture: 'Đứng', equipment: 'Giày thoải mái' },
  'side-step': { posture: 'Đứng', equipment: 'Không cần' },
  'supported-sit-to-stand': { posture: 'Ngồi trên ghế có tay vịn', equipment: 'Ghế chắc chắn' },
  'wall-push-up': { posture: 'Đứng đối diện tường', equipment: 'Tường' },
  'full-body-stretch': { posture: 'Đứng', equipment: 'Không cần' },
}

export const getExerciseSetup = (key: string) =>
  EXERCISE_SETUP[key] ?? { posture: 'Ngồi hoặc nằm thoải mái', equipment: 'Không cần' }

const SESSIONS_PER_DAY = 3

const dayOfYear = (dateString: string) => {
  const date = new Date(`${dateString}T12:00:00`)
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

export const exercisesForDate = (dateString: string): ExerciseTemplate[] =>
  Array.from({ length: SESSIONS_PER_DAY }, (_, offset) => {
    const index = (dayOfYear(dateString) * SESSIONS_PER_DAY + offset) % RECOMMENDED_EXERCISES.length
    return RECOMMENDED_EXERCISES[index]
  })

const planRowsForDates = (
  userId: string,
  dates: string[],
  profile: {
    workout_period?: WorkoutPeriodType | null
    workout_start_time?: string | null
    workout_duration_min?: number | null
  },
) => {
  return dates.flatMap((scheduledDate) =>
    exercisesForDate(scheduledDate).map((exercise) => ({
      user_id: userId,
      scheduled_date: scheduledDate,
      exercise_key: exercise.key,
      title: exercise.title,
      category: exercise.category,
      difficulty: exercise.difficulty,
      duration_minutes: exercise.durationMinutes,
      image_url: null as string | null,
      workout_period: profile.workout_period || 'evening',
      start_time: profile.workout_start_time || '19:00',
    })),
  )
}

export const getExerciseSections = (exercise: ExerciseTemplate): ExerciseSections => {
  if (exercise.sections) return exercise.sections

  const mainDuration = `${Math.max(exercise.durationMinutes - 8, 5)} phút`
  return {
    warmup: {
      duration: '4 phút',
      steps: [
        'Khởi động khớp nhẹ nhàng 1–2 phút.',
        'Di chuyển toàn thân với biên độ nhỏ để tăng nhiệt cơ thể.',
        'Thở đều, chuẩn bị tư thế cho bài tập chính.',
      ],
    },
    main: {
      duration: mainDuration,
      intro: `Thực hiện các động tác của bài "${exercise.title}" theo đúng kỹ thuật, nghỉ ngắn giữa các hiệp.`,
      steps: [
        {
          title: exercise.title,
          detail: `${exercise.description} Thời lượng khoảng ${mainDuration}, cường độ ${exercise.difficulty.toLowerCase()}.`,
        },
        {
          title: 'Kiểm soát nhịp thở',
          detail: 'Hít vào khi chuẩn bị, thở ra khi gắng sức. Không nín thở.',
        },
        {
          title: 'Nghỉ giữa hiệp',
          detail: 'Nghỉ 20–40 giây nếu cần, giữ nhịp tim ổn định trước khi tiếp tục.',
        },
      ],
    },
    cooldown: {
      duration: '4 phút',
      steps: [
        'Giảm dần cường độ, đi bộ tại chỗ 1 phút.',
        'Giãn các nhóm cơ vừa làm việc 2 phút.',
        'Hít thở sâu để thư giãn 1 phút.',
      ],
    },
  }
}

const toDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const countPlannedSessions = (
  year: number,
  month: number,
  workoutDays: WeekdayValue[],
) => {
  if (!workoutDays.length) return 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let count = 0
  for (let day = 1; day <= daysInMonth; day++) {
    if (workoutDays.includes(new Date(year, month, day).getDay() as WeekdayValue)) count++
  }
  return count
}

const getGoalDetail = (profile: Profile): FitnessGoalDetail => {
  if (profile.fitness_goal_detail) return profile.fitness_goal_detail
  if (profile.goal === 'gain_muscle') return 'gain_weight'
  return profile.goal || 'maintain'
}

export const FITNESS_GOAL_OPTIONS: {
  label: string
  value: FitnessGoalDetail
  calorieGoal: 'lose_weight' | 'maintain' | 'gain_muscle'
}[] = [
  { label: 'Giảm cân', value: 'lose_weight', calorieGoal: 'lose_weight' },
  { label: 'Duy trì cân nặng', value: 'maintain', calorieGoal: 'maintain' },
  { label: 'Tăng cân', value: 'gain_weight', calorieGoal: 'gain_muscle' },
  { label: 'Cải thiện thành phần cơ thể', value: 'body_composition', calorieGoal: 'maintain' },
  { label: 'Cải thiện sức khỏe tổng thể', value: 'overall_health', calorieGoal: 'maintain' },
  { label: 'Ăn ngon hơn', value: 'eat_better', calorieGoal: 'maintain' },
  { label: 'Cảm thấy tốt hơn', value: 'feel_better', calorieGoal: 'maintain' },
]

export const getFitnessGoalLabel = (value: FitnessGoalDetail | null | undefined) =>
  FITNESS_GOAL_OPTIONS.find((item) => item.value === value)?.label || 'Duy trì cân nặng'

export const getActivityLabel = (value: ActivityLevelType | null) => {
  const labels: Record<ActivityLevelType, string> = {
    sedentary: 'Ít vận động',
    light: 'Vận động nhẹ',
    moderate: 'Vận động vừa',
    active: 'Vận động mạnh',
    very_active: 'Vận động cực độ',
  }
  return value ? labels[value] : 'Chưa thiết lập'
}

export const WorkoutPlanService = {
  async getPlanData(userId: string): Promise<WorkoutPlanData | null> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const chartStart = new Date(now)
    chartStart.setDate(now.getDate() - 27)

    const [{ data: profile, error: profileError }, { data: logs, error: logsError }] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('exercise_logs')
          .select('*')
          .gte('date', toDateString(chartStart))
          .lte('date', toDateString(monthEnd))
          .eq('user_id', userId)
          .order('date', { ascending: true }),
      ])

    if (profileError || !profile) {
      console.error('Error loading workout profile:', profileError)
      return null
    }
    if (logsError) console.error('Error loading workout logs:', logsError)

    const typedProfile = profile as Profile
    const typedLogs = (logs || []) as ExerciseLog[]
    const monthStartString = toDateString(monthStart)
    const monthLogs = typedLogs.filter((log) => log.date >= monthStartString)
    const completedDates = new Set(monthLogs.map((log) => log.date))
    const workoutDays = (typedProfile.workout_days || []) as WeekdayValue[]
    const plannedSessions = countPlannedSessions(
      now.getFullYear(),
      now.getMonth(),
      workoutDays,
    )
    const completedSessions = completedDates.size

    const weeklyCounts = [0, 1, 2, 3].map((weekIndex) => {
      const start = new Date(chartStart)
      start.setDate(chartStart.getDate() + weekIndex * 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      const dates = new Set(
        typedLogs
          .filter((log) => log.date >= toDateString(start) && log.date <= toDateString(end))
          .map((log) => log.date),
      )
      return dates.size
    })

    const monday = new Date(now)
    const day = monday.getDay()
    monday.setDate(now.getDate() + (day === 0 ? -6 : 1 - day))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const weeklyCompletedDates = new Set(
      typedLogs
        .filter(
          (log) =>
            log.date >= toDateString(monday) && log.date <= toDateString(sunday),
        )
        .map((log) => log.date),
    )

    return {
      profile: typedProfile,
      goalDetail: getGoalDetail(typedProfile),
      completedSessions,
      plannedSessions,
      completionPercent:
        plannedSessions > 0
          ? Math.min(100, Math.round((completedSessions / plannedSessions) * 100))
          : 0,
      totalMinutes: monthLogs.reduce((sum, log) => sum + log.duration_minutes, 0),
      totalCalories: monthLogs.reduce(
        (sum, log) => sum + (log.calories_burned || 0),
        0,
      ),
      weeklyCompletedDates,
      weeklyCounts,
    }
  },

  async seedPlanFromProfile(
    userId: string,
    profile: {
      workout_days: WeekdayValue[]
      workout_period: WorkoutPeriodType | null
      workout_start_time: string | null
      workout_duration_min: number | null
    },
  ): Promise<boolean> {
    const start = new Date()
    start.setHours(12, 0, 0, 0)
    const dates: string[] = []
    for (let offset = 0; offset < 28; offset++) {
      const date = new Date(start)
      date.setDate(start.getDate() + offset)
      if (profile.workout_days.includes(date.getDay() as WeekdayValue)) {
        dates.push(toDateString(date))
      }
    }
    if (!dates.length) return true

    const db = supabase as any
    const { error } = await db
      .from('workout_plan_items')
      .upsert(planRowsForDates(userId, dates, profile), {
        onConflict: 'user_id,scheduled_date,exercise_key',
      })
    if (error) {
      console.error('Error seeding workout plan:', error)
      return false
    }
    return true
  },

  async updatePlan(userId: string, updates: WorkoutPlanUpdate): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      // @ts-expect-error Database type hiện tại chưa phải output đầy đủ từ Supabase CLI.
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error updating workout plan:', error)
      return false
    }
    return true
  },

  async getWeeklyPlan(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<WorkoutPlanItem[]> {
    const db = supabase as any
    let { data, error } = await db
      .from('workout_plan_items')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date')

    if (error) {
      console.error('Error loading weekly plan:', error)
      return []
    }

    const libraryKeys = new Set(EXERCISE_LIBRARY.map((item) => item.key))
    const freshItems = ((data || []) as WorkoutPlanItem[]).filter((item) =>
      libraryKeys.has(item.exercise_key),
    )
    const staleIds = ((data || []) as WorkoutPlanItem[])
      .filter((item) => !libraryKeys.has(item.exercise_key))
      .map((item) => item.id)

    if (staleIds.length) {
      await db.from('workout_plan_items').delete().in('id', staleIds)
    }
    if (freshItems.length && !staleIds.length) {
      return freshItems.map(hydratePlanItem)
    }

    const profile = await this.getPlanData(userId)
    if (!profile) return []
    const workoutDays = (profile.profile.workout_days || []) as WeekdayValue[]
    const dates: string[] = []
    const day = new Date(`${startDate}T12:00:00`)
    const end = new Date(`${endDate}T12:00:00`)
    while (day <= end) {
      if (workoutDays.includes(day.getDay() as WeekdayValue)) {
        dates.push(toDateString(day))
      }
      day.setDate(day.getDate() + 1)
    }

    const rows = planRowsForDates(userId, dates, profile.profile)
    if (!rows.length) return freshItems.map(hydratePlanItem)

    const seeded = await db
      .from('workout_plan_items')
      .upsert(rows, { onConflict: 'user_id,scheduled_date,exercise_key' })
      .select('*')
    if (seeded.error) {
      console.error('Error creating weekly plan:', seeded.error)
      return []
    }
    return (seeded.data as WorkoutPlanItem[]).map(hydratePlanItem)
  },

  async getPlanForDate(userId: string, date: string): Promise<WorkoutPlanItem[]> {
    const base = new Date(`${date}T12:00:00`)
    const day = base.getDay()
    const monday = new Date(base)
    monday.setDate(base.getDate() + (day === 0 ? -6 : 1 - day))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const week = await this.getWeeklyPlan(userId, toDateString(monday), toDateString(sunday))
    return week.filter((item) => item.scheduled_date === date)
  },

  async getPlanItem(itemId: string): Promise<WorkoutPlanItem | null> {
    const db = supabase as any
    const { data, error } = await db
      .from('workout_plan_items')
      .select('*')
      .eq('id', itemId)
      .single()
    if (error) {
      console.error('Error loading plan item:', error)
      return null
    }
    return hydratePlanItem(data as WorkoutPlanItem)
  },

  async addPlanItem(
    userId: string,
    date: string,
    exercise: ExerciseTemplate,
    period: WorkoutPeriodType,
  ): Promise<boolean> {
    const db = supabase as any
    const { error } = await db.from('workout_plan_items').upsert(
      {
        user_id: userId,
        scheduled_date: date,
        exercise_key: exercise.key,
        title: exercise.title,
        category: exercise.category,
        difficulty: exercise.difficulty,
        duration_minutes: exercise.durationMinutes,
        image_url: null,
        workout_period: period,
      },
      { onConflict: 'user_id,scheduled_date,exercise_key' },
    )
    if (error) console.error('Error adding plan item:', error)
    return !error
  },

  async replacePlanItem(itemId: string, exercise: ExerciseTemplate): Promise<boolean> {
    const db = supabase as any
    const { error } = await db
      .from('workout_plan_items')
      .update({
        exercise_key: exercise.key,
        title: exercise.title,
        category: exercise.category,
        difficulty: exercise.difficulty,
        duration_minutes: exercise.durationMinutes,
        image_url: null,
        status: 'pending',
        completed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
    if (error) console.error('Error replacing plan item:', error)
    return !error
  },

  async completePlanItem(userId: string, item: WorkoutPlanItem): Promise<boolean> {
    const exercise = EXERCISE_LIBRARY.find((entry) => entry.key === item.exercise_key)
    const db = supabase as any
    const { error: logError } = await db.from('exercise_logs').insert({
      user_id: userId,
      exercise_type: exercise?.exerciseType || 'other',
      duration_minutes: item.duration_minutes,
      calories_burned: Math.round(item.duration_minutes * 7),
      notes: item.title,
      date: item.scheduled_date,
    })
    if (logError) return false
    const { error } = await db
      .from('workout_plan_items')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', item.id)
    return !error
  },
}
