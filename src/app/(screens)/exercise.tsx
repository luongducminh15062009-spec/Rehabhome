import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import { ERouteTable } from '@/constants/route-table'
import { HomeData, HomeService, TodayPlanItem } from '@/services/home.service'
import { exerciseImageSource } from '@/services/workout-plan.service'
import { toast } from '@/components/common/ToastManager'
import WeekCalendar from '@/components/home-new/WeekCalendar'

const PlanCard = ({ item, onPress }: { item: TodayPlanItem; onPress: () => void }) => {
  const completed = item.status === 'completed'
  const image = exerciseImageSource(item.exerciseKey, item.imageUrl)

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white rounded-[24px] p-3 mb-3 flex-row items-center"
    >
      {image ? (
        <Image source={image} className="w-[76px] h-[76px] rounded-2xl mr-4 bg-gray-100" />
      ) : (
        <View
          className="w-[76px] h-[76px] rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: item.bgColor }}
        >
          <Ionicons
            name={item.icon as keyof typeof Ionicons.glyphMap}
            size={32}
            color={item.color}
          />
        </View>
      )}

      <View className="flex-1">
        <View
          className={`self-start rounded-full px-3 py-1 mb-1.5 ${
            completed ? 'bg-[#E8F8EE]' : 'bg-[#FEECEC]'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              completed ? 'text-[#22C55E]' : 'text-[#F04438]'
            }`}
          >
            {completed ? 'Hoàn thành' : 'Chưa bắt đầu'}
          </Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-sm text-secondary">
          {item.durationMin} phút
          <Text> • </Text>
          {item.difficulty}
          <Text> • </Text>
          <Text className="text-[#38BFA0]">{item.category}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const ExerciseScreen = () => {
  const { user } = useAuth()
  const { selectedDate, setSelectedDate } = useDate()
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateLoading, setDateLoading] = useState(false)

  const loadPlan = useCallback(
    async (date = selectedDate) => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const result = await HomeService.getHomeData(user.id, date)
        if (!result) {
          toast.error('Lỗi', 'Không thể tải kế hoạch tập luyện.')
          return
        }
        setData(result)
      } catch (error) {
        console.error('Error loading workout plan:', error)
        toast.error('Lỗi', 'Không thể tải kế hoạch tập luyện.')
      } finally {
        setLoading(false)
        setRefreshing(false)
        setDateLoading(false)
      }
    },
    [selectedDate, user?.id],
  )

  useFocusEffect(
    useCallback(() => {
      loadPlan()
    }, [loadPlan]),
  )

  const handleDateSelect = (date: string) => {
    if (date === selectedDate) return
    setDateLoading(true)
    setSelectedDate(date)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadPlan()
  }

  const handlePlanPress = (item: TodayPlanItem) => {
    if (item.status === 'completed') {
      toast.success('Đã hoàn thành', `${item.title} đã được ghi nhận hôm nay.`)
      return
    }
    if (item.exerciseKey) {
      router.push({
        pathname: ERouteTable.WORKOUT_DETAIL,
        params: { id: item.id, key: item.exerciseKey },
      })
      return
    }
    router.push(ERouteTable.SEARCH_EXERCISE)
  }

  const completedCount =
    data?.todayPlan.filter((item) => item.status === 'completed').length || 0
  const totalCount = data?.todayPlan.length || 3
  const progress = totalCount > 0 ? completedCount / totalCount : 0

  if (loading && !data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator size="large" color="#477AFF" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      <View className="flex-row items-center px-6 pt-5 mb-5">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="w-14 h-14 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={27} color="#637381" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold text-gray-900 mr-14">
          Kế hoạch hôm nay
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#477AFF"
            colors={['#477AFF']}
          />
        }
      >
        <WeekCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />

        <View className="bg-white rounded-[28px] p-5 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Tiến độ hôm nay</Text>
          <View className="h-2.5 bg-[#EDF0F3] rounded-full overflow-hidden mb-3">
            <View
              className="h-full bg-[#22C55E] rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-gray-700">Hoàn thành</Text>
            <Text className="text-base text-gray-900">
              {completedCount}/{totalCount}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Việc cần làm</Text>
          <TouchableOpacity onPress={() => router.push(ERouteTable.SEARCH_EXERCISE)}>
            <Text className="text-base text-secondary">Xem thêm</Text>
          </TouchableOpacity>
        </View>

        <View style={{ opacity: dateLoading ? 0.5 : 1 }}>
          {data?.todayPlan.map((item) => (
            <PlanCard
              key={item.id}
              item={item}
              onPress={() => handlePlanPress(item)}
            />
          ))}
        </View>

        {dateLoading && (
          <View className="absolute top-72 left-0 right-0 items-center">
            <ActivityIndicator size="large" color="#477AFF" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ExerciseScreen
