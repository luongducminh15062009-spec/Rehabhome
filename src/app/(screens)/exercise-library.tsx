import React, { useState } from 'react'
import { Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Setting4 } from 'iconsax-react-native'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ERouteTable } from '@/constants/route-table'
import { EXERCISE_CATEGORIES, EXERCISE_LIBRARY } from '@/services/workout-plan.service'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'

const CATEGORIES = ['Tất cả', ...EXERCISE_CATEGORIES] as const

const ExerciseLibraryScreen = () => {
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Tất cả')
  const [filterOpen, setFilterOpen] = useState(false)
  const categories = CATEGORIES
  const items = EXERCISE_LIBRARY.filter(
    (item) =>
      (category === 'Tất cả' || item.category === category) &&
      item.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Thư viện bài tập" />
      <View className="px-6 flex-1">
        <View className="mb-4 flex-row items-center">
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {items.map((item) => (
            <TouchableOpacity key={item.key} onPress={() => router.push({ pathname: ERouteTable.WORKOUT_DETAIL, params: { key: item.key } })} className="bg-white rounded-[24px] p-2.5 mb-3 flex-row items-center">
              <Image source={item.image} className="w-[76px] h-[76px] rounded-2xl mr-4" />
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-2" numberOfLines={1}>{item.title}</Text>
                <Text className="text-sm text-secondary">{item.durationMinutes} phút • {item.difficulty} • <Text className="text-[#38BFA0]">{item.category}</Text></Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
            {categories.map((item) => {
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
  )
}

export default ExerciseLibraryScreen
