import React, { useMemo, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import { EXERCISE_LIBRARY, WorkoutPlanService } from '@/services/workout-plan.service'
import { WorkoutPeriodType } from '@/modules/profile-setup/types/profile-setup.types'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'
import { toast } from '@/components/common/ToastManager'

const periods: {
  id: WorkoutPeriodType
  title: string
  time: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
}[] = [
  { id: 'morning', title: 'Sáng', time: '06:00 - 11:00', icon: 'sunny-outline', color: '#FF7868' },
  { id: 'noon', title: 'Trưa', time: '11:00 - 14:00', icon: 'sunny', color: '#FBBF24' },
  { id: 'evening', title: 'Tối', time: '18:00 - 21:00', icon: 'moon', color: '#22B8CF' },
]

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const AddWorkoutSessionScreen = () => {
  const { key } = useLocalSearchParams<{ key: string }>()
  const { user } = useAuth()
  const exercise = EXERCISE_LIBRARY.find((item) => item.key === key)
  const [period, setPeriod] = useState<WorkoutPeriodType>('evening')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [showDates, setShowDates] = useState(false)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const dates = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const value = new Date()
        value.setDate(value.getDate() + index)
        return value.toISOString().split('T')[0]
      }),
    [],
  )

  const save = async () => {
    if (!user?.id || !exercise) {
      toast.error('Lỗi', 'Không tìm thấy bài tập.')
      return
    }
    setSaving(true)
    const ok = await WorkoutPlanService.addPlanItem(user.id, date, exercise, period)
    setSaving(false)
    if (ok) setSuccess(true)
    else toast.error('Lỗi', 'Không thể thêm buổi tập.')
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Thêm buổi tập" />
      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-xl font-bold text-gray-900 mb-4">Chọn ngày</Text>
        <TouchableOpacity
          onPress={() => setShowDates(!showDates)}
          activeOpacity={0.85}
          className="h-16 border border-gray-300 rounded-2xl px-4 flex-row items-center bg-white"
        >
          <Ionicons name="calendar-outline" size={24} color="#7C8A99" />
          <Text className="flex-1 ml-3 text-lg text-gray-800">{formatDate(date)}</Text>
          <Ionicons name="chevron-down" size={24} color="#7C8A99" />
        </TouchableOpacity>
        {showDates && (
          <View className="bg-white rounded-2xl mt-2 p-2 border border-gray-100">
            {dates.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setDate(item)
                  setShowDates(false)
                }}
                className="p-3"
              >
                <Text className="text-base text-gray-800">{formatDate(item)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Chọn khung giờ phù hợp
        </Text>
        {periods.map((item) => {
          const selected = period === item.id
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setPeriod(item.id)}
              activeOpacity={0.85}
              className="h-[86px] rounded-2xl px-5 mb-3 flex-row items-center border"
              style={{
                backgroundColor: selected ? '#E8EDFF' : '#EEF1F4',
                borderColor: selected ? '#477AFF' : 'transparent',
              }}
            >
              <View className="w-14 h-14 rounded-2xl bg-white/50 items-center justify-center mr-4">
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold">{item.title}</Text>
                <Text className="text-secondary text-base">{item.time}</Text>
              </View>
              <Ionicons
                name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={selected ? '#477AFF' : '#7C8A99'}
              />
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <View className="px-4 pb-5 pt-3 bg-white">
        <TouchableOpacity
          onPress={save}
          disabled={saving}
          className="h-14 bg-primary-main rounded-2xl items-center justify-center"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          <Text className="text-white text-lg font-semibold">
            {saving ? 'Đang lưu...' : 'Xác nhận'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={success} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="w-full bg-white rounded-[28px] p-7 items-center">
            <TouchableOpacity
              onPress={() => router.replace('/(screens)/weekly-workout-plan')}
              className="self-end"
            >
              <Ionicons name="close" size={28} color="#7C8A99" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold mt-1">Thêm buổi tập</Text>
            <Text className="text-secondary text-base mt-4 mb-8">Thêm buổi tập thành công!</Text>
            <TouchableOpacity
              onPress={() => router.replace('/(screens)/weekly-workout-plan')}
              className="w-full h-14 bg-primary-main rounded-2xl items-center justify-center"
            >
              <Text className="text-white text-lg">Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default AddWorkoutSessionScreen
