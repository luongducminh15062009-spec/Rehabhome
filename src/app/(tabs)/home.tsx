import {
  ImageBackground,
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HomeHeader from '@/components/home-new/HomeHeader'
import WeekCalendar from '@/components/home-new/WeekCalendar'
import FitMindAICard from '@/components/home-new/FitMindAICard'
import QuickActions, { QuickActionId } from '@/components/home-new/QuickActions'
import MoodTrackerCard from '@/components/home-new/MoodTrackerCard'
import OverviewSection from '@/components/home-new/OverviewSection'
import TodayPlanSection from '@/components/home-new/TodayPlanSection'
import WaterModal from '@/components/home-new/WaterModal'
import SleepModal from '@/components/sleep/SleepModal'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import { useNotifications } from '@/context/notification-provider'
import { HomeService, HomeData } from '@/services/home.service'
import { isFutureMoodDate, MoodLevel } from '@/services/mood.service'
import { toast } from '@/components/common/ToastManager'

const Home = () => {
  const insets = useSafeAreaInsets()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { selectedDate, setSelectedDate, refreshTrigger } = useDate()
  const { unreadCount, onNewNotification, offNewNotification } = useNotifications()
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateLoading, setDateLoading] = useState(false)
  const [waterModalVisible, setWaterModalVisible] = useState(false)
  const [sleepModalVisible, setSleepModalVisible] = useState(false)

  const loadHomeData = async (date?: string) => {
    const dateToLoad = date || selectedDate
    if (!user?.id) {
      setLoading(false)
      setDateLoading(false)
      return
    }

    try {
      const data = await HomeService.getHomeData(user.id, dateToLoad)
      if (data) {
        setHomeData(data)
      } else {
        toast.error('Lỗi', 'Không thể tải dữ liệu. Vui lòng kiểm tra profile của bạn.')
      }
    } catch (error: any) {
      console.error('Error loading home data:', error)
      toast.error('Lỗi', `Đã xảy ra lỗi: ${error?.message || 'Không rõ nguyên nhân'}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
      setDateLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated || !user) {
      setLoading(false)
      router.replace(ERouteTable.SIGIN_IN)
      return
    }

    loadHomeData()
  }, [user, isAuthenticated, authLoading, refreshTrigger])

  useEffect(() => {
    const handleNewNotification = (notification: any) => {
      const goalTypes = [
        'goal_completed',
        'streak',
        'water_reminder',
        'meal_reminder',
        'exercise_reminder',
      ]
      if (goalTypes.includes(notification.type)) {
        const today = new Date().toISOString().split('T')[0]
        if (selectedDate === today) {
          loadHomeData(selectedDate)
        }
      }
    }

    onNewNotification(handleNewNotification)
    return () => offNewNotification(handleNewNotification)
  }, [selectedDate, onNewNotification, offNewNotification])

  const handleNotificationPress = () => {
    router.push(ERouteTable.NOTIFICATIONS)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setDateLoading(true)
    loadHomeData(date)
  }

  const handleWaterChange = async (delta: number) => {
    if (!user?.id) return

    try {
      if (delta > 0) {
        const success = await HomeService.updateWaterIntake(user.id, delta, selectedDate)
        if (success) loadHomeData(selectedDate)
        else toast.error('Lỗi', 'Không thể cập nhật lượng nước.')
      } else if (delta < 0) {
        const success = await HomeService.deleteLastWaterLog(user.id, selectedDate)
        if (success) loadHomeData(selectedDate)
        else toast.error('Lỗi', 'Không thể giảm nước. Có thể chưa có dữ liệu uống nước.')
      }
    } catch (error) {
      console.error('Error updating water:', error)
      toast.error('Lỗi', 'Đã xảy ra lỗi khi cập nhật.')
    }
  }

  const handleMoodCardPress = () => {
    if (isFutureMoodDate(selectedDate)) {
      toast.warning(
        'Ngày không hợp lệ',
        'Bạn không thể ghi nhận cảm xúc cho ngày trong tương lai.',
      )
      return
    }

    router.push({
      pathname: homeData?.todayMood
        ? ERouteTable.MOOD_DETAIL
        : ERouteTable.MOOD_ENTRY,
      params: { date: selectedDate },
    })
  }

  const handleQuickAction = (id: QuickActionId) => {
    switch (id) {
      case 'workout':
        router.push(ERouteTable.EXERCISE)
        break
      case 'sleep':
        setSleepModalVisible(true)
        break
      case 'mood':
        if (isFutureMoodDate(selectedDate)) {
          toast.warning(
            'Ngày không hợp lệ',
            'Bạn không thể ghi nhận cảm xúc cho ngày trong tương lai.',
          )
          break
        }
        router.push({
          pathname: ERouteTable.MOOD_ENTRY,
          params: { date: selectedDate },
        })
        break
      case 'water':
        setWaterModalVisible(true)
        break
      case 'breakfast':
      case 'lunch':
      case 'dinner':
      case 'snack':
        router.push({
          pathname: ERouteTable.SEARCH_FOOD,
          params: { mealType: id },
        })
        break
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadHomeData(selectedDate)
  }

  if (loading || !homeData) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#477AFF" />
      </View>
    )
  }

  const avatar =
    homeData.profile.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      homeData.profile.full_name || 'User',
    )}&background=477AFF&color=fff`

  return (
    <ImageBackground source={images.bgHome} className="flex-1" resizeMode="cover">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#477AFF"
            colors={['#477AFF']}
          />
        }
      >
        <HomeHeader
          userName={homeData.profile.full_name || 'Bạn'}
          avatar={avatar}
          notificationCount={unreadCount}
          onNotificationPress={handleNotificationPress}
          onSettingsPress={() => router.push(ERouteTable.USER)}
        />

        <WeekCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />

        <View style={{ opacity: dateLoading ? 0.55 : 1 }}>
          <FitMindAICard />
          {/*<QuickActions onPress={handleQuickAction} />*/}
          <MoodTrackerCard
            selectedMood={(homeData.todayMood?.mood_level as MoodLevel) || null}
            energyLevel={homeData.todayMood?.energy_level}
            onPress={handleMoodCardPress}
          />
          <OverviewSection
            data={homeData}
            onSeeMoodHistory={() => router.push(ERouteTable.MOOD_STATISTICS)}
          />
          <TodayPlanSection items={homeData.todayPlan} />

          <View className="mt-2 mb-1 flex-row items-start gap-1.5 rounded-2xl bg-[#FFF8E6] px-3 py-2.5">
            <Ionicons name="alert-circle" size={14} color="#F59E0B" style={{ marginTop: 1 }} />
            <Text className="flex-1 text-[11px] leading-4 text-[#9AA4B2]">
              FitMind chỉ mang tính tham khảo, không thay thế tư vấn y tế chuyên nghiệp.
            </Text>
          </View>
        </View>

        {dateLoading && (
          <View className="absolute top-40 left-0 right-0 items-center">
            <View className="bg-white rounded-2xl px-6 py-5 shadow-md items-center">
              <ActivityIndicator size="large" color="#477AFF" />
              <Text className="mt-3 text-gray-500 text-sm">Đang tải dữ liệu...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <WaterModal
        visible={waterModalVisible}
        initialAmount={homeData.waterIntake.current}
        targetAmount={homeData.waterIntake.target}
        onClose={() => setWaterModalVisible(false)}
        onChange={handleWaterChange}
      />

      <SleepModal
        visible={sleepModalVisible}
        onClose={() => setSleepModalVisible(false)}
      />
    </ImageBackground>
  )
}

export default Home
