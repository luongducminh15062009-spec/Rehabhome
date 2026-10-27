import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle } from 'react-native-svg'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import { ERouteTable } from '@/constants/route-table'
import {
  getFitnessGoalLabel,
  WorkoutPlanData,
  WorkoutPlanService,
} from '@/services/workout-plan.service'
import { WEEKDAY_OPTIONS, WeekdayValue } from '@/modules/profile-setup/types/profile-setup.types'
import { toast } from '@/components/common/ToastManager'
import { images } from '@/constants'

const TransactionScreen = () => {
  const { user } = useAuth()
  const [data, setData] = useState<WorkoutPlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    const result = await WorkoutPlanService.getPlanData(user.id)
    if (!result) toast.error('Lỗi', 'Không thể tải kế hoạch tập luyện.')
    else setData(result)
    setLoading(false)
    setRefreshing(false)
  }, [user?.id])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [loadData]),
  )

  if (loading && !data) {
    return (
      <ImageBackground source={images.bgHome} className="flex-1" resizeMode="cover">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#477AFF" />
        </View>
      </ImageBackground>
    )
  }

  const profile = data?.profile
  const workoutDays = (profile?.workout_days || []) as WeekdayValue[]
  const percent = data?.completionPercent || 0
  const circleSize = 116
  const strokeWidth = 10
  const radius = (circleSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (percent / 100) * circumference
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() + (day === 0 ? -6 : 1 - day))

  return (
    <ImageBackground source={images.bgHome} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              loadData()
            }}
            tintColor="#477AFF"
          />
        }
      >
        <View className="flex-row items-center justify-between mb-7">
          <Text className="text-2xl font-bold text-gray-900">Kế hoạch tập luyện</Text>
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.WORKOUT_PLAN_EDIT)}
            className="w-12 h-12 rounded-full bg-white items-center justify-center"
          >
            <Ionicons name="create-outline" size={25} color="#637381" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-[28px] p-5 mb-3">
          <Text className="text-sm text-secondary mb-1">Mục tiêu chính</Text>
          <Text className="text-xl font-bold text-gray-900 mb-4">
            {getFitnessGoalLabel(data?.goalDetail)}
          </Text>
          <Text className="text-sm font-semibold text-gray-900 mb-3">
            {percent}% <Text className="font-normal text-secondary">Hoàn thành</Text>
          </Text>
          <View className="h-2 bg-[#DCE6FA] rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-main rounded-full"
              style={{ width: `${percent}%` }}
            />
          </View>
        </View>

        <View className="flex-row justify-between mb-3">
          <View className="w-[48.5%] bg-white rounded-[24px] p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm text-secondary">Tần suất</Text>
              <Ionicons name="calendar" size={23} color="#22B8CF" />
            </View>
            <Text className="text-lg font-bold text-gray-900">{workoutDays.length} buổi/tuần</Text>
          </View>
          <View className="w-[48.5%] bg-white rounded-[24px] p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm text-secondary">Thời lượng TB</Text>
              <Ionicons name="time" size={23} color="#FF5630" />
            </View>
            <Text className="text-lg font-bold text-gray-900">
              {profile?.workout_duration_min || 45} phút
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push(ERouteTable.WORKOUT_PROGRESS)}
          activeOpacity={0.9}
          className="bg-white rounded-[28px] p-5 mb-3 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-5">Tiến độ hoàn thành</Text>
            <Text className="text-5xl font-bold text-[#55CBB9]">
              {percent}<Text className="text-2xl">%</Text>
            </Text>
            <Text className="text-base font-semibold text-gray-900 mt-2">
              {data?.completedSessions || 0}/{data?.plannedSessions || 0}{' '}
              <Text className="font-normal text-secondary">buổi</Text>
            </Text>
          </View>
          <View className="items-center justify-center">
            <Svg width={circleSize} height={circleSize} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke="#F0F2F5"
                strokeWidth={strokeWidth}
              />
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke="#55CBB9"
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>

        <View className="bg-white rounded-[28px] p-5 mb-3">
          <Text className="text-lg font-bold text-gray-900 mb-4">Lịch tập tuần này</Text>
          <View className="flex-row justify-between mb-5">
            {WEEKDAY_OPTIONS.map((item, index) => {
              const date = new Date(monday)
              date.setDate(monday.getDate() + index)
              const dateString = date.toISOString().split('T')[0]
              const planned = workoutDays.includes(item.value)
              const completed = data?.weeklyCompletedDates.has(dateString)
              return (
                <View key={item.value} className="items-center">
                  <Text className="text-xs text-secondary mb-1">{item.label}</Text>
                  <Text className="text-base font-bold text-gray-900">{date.getDate()}</Text>
                  <View
                    className="w-2 h-2 rounded-full mt-2"
                    style={{
                      backgroundColor: completed ? '#477AFF' : planned ? '#B9C7E9' : '#D9DEE5',
                    }}
                  />
                </View>
              )
            })}
          </View>
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.WEEKLY_WORKOUT_PLAN)}
            className="h-12 rounded-2xl bg-[#F5F6F8] items-center justify-center"
          >
            <Text className="text-base font-semibold text-gray-900">Xem chi tiết</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-[#DFF6F7] rounded-[28px] p-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="bulb" size={24} color="#17B8C8" />
              <Text className="text-lg font-bold text-[#17AFC0] ml-2">Gợi ý và phục hồi</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(ERouteTable.RECOVERY_SUGGESTIONS)}
              className="bg-[#1CBBD0] rounded-full px-4 py-2"
            >
              <Text className="text-white font-medium">Xem gợi ý</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-700 leading-5">
            Lắng nghe cơ thể bạn, nghỉ ngơi đúng cách và lựa chọn bài tập phù hợp để duy trì sự bền vững.
          </Text>
        </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default TransactionScreen
