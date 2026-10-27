import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { MoodLog, MoodService } from '@/services/mood.service'
import { WeekdayValue } from '@/modules/profile-setup/types/profile-setup.types'
import { WorkoutPlanService, exercisesForDate } from '@/services/workout-plan.service'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface TodayPlanItem {
  id: string
  title: string
  durationMin: number
  difficulty: string
  category: string
  status: 'completed' | 'pending'
  color: string
  bgColor: string
  icon: string
  imageUrl?: string | null
  exerciseKey?: string | null
}

export interface HomeData {
  profile: Profile
  todayCalories: number
  targetCalories: number
  macros: {
    protein: { current: number; target: number }
    fat: { current: number; target: number }
    carbs: { current: number; target: number }
  }
  bmi: number
  tdee: number
  waterIntake: {
    current: number
    target: number
  }
  exerciseMinutes: number
  sleepHours: number
  todayMood: MoodLog | null
  weekMoods: Record<string, MoodLog | null>
  todayPlan: TodayPlanItem[]
  targetSleepHours: number
}

export const HomeService = {
  /**
   * Get user profile data
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  },

  /**
   * Get water intake for a specific date
   */
  async getWaterIntake(userId: string, date: string): Promise<number> {
    console.log('💧 getWaterIntake called for date:', date)
    
    const { data, error } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      console.error('Error fetching water intake:', error)
      return 0
    }

    const total = data.reduce((total, log) => total + log.amount_ml, 0)
    console.log('Water logs found:', data?.length || 0, 'records, total:', total, 'ml')
    
    return total
  },

  /**
   * Update water intake for a specific date
   */
  async updateWaterIntake(userId: string, amountMl: number, date?: string): Promise<boolean> {
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    console.log('💧 Updating water intake for date:', targetDate, 'amount:', amountMl, 'ml')

    const { error } = await supabase
      .from('water_logs')
      .insert({
        user_id: userId,
        amount_ml: amountMl,
        date: targetDate, // Use selected date instead of always today
      })

    if (error) {
      console.error('Error updating water intake:', error)
      return false
    }

    console.log('✅ Water intake updated successfully')
    return true
  },

  /**
   * Delete last water log entry for a specific date
   */
  async deleteLastWaterLog(userId: string, date?: string): Promise<boolean> {
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    console.log('🗑️ Deleting last water log for date:', targetDate)

    // Get the last water log for this date
    const { data: logs, error: fetchError } = await supabase
      .from('water_logs')
      .select('id, amount_ml')
      .eq('user_id', userId)
      .eq('date', targetDate)
      .order('id', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error('Error fetching water log:', fetchError)
      return false
    }

    if (!logs || logs.length === 0) {
      console.log('No water logs found to delete')
      return false
    }

    // Delete the last log
    const { error: deleteError } = await supabase
      .from('water_logs')
      .delete()
      .eq('id', logs[0].id)

    if (deleteError) {
      console.error('Error deleting water log:', deleteError)
      return false
    }

    console.log('✅ Water log deleted successfully:', logs[0].amount_ml, 'ml')
    return true
  },

  /**
   * Get meal logs for a specific date and calculate total calories + macros
   */
  async getMealData(userId: string, date: string): Promise<{
    calories: number
    protein: number
    fat: number
    carbs: number
  }> {
    console.log('📊 getMealData called for date:', date)
    
    // Create date range for the entire day
    const startOfDay = `${date}T00:00:00Z`
    const endOfDay = `${date}T23:59:59Z`
    
    console.log('Query range:', startOfDay, 'to', endOfDay)

    const { data, error } = await supabase
      .from('meal_logs')
      .select(`
        calories,
        meals (
          calories,
          protein_g,
          carbs_g,
          fats_g
        )
      `)
      .eq('user_id', userId)
      .gte('eaten_at', startOfDay)
      .lte('eaten_at', endOfDay)

    if (error) {
      console.error('Error fetching meal data:', error)
      return { calories: 0, protein: 0, fat: 0, carbs: 0 }
    }
    
    console.log('Meal logs found:', data?.length || 0, 'records')

    let totalCalories = 0
    let totalProtein = 0
    let totalFat = 0
    let totalCarbs = 0

    data.forEach((log: any) => {
      if (log.meals) {
        totalCalories += log.meals.calories || 0
        totalProtein += log.meals.protein_g || 0
        totalFat += log.meals.fats_g || 0
        totalCarbs += log.meals.carbs_g || 0
      } else {
        totalCalories += log.calories || 0
      }
    })

    const result = {
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
    }
    
    console.log('Meal data result:', result)
    
    return result
  },

  /**
   * Calculate BMR (Basal Metabolic Rate)
   * Using Mifflin-St Jeor Equation
   */
  calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female' | 'other'
  ): number {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      // For female and other
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  },

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   */
  calculateTDEE(
    bmr: number,
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  ): number {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    return Math.round(bmr * activityMultipliers[activityLevel])
  },

  /**
   * Calculate target calories based on goal
   */
  calculateTargetCalories(
    tdee: number,
    goal: 'lose_weight' | 'gain_muscle' | 'maintain'
  ): number {
    switch (goal) {
      case 'lose_weight':
        return Math.round(tdee - 500) // 500 calorie deficit
      case 'gain_muscle':
        return Math.round(tdee + 300) // 300 calorie surplus
      case 'maintain':
      default:
        return tdee
    }
  },

  /**
   * Calculate target macros
   */
  calculateTargetMacros(targetCalories: number, goal: 'lose_weight' | 'gain_muscle' | 'maintain') {
    let proteinPercent = 0.3
    let fatPercent = 0.25
    let carbsPercent = 0.45

    if (goal === 'lose_weight') {
      proteinPercent = 0.35
      fatPercent = 0.25
      carbsPercent = 0.4
    } else if (goal === 'gain_muscle') {
      proteinPercent = 0.3
      fatPercent = 0.2
      carbsPercent = 0.5
    }

    return {
      protein: Math.round((targetCalories * proteinPercent) / 4), // 4 cal per gram
      fat: Math.round((targetCalories * fatPercent) / 9), // 9 cal per gram
      carbs: Math.round((targetCalories * carbsPercent) / 4), // 4 cal per gram
    }
  },

  /**
   * Calculate BMI
   */
  calculateBMI(weight: number, height: number): number {
    // height in cm, weight in kg
    const heightInMeters = height / 100
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
  },

  /**
   * Calculate age from date of birth
   */
  calculateAge(dateOfBirth: string): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  },

  /**
   * Get total exercise minutes for a specific date
   */
  async getExerciseMinutes(userId: string, date: string): Promise<number> {
    const data = await this.getExerciseData(userId, date)
    return data.minutes
  },

  /**
   * Get exercise data (minutes + calories burned) for a specific date (single query)
   */
  async getExerciseData(
    userId: string,
    date: string
  ): Promise<{ minutes: number; caloriesBurned: number }> {
    console.log('🏃 getExerciseData called for date:', date)

    const { data, error } = await supabase
      .from('exercise_logs')
      .select('duration_minutes, calories_burned')
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      console.error('Error fetching exercise data:', error)
      return { minutes: 0, caloriesBurned: 0 }
    }

    const minutes = data.reduce((sum, log) => sum + (log.duration_minutes || 0), 0)
    const caloriesBurned = data.reduce((sum, log) => sum + (log.calories_burned || 0), 0)
    console.log(
      'Exercise logs found:',
      data?.length || 0,
      'records, total:',
      minutes,
      'minutes,',
      caloriesBurned,
      'kcal'
    )

    return { minutes, caloriesBurned }
  },

  /**
   * Get total sleep hours for a specific date
   */
  async getSleepHours(userId: string, date: string): Promise<number> {
    console.log('😴 getSleepHours called for date:', date)
    
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('duration_hours')
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      console.error('Error fetching sleep data:', error)
      return 0
    }

    const total = data.reduce((sum, log) => sum + log.duration_hours, 0)
    console.log('Sleep logs found:', data?.length || 0, 'records, total:', total, 'hours')
    
    return total
  },

  buildTodayPlan(
    profile: Profile,
    date: string,
    exerciseMinutes: number,
  ): TodayPlanItem[] {
    const day = new Date(`${date}T12:00:00`).getDay() as WeekdayValue
    const workoutDays = (profile.workout_days as WeekdayValue[] | null) || []
    const isWorkoutDay = workoutDays.length === 0 || workoutDays.includes(day)
    const completedCount =
      exerciseMinutes <= 0 ? 0 : Math.min(3, Math.ceil(exerciseMinutes / 20))

    const templates: Omit<TodayPlanItem, 'id' | 'status'>[] = exercisesForDate(date).map(
      (exercise) => ({
        title: exercise.title,
        durationMin: exercise.durationMinutes,
        difficulty: exercise.difficulty,
        category: exercise.category,
        color: '#3B82F6',
        bgColor: '#DBEAFE',
        icon: 'body-outline',
        exerciseKey: exercise.key,
      }),
    )

    return templates.map((item, index) => ({
      ...item,
      id: `${date}-plan-${index}`,
      status: (isWorkoutDay && index < completedCount ? 'completed' : 'pending') as
        | 'completed'
        | 'pending',
    }))
  },

  getWeekDateRange(date: string): { start: string; end: string; dates: string[] } {
    const base = new Date(`${date}T12:00:00`)
    const day = base.getDay()
    const mondayOffset = day === 0 ? -6 : 1 - day
    const monday = new Date(base)
    monday.setDate(base.getDate() + mondayOffset)

    const dates: string[] = []
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday)
      current.setDate(monday.getDate() + i)
      dates.push(current.toISOString().split('T')[0])
    }

    return { start: dates[0], end: dates[6], dates }
  },

  /**
   * Get all home data for dashboard for a specific date
   */
  async getHomeData(userId: string, date?: string): Promise<HomeData | null> {
    const targetDate = date || new Date().toISOString().split('T')[0]

    try {
      const profile = await this.getUserProfile(userId)
      if (!profile) return null

      const { start, end, dates: weekDates } = this.getWeekDateRange(targetDate)

      const [mealData, waterIntake, exerciseData, sleepHours, todayMood, weekMoodList, planItems] =
        await Promise.all([
          this.getMealData(userId, targetDate),
          this.getWaterIntake(userId, targetDate),
          this.getExerciseData(userId, targetDate),
          this.getSleepHours(userId, targetDate),
          MoodService.getMoodForDate(userId, targetDate),
          MoodService.getMoodsForRange(userId, start, end),
          WorkoutPlanService.getPlanForDate(userId, targetDate),
        ])

      const age = profile.date_of_birth ? this.calculateAge(profile.date_of_birth) : 25
      const bmr = this.calculateBMR(
        profile.current_weight_kg || 70,
        profile.height_cm || 170,
        age,
        profile.gender || 'male',
      )
      const baseTdee = this.calculateTDEE(bmr, profile.activity_level || 'moderate')
      const tdee = baseTdee + exerciseData.caloriesBurned
      const targetCalories = this.calculateTargetCalories(tdee, profile.goal || 'maintain')
      const targetMacros = this.calculateTargetMacros(targetCalories, profile.goal || 'maintain')
      const bmi = this.calculateBMI(profile.current_weight_kg || 70, profile.height_cm || 170)
      const targetWater = Math.round((profile.current_weight_kg || 70) * 35)

      const weekMoods: Record<string, MoodLog | null> = {}
      weekDates.forEach((d) => {
        weekMoods[d] = weekMoodList.find((item) => item.date === d) || null
      })

      const todayPlan = planItems.length
        ? planItems.map((item) => {
            const colors = item.category.includes('Vận động')
              ? { color: '#EF4444', bgColor: '#FEE2E2', icon: 'walk-outline' }
              : item.category.includes('Sức mạnh') || item.category.includes('ghế')
                ? { color: '#3B82F6', bgColor: '#DBEAFE', icon: 'barbell-outline' }
                : { color: '#8B5CF6', bgColor: '#EDE9FE', icon: 'leaf-outline' }
            return {
              id: item.id,
              title: item.title,
              durationMin: item.duration_minutes,
              difficulty: item.difficulty,
              category: item.category,
              status: item.status,
              imageUrl: item.image_url,
              exerciseKey: item.exercise_key,
              ...colors,
            }
          })
        : this.buildTodayPlan(profile, targetDate, exerciseData.minutes)

      return {
        profile,
        todayCalories: mealData.calories,
        targetCalories,
        macros: {
          protein: { current: mealData.protein, target: targetMacros.protein },
          fat: { current: mealData.fat, target: targetMacros.fat },
          carbs: { current: mealData.carbs, target: targetMacros.carbs },
        },
        bmi,
        tdee,
        waterIntake: { current: waterIntake, target: targetWater },
        exerciseMinutes: exerciseData.minutes,
        sleepHours,
        todayMood,
        weekMoods,
        todayPlan,
        targetSleepHours: 8,
      }
    } catch (error) {
      console.error('❌ Error fetching home data:', error)
      throw error
    }
  },
}
