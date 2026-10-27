import React, { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import { HomeData, HomeService } from '@/services/home.service'
import { getMoodMeta } from '@/services/mood.service'
import { WorkoutPlanData, WorkoutPlanService } from '@/services/workout-plan.service'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'

const SuggestionCard = ({
  icon,
  title,
  description,
  color,
  background,
  progress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  color: string
  background: string
  progress?: number
}) => (
  <View className="rounded-[28px] p-4 mb-4 flex-row" style={{ backgroundColor: background }}>
    <View className="w-14 h-14 rounded-2xl bg-white/50 items-center justify-center mr-4">
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <View className="flex-1">
      <Text className="text-lg font-bold text-gray-900 mb-1">{title}</Text>
      <Text className="text-base text-secondary leading-6">{description}</Text>
      {progress !== undefined && (
        <View className="h-2 bg-white/60 rounded-full mt-3 overflow-hidden">
          <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: color }} />
        </View>
      )}
    </View>
  </View>
)

const RecoverySuggestionsScreen = () => {
  const { user } = useAuth()
  const [plan, setPlan] = useState<WorkoutPlanData | null>(null)
  const [home, setHome] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!user?.id) return setLoading(false)
        const [planData, homeData] = await Promise.all([
          WorkoutPlanService.getPlanData(user.id),
          HomeService.getHomeData(user.id),
        ])
        setPlan(planData)
        setHome(homeData)
        setLoading(false)
      }
      load()
    }, [user?.id]),
  )

  if (loading) return <View className="flex-1 items-center justify-center bg-[#F7F8FA]"><ActivityIndicator color="#477AFF" /></View>

  const waterPercent = home?.waterIntake.target
    ? Math.min(100, Math.round((home.waterIntake.current / home.waterIntake.target) * 100))
    : 0
  const mood = getMoodMeta(home?.todayMood?.mood_level)

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Gợi ý & phục hồi" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Hôm nay, {plan?.profile.full_name || 'bạn'} ơi 💕
        </Text>
        <Text className="text-lg text-secondary mb-9">Cơ thể bạn xứng đáng được chăm sóc.</Text>

        <SuggestionCard
          icon="body-outline"
          title="Giãn cơ thư giãn"
          description="Giúp giảm căng cứng và phục hồi cơ bắp."
          color="#477AFF"
          background="#E8EDFF"
        />
        <SuggestionCard
          icon="leaf-outline"
          title="Ngày nghỉ hợp lý"
          description={`Bạn đã hoàn thành ${plan?.completedSessions || 0} buổi trong tháng. Hãy nghỉ ngơi hoặc tập nhẹ nhé!`}
          color="#20C77A"
          background="#E2F6ED"
        />
        <SuggestionCard
          icon="water"
          title="Uống đủ nước"
          description={`Bạn đã uống ${((home?.waterIntake.current || 0) / 1000).toFixed(1)}L nước hôm nay. Mục tiêu: ${((home?.waterIntake.target || 0) / 1000).toFixed(1)}L`}
          color="#16B8D4"
          background="#DFF5F8"
          progress={waterPercent}
        />
        <SuggestionCard
          icon="happy-outline"
          title="Gợi ý theo tâm trạng"
          description={`Bạn đang cảm thấy ${mood?.label || 'chưa ghi nhận'}. Thử Đi bộ tại chỗ hoặc Kéo giãn toàn thân sau vận động để lấy lại năng lượng.`}
          color="#F5B51B"
          background="#FFF6DF"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default RecoverySuggestionsScreen
