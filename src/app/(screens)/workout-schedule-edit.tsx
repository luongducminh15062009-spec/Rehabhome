import React, { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import {
  WEEKDAY_OPTIONS,
  WeekdayValue,
  WORKOUT_DURATION_OPTIONS,
  WORKOUT_PERIOD_OPTIONS,
  WorkoutPeriodType,
} from '@/modules/profile-setup/types/profile-setup.types'
import { WorkoutPlanService } from '@/services/workout-plan.service'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'
import { toast } from '@/components/common/ToastManager'

const WorkoutScheduleEditScreen = () => {
  const { user } = useAuth()
  const [days, setDays] = useState<WeekdayValue[]>([1, 2, 4, 5])
  const [period, setPeriod] = useState<WorkoutPeriodType>('evening')
  const [startTime, setStartTime] = useState('19:00')
  const [duration, setDuration] = useState(45)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!user?.id) return setLoading(false)
        const data = await WorkoutPlanService.getPlanData(user.id)
        if (data) {
          setDays((data.profile.workout_days || []) as WeekdayValue[])
          setPeriod(data.profile.workout_period || 'evening')
          setStartTime(data.profile.workout_start_time || '19:00')
          setDuration(data.profile.workout_duration_min || 45)
        }
        setLoading(false)
      }
      load()
    }, [user?.id]),
  )

  const toggleDay = (day: WeekdayValue) => {
    setDays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day],
    )
  }

  const selectPeriod = (value: WorkoutPeriodType) => {
    setPeriod(value)
    const option = WORKOUT_PERIOD_OPTIONS.find((item) => item.value === value)
    if (option && !option.times.includes(startTime)) setStartTime(option.times[1] || option.times[0])
  }

  const save = async () => {
    if (!user?.id) return
    if (!days.length) return toast.warning('Chưa chọn ngày', 'Vui lòng chọn ít nhất một ngày tập.')
    setSaving(true)
    const success = await WorkoutPlanService.updatePlan(user.id, {
      workout_days: days,
      workout_period: period,
      workout_start_time: startTime,
      workout_duration_min: duration,
    })
    setSaving(false)
    if (!success) return toast.error('Lỗi', 'Không thể cập nhật lịch tập.')
    toast.success('Đã cập nhật', 'Lịch tập luyện đã được lưu.')
    router.back()
  }

  if (loading) return <View className="flex-1 items-center justify-center bg-[#F7F8FA]"><ActivityIndicator color="#477AFF" /></View>

  const selectedPeriod = WORKOUT_PERIOD_OPTIONS.find((item) => item.value === period)!

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Thời gian phù hợp" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <Text className="text-base font-bold text-gray-900 mb-3">Chọn ngày trong tuần</Text>
        <View className="flex-row justify-between mb-7">
          {WEEKDAY_OPTIONS.map((item) => {
            const active = days.includes(item.value)
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => toggleDay(item.value)}
                className="w-11 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: active ? '#477AFF' : '#FFFFFF' }}
              >
                <Text className={`text-xs mb-2 ${active ? 'text-white' : 'text-secondary'}`}>{item.label}</Text>
                <View className={`w-5 h-5 rounded-full border items-center justify-center ${active ? 'bg-white border-white' : 'border-secondary'}`}>
                  {active && <Ionicons name="checkmark" size={14} color="#477AFF" />}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <Text className="text-base font-bold text-gray-900 mb-3">Chọn khung giờ phù hợp</Text>
        {WORKOUT_PERIOD_OPTIONS.map((item) => {
          const active = period === item.value
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => selectPeriod(item.value)}
              className="rounded-2xl p-4 mb-3 flex-row items-center border"
              style={{ borderColor: active ? '#477AFF' : 'transparent', backgroundColor: active ? '#EEF3FF' : '#EEF1F4' }}
            >
              <View className="w-12 h-12 rounded-xl bg-white items-center justify-center mr-4">
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={25} color={item.value === 'evening' ? '#22B8CF' : '#F59E0B'} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
                <Text className="text-sm text-secondary">{item.range}</Text>
              </View>
              <View className="w-6 h-6 rounded-full border-2 items-center justify-center" style={{ borderColor: active ? '#477AFF' : '#7C8A99', backgroundColor: active ? '#477AFF' : 'transparent' }}>
                {active && <Ionicons name="checkmark" size={15} color="#fff" />}
              </View>
            </TouchableOpacity>
          )
        })}

        <Text className="text-base font-bold text-gray-900 mt-3 mb-3">Thời gian bắt đầu gợi ý</Text>
        <View className="flex-row gap-3 mb-7">
          {selectedPeriod.times.slice(-4).map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => setStartTime(time)}
              className="px-4 py-3 rounded-full"
              style={{ backgroundColor: startTime === time ? '#477AFF' : '#FFFFFF' }}
            >
              <Text className={startTime === time ? 'text-white font-semibold' : 'text-gray-800'}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-base font-bold text-gray-900 mb-3">Thời lượng trung bình</Text>
        {WORKOUT_DURATION_OPTIONS.map((item) => {
          const active = duration === item.value
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setDuration(item.value)}
              className="rounded-2xl px-4 py-4 mb-3 flex-row items-center border"
              style={{ borderColor: active ? '#477AFF' : 'transparent', backgroundColor: active ? '#EEF3FF' : '#EEF1F4' }}
            >
              <Text className="text-base font-bold text-gray-900 flex-1">{item.label}</Text>
              <View className="w-6 h-6 rounded-full border-2 items-center justify-center" style={{ borderColor: active ? '#477AFF' : '#7C8A99', backgroundColor: active ? '#477AFF' : 'transparent' }}>
                {active && <Ionicons name="checkmark" size={15} color="#fff" />}
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-3 py-4 bg-white rounded-t-[28px]">
        <TouchableOpacity onPress={save} disabled={saving} className="h-14 bg-primary-main rounded-2xl items-center justify-center">
          {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-lg font-semibold text-white">Lưu thay đổi</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default WorkoutScheduleEditScreen
