import React, { useCallback, useMemo, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import WorkoutListCard from '@/components/explore/WorkoutListCard'
import { useAuth } from '@/context/auth-provider'
import { MyWorkoutsService, WorkoutListItem } from '@/services/my-workouts.service'
import { EXERCISE_CATEGORIES } from '@/services/workout-plan.service'

const CATEGORIES = ['Tất cả', ...EXERCISE_CATEGORIES] as const

const matchesCategory = (item: WorkoutListItem, category: string) => {
  if (category === 'Tất cả') return true
  return item.tags.includes(category)
}

const formatLikes = (count: number) => {
  if (count >= 1000) {
    const value = (count / 1000).toFixed(1).replace('.', ',')
    return `${value.replace(/,0$/, '')}K`
  }
  return String(count)
}

const CreatorProfileScreen = () => {
  const { user } = useAuth()
  const { name } = useLocalSearchParams<{ name?: string }>()
  const creatorName = name ? decodeURIComponent(name) : 'Rehab Home'
  const isRehabHome = creatorName === 'Rehab Home'
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Tất cả')
  const [allItems, setAllItems] = useState<WorkoutListItem[]>([])

  const load = useCallback(async () => {
    setAllItems(
      await MyWorkoutsService.getCreatorWorkouts(creatorName, {
        currentUserId: user?.id,
      }),
    )
  }, [creatorName, user?.id])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const items = useMemo(
    () => allItems.filter((item) => matchesCategory(item, category)),
    [allItems, category],
  )

  const totalLikes = useMemo(
    () => (isRehabHome ? 16700 : allItems.reduce((sum, item) => sum + item.likes, 0)),
    [isRehabHome, allItems],
  )

  const openDetail = (item: WorkoutListItem) => {
    router.push({
      pathname: ERouteTable.EXPLORE_WORKOUT_DETAIL,
      params: { key: item.key, source: item.source },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      <View className="px-5 pt-2 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#637381" />
        </TouchableOpacity>
      </View>

      <View className="items-center px-5 mb-5">
        <Image
          source={isRehabHome ? images.logoApp : images.logoApp2}
          className="w-24 h-24 rounded-full mb-3 bg-white"
        />
        <Text className="text-2xl font-bold text-gray-900 mb-1">{creatorName}</Text>
        <Text className="text-sm text-[#94A3B8]">{formatLikes(totalLikes)} Lượt thích</Text>
      </View>

      <View className="mb-4" style={{ height: 44 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center' }}
        >
          {CATEGORIES.map((item) => {
            const active = category === item
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                activeOpacity={0.85}
                className="h-11 px-5 rounded-full mr-2.5 items-center justify-center"
                style={{
                  backgroundColor: active ? '#477AFF' : '#FFFFFF',
                  borderWidth: active ? 0 : 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text
                  className={`text-sm ${active ? 'text-white font-semibold' : 'text-gray-900'}`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {items.map((item) => (
          <WorkoutListCard
            key={`${item.source}-${item.key}`}
            item={item}
            variant="mine"
            onPress={() => openDetail(item)}
          />
        ))}
        {items.length === 0 && (
          <View className="items-center py-16">
            <Ionicons name="barbell-outline" size={40} color="#94A3B8" />
            <Text className="text-base text-[#94A3B8] mt-3">Chưa có bài tập công khai</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreatorProfileScreen
