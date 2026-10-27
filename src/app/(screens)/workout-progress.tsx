import React, { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import {
  WorkoutPlanData,
  WorkoutPlanService,
} from '@/services/workout-plan.service'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'

const WorkoutProgressScreen = () => {
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
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator size="large" color="#477AFF" />
      </View>
    )
  }

  const percent = data?.completionPercent || 0
  const counts = data?.weeklyCounts || [0, 0, 0, 0]
  const max = Math.max(...counts, 4)

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Tiến độ tập luyện" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <Text className="text-2xl font-medium text-gray-900 mb-5">Tổng quan</Text>
        <View className="bg-white rounded-[28px] p-5 mb-10">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Tỷ lệ hoàn thành</Text>
            <Text className="text-lg font-bold text-gray-900">
              {data?.completedSessions || 0}/
              <Text className="font-normal text-secondary">{data?.plannedSessions || 0} buổi</Text>
            </Text>
          </View>
          <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <View className="h-full bg-[#22C55E]" style={{ width: `${percent}%` }} />
          </View>
          <View className="flex-row justify-between mb-5">
            <Text className="text-base text-secondary">Hoàn thành</Text>
            <Text className="text-lg font-bold text-gray-900">{percent}%</Text>
          </View>

          <View className="bg-[#F5F6F8] rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between">
              <View>
                <Text className="text-base text-secondary mb-2">Buổi tập đã hoàn thành</Text>
                <Text className="text-xl font-bold text-gray-900">{data?.completedSessions || 0} buổi</Text>
              </View>
              <Ionicons name="calendar" size={28} color="#22B8CF" />
            </View>
          </View>
          <View className="flex-row justify-between">
            <View className="w-[48.5%] bg-[#F5F6F8] rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base text-secondary">Phút tập</Text>
                <Ionicons name="time" size={26} color="#22C55E" />
              </View>
              <Text className="text-xl font-bold text-gray-900">{data?.totalMinutes || 0} phút</Text>
            </View>
            <View className="w-[48.5%] bg-[#F5F6F8] rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base text-secondary">Calo đốt cháy</Text>
                <Ionicons name="flame" size={26} color="#FF5630" />
              </View>
              <Text className="text-xl font-bold text-gray-900">{(data?.totalCalories || 0).toLocaleString()} kcal</Text>
            </View>
          </View>
        </View>

        <Text className="text-2xl font-medium text-gray-900 mb-5">Tiến độ</Text>
        <Text className="text-sm text-secondary mb-4">Bài tập</Text>
        <View className="h-60 flex-row items-end justify-around border-b border-gray-300 px-4">
          {counts.map((count, index) => (
            <View key={index} className="items-center justify-end h-full w-16">
              <Text className="text-xs text-secondary mb-1">{count}</Text>
              <View
                className={`w-14 rounded-t-2xl ${index % 2 === 0 ? 'bg-primary-main' : 'bg-[#55CBB9]'}`}
                style={{ height: `${Math.max(4, (count / max) * 75)}%` }}
              />
              <Text className="text-xs text-secondary mt-3">Tuần {index + 1}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default WorkoutProgressScreen
