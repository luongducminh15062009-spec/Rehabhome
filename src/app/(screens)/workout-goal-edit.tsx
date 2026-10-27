import React, { useCallback, useState } from 'react'
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '@/context/auth-provider'
import {
  FITNESS_GOAL_OPTIONS,
  FitnessGoalDetail,
  WorkoutPlanService,
} from '@/services/workout-plan.service'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'
import { toast } from '@/components/common/ToastManager'

const WorkoutGoalEditScreen = () => {
  const { user } = useAuth()
  const [selected, setSelected] = useState<FitnessGoalDetail>('maintain')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!user?.id) return setLoading(false)
        const data = await WorkoutPlanService.getPlanData(user.id)
        if (data) setSelected(data.goalDetail)
        setLoading(false)
      }
      load()
    }, [user?.id]),
  )

  const save = async () => {
    if (!user?.id) return
    const option = FITNESS_GOAL_OPTIONS.find((item) => item.value === selected)
    if (!option) return
    setSaving(true)
    const success = await WorkoutPlanService.updatePlan(user.id, {
      fitness_goal_detail: selected,
      goal: option.calorieGoal,
    })
    setSaving(false)
    if (!success) return toast.error('Lỗi', 'Không thể cập nhật mục tiêu.')
    toast.success('Đã cập nhật', 'Mục tiêu tập luyện đã được lưu.')
    router.back()
  }

  if (loading) return <View className="flex-1 items-center justify-center bg-[#F7F8FA]"><ActivityIndicator color="#477AFF" /></View>

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Mục tiêu" />
      <View className="px-6 flex-1">
        {FITNESS_GOAL_OPTIONS.map((item) => {
          const active = item.value === selected
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setSelected(item.value)}
              className="rounded-2xl px-5 py-5 mb-3 flex-row items-center border"
              style={{
                borderColor: active ? '#477AFF' : 'transparent',
                backgroundColor: active ? '#EEF3FF' : '#EEF1F4',
              }}
            >
              <Text className="text-lg font-bold text-gray-900 flex-1">{item.label}</Text>
              <View
                className="w-6 h-6 rounded-full border-2 items-center justify-center"
                style={{ borderColor: active ? '#477AFF' : '#7C8A99', backgroundColor: active ? '#477AFF' : 'transparent' }}
              >
                {active && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
      <View className="px-4 py-4 bg-white rounded-t-[32px]">
        <TouchableOpacity onPress={save} disabled={saving} className="h-14 bg-primary-main rounded-2xl items-center justify-center">
          {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-lg font-semibold text-white">Lưu thay đổi</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default WorkoutGoalEditScreen
