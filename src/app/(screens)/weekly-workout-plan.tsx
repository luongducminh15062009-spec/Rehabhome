import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import { ERouteTable } from '@/constants/route-table'
import {
  WorkoutPlanItem,
  WorkoutPlanService,
  exerciseImageSource,
} from '@/services/workout-plan.service'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'

const formatDate = (date: Date) => date.toISOString().split('T')[0]

const WeeklyWorkoutPlanScreen = () => {
  const { user } = useAuth()
  const [items, setItems] = useState<WorkoutPlanItem[]>([])
  const [filter, setFilter] = useState('Tất cả')
  const [filterOpen, setFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const now = useMemo(() => new Date(), [])
  const monday = useMemo(() => {
    const date = new Date(now)
    date.setDate(now.getDate() + (now.getDay() === 0 ? -6 : 1 - now.getDay()))
    return date
  }, [now])
  const sunday = useMemo(() => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + 6)
    return date
  }, [monday])

  const load = useCallback(async () => {
    if (!user?.id) return setLoading(false)
    setItems(await WorkoutPlanService.getWeeklyPlan(user.id, formatDate(monday), formatDate(sunday)))
    setLoading(false)
  }, [monday, sunday, user?.id])

  useFocusEffect(useCallback(() => { load() }, [load]))

  const categories = ['Tất cả', ...Array.from(new Set(items.map((item) => item.category)))]
  const filtered = filter === 'Tất cả' ? items : items.filter((item) => item.category === filter)
  const completed = items.filter((item) => item.status === 'completed').length
  const totalMinutes = items.reduce((sum, item) => sum + item.duration_minutes, 0)
  const percent = items.length ? Math.round((completed / items.length) * 100) : 0

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Kế hoạch tuần" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-[28px] p-4 mb-7 flex-row justify-between">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, index) => {
            const date = new Date(monday)
            date.setDate(monday.getDate() + index)
            const dateString = formatDate(date)
            const hasWorkout = items.some((item) => item.scheduled_date === dateString)
            const done = items.some((item) => item.scheduled_date === dateString && item.status === 'completed')
            return (
              <View key={label} className="items-center">
                <Text className="text-xs text-secondary mb-1">{label}</Text>
                <Text className="text-base font-bold text-gray-900">{date.getDate()}</Text>
                <View className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: done ? '#22C55E' : hasWorkout ? '#477AFF' : '#D9DEE5' }} />
              </View>
            )
          })}
        </View>

        <Text className="text-2xl font-medium text-gray-900 mb-4">Buổi tập sắp tới</Text>
        <View className="mb-5">
          <TouchableOpacity
            onPress={() => setFilterOpen((open) => !open)}
            activeOpacity={0.85}
            className="h-14 rounded-2xl bg-white border border-[#E6E8EC] px-4 flex-row items-center justify-between"
          >
            <Text className="text-base text-gray-900">{filter}</Text>
            <Ionicons name={filterOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
          </TouchableOpacity>
          {filterOpen && (
            <View className="mt-2 rounded-2xl bg-white border border-[#E6E8EC] overflow-hidden">
              {categories.map((item) => {
                const active = filter === item
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setFilter(item)
                      setFilterOpen(false)
                    }}
                    className="h-12 px-4 flex-row items-center justify-between border-b border-[#F1F3F5]"
                  >
                    <Text className={`text-base ${active ? 'text-primary-main font-semibold' : 'text-gray-900'}`}>
                      {item}
                    </Text>
                    {active && <Ionicons name="checkmark" size={18} color="#477AFF" />}
                  </TouchableOpacity>
                )
              })}
            </View>
          )}
        </View>

        {loading ? <ActivityIndicator color="#477AFF" /> : filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push({ pathname: ERouteTable.WORKOUT_DETAIL, params: { id: item.id } })}
            className="bg-white rounded-[24px] p-2.5 mb-3 flex-row items-center"
          >
            <Image source={exerciseImageSource(item.exercise_key, item.image_url)} className="w-[88px] h-[88px] rounded-2xl mr-3 bg-gray-100" />
            <View className="flex-1">
              <View className={`self-start px-2 py-1 rounded-full mb-1 ${item.status === 'completed' ? 'bg-green-50' : 'bg-red-50'}`}>
                <Text className={`text-[10px] ${item.status === 'completed' ? 'text-green-600' : 'text-red-500'}`}>{item.status === 'completed' ? 'Hoàn thành' : 'Chưa bắt đầu'}</Text>
              </View>
              <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.title}</Text>
              <Text className="text-sm text-secondary mt-1">{item.scheduled_date}</Text>
              <Text className="text-sm text-secondary">{item.duration_minutes} phút • {item.difficulty} • <Text className="text-[#38BFA0]">{item.category}</Text></Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => router.push(ERouteTable.EXERCISE_LIBRARY)} className="h-14 bg-[#E8EDFF] rounded-2xl items-center justify-center my-2">
          <Text className="text-lg font-semibold text-primary-main">Thư viện bài tập</Text>
        </TouchableOpacity>

        <View className="bg-white rounded-[28px] p-5 mt-3">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Tiến độ tuần này</Text>
            <Text className="text-lg font-bold text-gray-900">{completed}/{items.length} <Text className="font-normal text-secondary">buổi</Text></Text>
          </View>
          <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3"><View className="h-full bg-[#22C55E]" style={{ width: `${percent}%` }} /></View>
          <View className="flex-row justify-between mb-4"><Text className="text-secondary">Hoàn thành</Text><Text className="text-lg font-bold">{percent}%</Text></View>
          <View className="flex-row justify-between">
            <View className="w-[48%] bg-[#F5F6F8] rounded-2xl p-3"><Text className="text-sm text-secondary">Thời gian tập</Text><Text className="text-lg font-bold mt-2">{items.filter(i => i.status === 'completed').reduce((s, i) => s + i.duration_minutes, 0)}/{totalMinutes} phút</Text></View>
            <View className="w-[48%] bg-[#F5F6F8] rounded-2xl p-3"><Text className="text-sm text-secondary">Calo đốt cháy</Text><Text className="text-lg font-bold mt-2">{completed * 140}/{items.length * 140} kcal</Text></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default WeeklyWorkoutPlanScreen
