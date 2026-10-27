export type GoalType = 'lose_weight' | 'gain_muscle' | 'maintain'
export type ActivityLevelType = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type GenderType = 'male' | 'female'
export type WorkoutPeriodType = 'morning' | 'noon' | 'evening'
export type HealthConditionType =
    | 'none'
    | 'diabetes'
    | 'hypertension'
    | 'heart'
    | 'joints'
    | 'other'

/** 1 = T2 … 6 = T7, 0 = CN */
export type WeekdayValue = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ProfileSetupData {
    full_name: string
    gender: GenderType | null
    goal: GoalType | null
    age: number
    height_cm: number
    current_weight_kg: number
    activity_level: ActivityLevelType | null
    workout_days: WeekdayValue[]
    workout_period: WorkoutPeriodType | null
    workout_start_time: string | null
    workout_duration_min: number | null
    health_condition: HealthConditionType | null
    health_notes: string
}

export interface NutritionPlan {
    dailyCalories: number
    protein_g: number
    fat_g: number
    carbs_g: number
}

export const GOAL_OPTIONS = [
    { label: 'Giảm cân', value: 'lose_weight' as GoalType },
    { label: 'Duy trì cân nặng', value: 'maintain' as GoalType },
    { label: 'Tăng cơ / tăng cân', value: 'gain_muscle' as GoalType },
]

export const ACTIVITY_LEVEL_OPTIONS = [
    {
        title: 'Ít vận động',
        description: 'Ít đi lại, không tập thể dục.',
        value: 'sedentary' as ActivityLevelType,
    },
    {
        title: 'Vận động nhẹ',
        description: 'Đi bộ nhẹ nhàng hoặc tập thể dục.',
        value: 'light' as ActivityLevelType,
    },
    {
        title: 'Vận động vừa',
        description: 'Tập thể thao hoặc chạy bộ.',
        value: 'moderate' as ActivityLevelType,
    },
    {
        title: 'Vận động mạnh',
        description: 'Tập luyện cường độ cao.',
        value: 'active' as ActivityLevelType,
    },
    {
        title: 'Vận động cực độ',
        description: 'Vận động viên/làm công việc tay chân.',
        value: 'very_active' as ActivityLevelType,
    },
]

export const WEEKDAY_OPTIONS: { label: string; value: WeekdayValue }[] = [
    { label: 'T2', value: 1 },
    { label: 'T3', value: 2 },
    { label: 'T4', value: 3 },
    { label: 'T5', value: 4 },
    { label: 'T6', value: 5 },
    { label: 'T7', value: 6 },
    { label: 'CN', value: 0 },
]

export const WORKOUT_PERIOD_OPTIONS: {
    value: WorkoutPeriodType
    title: string
    range: string
    icon: string
    times: string[]
}[] = [
    {
        value: 'morning',
        title: 'Sáng',
        range: '05:00 - 11:00',
        icon: 'sunny-outline',
        times: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
    },
    {
        value: 'noon',
        title: 'Trưa',
        range: '11:00 - 14:00',
        icon: 'partly-sunny-outline',
        times: ['11:00', '12:00', '13:00', '14:00'],
    },
    {
        value: 'evening',
        title: 'Tối',
        range: '18:00 - 21:00',
        icon: 'moon-outline',
        times: ['18:00', '19:00', '20:00', '21:00'],
    },
]

export const WORKOUT_DURATION_OPTIONS = [
    { label: '15 phút', value: 15 },
    { label: '30 phút', value: 30 },
    { label: '45 phút', value: 45 },
    { label: '60 phút', value: 60 },
    { label: 'Trên 60 phút', value: 75 },
]

export const HEALTH_CONDITION_OPTIONS: {
    label: string
    value: HealthConditionType
}[] = [
    { label: 'Không có', value: 'none' },
    { label: 'Tiểu đường', value: 'diabetes' },
    { label: 'Huyết áp cao', value: 'hypertension' },
    { label: 'Vấn đề tim mạch', value: 'heart' },
    { label: 'Vấn đề xương khớp', value: 'joints' },
    { label: 'Khác', value: 'other' },
]

export const getGoalLabel = (goal: GoalType | null | string) =>
    GOAL_OPTIONS.find((item) => item.value === goal)?.label ?? '—'

export const formatDurationLabel = (minutes: number | null) => {
    if (!minutes) return '—'
    if (minutes > 60) return '60+ phút'
    return `${minutes} phút`
}
