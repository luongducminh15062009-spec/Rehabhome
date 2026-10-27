import { supabase } from '@/lib/supabase'
import { WorkoutPlanService } from '@/services/workout-plan.service'
import { Database } from '@/types/database.types'
import { ProfileSetupData } from '../types/profile-setup.types'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

const calculateDateOfBirth = (age: number): string => {
    const today = new Date()
    const birthYear = today.getFullYear() - age
    return `${birthYear}-01-01`
}

export const updateUserProfile = async (
    userId: string,
    data: ProfileSetupData,
): Promise<{ success: boolean; error?: string }> => {
    try {
        const updateData: ProfileUpdate = {
            full_name: data.full_name,
            gender: data.gender,
            goal: data.goal,
            date_of_birth: calculateDateOfBirth(data.age),
            height_cm: data.height_cm,
            current_weight_kg: data.current_weight_kg,
            activity_level: data.activity_level,
            workout_days: data.workout_days,
            workout_period: data.workout_period,
            workout_start_time: data.workout_start_time,
            workout_duration_min: data.workout_duration_min,
            health_condition: data.health_condition,
            health_notes: data.health_condition === 'other' ? data.health_notes.trim() : null,
            fitness_goal_detail:
                data.goal === 'gain_muscle' ? 'gain_weight' : data.goal ?? 'maintain',
            updated_at: new Date().toISOString(),
        }

        // @ts-ignore - Supabase type inference issue, but this works at runtime
        const { error } = await supabase.from('profiles').update(updateData).eq('id', userId)

        if (error) {
            console.error('Error updating profile:', error)
            return { success: false, error: error.message }
        }

        const seeded = await WorkoutPlanService.seedPlanFromProfile(userId, {
            workout_days: data.workout_days,
            workout_period: data.workout_period,
            workout_start_time: data.workout_start_time,
            workout_duration_min: data.workout_duration_min,
        })
        if (!seeded) {
            return {
                success: false,
                error: 'Đã lưu hồ sơ nhưng chưa tạo được kế hoạch tập. Vui lòng thử lại.',
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error updating profile:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
