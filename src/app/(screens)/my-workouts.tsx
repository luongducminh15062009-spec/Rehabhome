import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ERouteTable } from '@/constants/route-table'
import WorkoutListCard from '@/components/explore/WorkoutListCard'
import { useAuth } from '@/context/auth-provider'
import {
  customToListItem,
  MyWorkoutsService,
  WorkoutListItem,
} from '@/services/my-workouts.service'

type TabKey = 'saved' | 'created'

const MyWorkoutsScreen = () => {
  const { user } = useAuth()
  const [tab, setTab] = useState<TabKey>('saved')
  const [items, setItems] = useState<WorkoutListItem[]>([])

  const load = useCallback(async () => {
    if (tab === 'saved') {
      setItems(await MyWorkoutsService.getSavedWorkouts(user?.id))
    } else {
      const created = await MyWorkoutsService.getCreatedWorkouts(user?.id)
      setItems(created.map((item) => customToListItem(item, user?.id)))
    }
  }, [tab, user?.id])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const openDetail = (item: WorkoutListItem) => {
    router.push({
      pathname: ERouteTable.EXPLORE_WORKOUT_DETAIL,
      params: { key: item.key, source: item.source },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#637381" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Bài tập của tôi</Text>
        <Text></Text>
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
            onCreatorPress={() =>
              router.push({
                pathname: ERouteTable.CREATOR_PROFILE,
                params: { name: item.creator },
              })
            }
          />
        ))}
        {items.length === 0 && (
          <View className="items-center py-20">
            <Ionicons name="barbell-outline" size={40} color="#94A3B8" />
            <Text className="text-base text-[#94A3B8] mt-3">
              {tab === 'saved' ? 'Chưa có bài tập đã lưu' : 'Chưa tạo bài tập nào'}
            </Text>
            {tab === 'created' && (
              <TouchableOpacity
                onPress={() => router.push(ERouteTable.CREATE_WORKOUT)}
                className="mt-4 h-11 px-5 rounded-full bg-primary-main items-center justify-center"
              >
                <Text className="text-white font-semibold">Tạo bài tập</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyWorkoutsScreen
