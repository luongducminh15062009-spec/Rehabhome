import React, { useCallback, useState } from 'react'
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '@/context/auth-provider'
import { ERouteTable } from '@/constants/route-table'
import {
  getActivityLabel,
  getFitnessGoalLabel,
  WorkoutPlanData,
  WorkoutPlanService,
} from '@/services/workout-plan.service'
import { WEEKDAY_OPTIONS } from '@/modules/profile-setup/types/profile-setup.types'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'

const WorkoutPlanEditScreen = () => {
  const { user } = useAuth()
  const [data, setData] = useState<WorkoutPlanData | null>(null)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!user?.id) return setLoading(false)
        setData(await WorkoutPlanService.getPlanData(user.id))
        setLoading(false)
      }
      load()
    }, [user?.id]),
  )

  if (loading) {
    return <View className="flex-1 bg-[#F7F8FA] items-center justify-center"><ActivityIndicator color="#477AFF" /></View>
  }

  const profile = data?.profile
  const days = WEEKDAY_OPTIONS.filter((day) => profile?.workout_days?.includes(day.value))
    .map((day) => day.label)
    .join(', ')
  const periodLabels = { morning: 'Buổi sáng', noon: 'Buổi trưa', evening: 'Buổi tối' }
  const period = profile?.workout_period ? periodLabels[profile.workout_period] : 'Chưa chọn'

  const rows = [
    { label: 'Mục tiêu', value: getFitnessGoalLabel(data?.goalDetail), route: ERouteTable.WORKOUT_GOAL_EDIT },
    { label: 'Tần suất', value: `${profile?.workout_days?.length || 0} buổi/tuần`, route: ERouteTable.WORKOUT_SCHEDULE_EDIT },
    { label: 'Thời lượng', value: `${profile?.workout_duration_min || 45} phút`, route: ERouteTable.WORKOUT_SCHEDULE_EDIT },
    { label: 'Cường độ', value: getActivityLabel(profile?.activity_level || null), route: ERouteTable.WORKOUT_INTENSITY_EDIT },
    { label: 'Ngày tập', value: days || 'Chưa chọn', route: ERouteTable.WORKOUT_SCHEDULE_EDIT },
    { label: 'Thời gian phù hợp', value: `${period}\n(${profile?.workout_start_time || '--:--'})`, route: ERouteTable.WORKOUT_SCHEDULE_EDIT },
  ]

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Điều chỉnh kế hoạch" />
      <View className="px-6 flex-1">
        {rows.map((row) => (
          <TouchableOpacity
            key={row.label}
            onPress={() => router.push(row.route)}
            className="bg-[#EEF1F4] rounded-2xl px-5 py-5 mb-3 flex-row items-center"
          >
            <Text className="text-base font-bold text-gray-900 flex-1">{row.label}</Text>
            <Text className="text-base text-secondary text-right mr-2">{row.value}</Text>
            <Ionicons name="chevron-forward" size={20} color="#7C8A99" />
          </TouchableOpacity>
        ))}
      </View>
      <View className="px-4 py-4 bg-white rounded-t-[32px]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-14 rounded-2xl bg-primary-main items-center justify-center"
        >
          <Text className="text-lg font-semibold text-white">Cập nhật kế hoạch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default WorkoutPlanEditScreen
