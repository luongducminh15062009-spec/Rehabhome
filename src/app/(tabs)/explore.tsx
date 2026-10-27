import React, { useCallback, useMemo, useState } from 'react'
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Discover, Setting4 } from 'iconsax-react-native'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import WorkoutListCard from '@/components/explore/WorkoutListCard'
import { useAuth } from '@/context/auth-provider'
import { MyWorkoutsService, WorkoutListItem } from '@/services/my-workouts.service'
import { EXERCISE_CATEGORIES } from '@/services/workout-plan.service'
import IconHeal from '~/assets/icons/IconHeal'

const CATEGORIES = ['Tất cả', ...EXERCISE_CATEGORIES] as const

const matchesCategory = (item: WorkoutListItem, category: string) => {
  if (category === 'Tất cả') return true
  return item.tags.includes(category)
}

const ExploreScreen = () => {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Tất cả')
  const [filterOpen, setFilterOpen] = useState(false)
  const [feed, setFeed] = useState<WorkoutListItem[]>([])

  const loadFeed = useCallback(async () => {
    setFeed(await MyWorkoutsService.getExploreWorkouts(user?.id))
  }, [user?.id])

  useFocusEffect(
    useCallback(() => {
      loadFeed()
    }, [loadFeed]),
  )

  const items = useMemo(
    () =>
      feed.filter(
        (item) =>
          matchesCategory(item, category) &&
          item.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [feed, category, query],
  )

  return (
    <ImageBackground source={images.bgHome} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <Text className="text-2xl font-bold text-gray-900">Thư viện bài tập</Text>
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.MY_WORKOUTS)}
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <IconHeal />
          </TouchableOpacity>
        </View>

        <View className="px-5 mb-4 flex-row items-center">
          <View className="flex-1 h-14 rounded-full bg-white px-5 flex-row items-center">
            <Ionicons name="search-outline" size={22} color="#94A3B8" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-3 text-base text-gray-900"
            />
          </View>
          <TouchableOpacity
            onPress={() => setFilterOpen(true)}
            activeOpacity={0.85}
            className="w-14 h-14 rounded-full bg-white items-center justify-center ml-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <Setting4
                size={22}
                color={category === 'Tất cả' ? '#64748B' : '#477AFF'}
                variant="Linear"
              />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        >
          {items.map((item) => (
            <WorkoutListCard
              key={`${item.source}-${item.key}`}
              item={item}
              onPress={() =>
                router.push({
                  pathname: ERouteTable.EXPLORE_WORKOUT_DETAIL,
                  params: { key: item.key, source: item.source },
                })
              }
              onCreatorPress={() =>
                router.push({
                  pathname: ERouteTable.CREATOR_PROFILE,
                  params: { name: item.creator },
                })
              }
            />
          ))}
          {items.length === 0 && (
            <View className="items-center py-16">
              <Discover size={40} color="#94A3B8" variant="Outline" />
              <Text className="text-base text-[#94A3B8] mt-3">Không tìm thấy bài tập</Text>
            </View>
          )}
        </ScrollView>

        <Modal
          visible={filterOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterOpen(false)}
        >
          <View className="flex-1 justify-end">
            <Pressable className="flex-1 bg-black/40" onPress={() => setFilterOpen(false)} />
            <View
              className="bg-white rounded-t-3xl px-5 pt-3"
              style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
            >
              <View className="w-10 h-1 rounded-full bg-[#E5E7EB] self-center mb-4" />
              <Text className="text-lg font-bold text-gray-900 mb-2">Danh mục</Text>
              {CATEGORIES.map((item) => {
                const active = category === item
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setCategory(item)
                      setFilterOpen(false)
                    }}
                    activeOpacity={0.75}
                    className="flex-row items-center justify-between py-4 border-b border-[#F1F3F5]"
                  >
                    <Text
                      className={`text-base ${active ? 'text-primary-main font-semibold' : 'text-gray-900'}`}
                    >
                      {item}
                    </Text>
                    {active && <Ionicons name="checkmark" size={20} color="#477AFF" />}
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default ExploreScreen
