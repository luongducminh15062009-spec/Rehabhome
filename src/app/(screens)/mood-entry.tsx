import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import {
  isFutureMoodDate,
  MOOD_OPTIONS,
  MoodLevel,
  MoodService,
} from '@/services/mood.service'
import MoodIcon from '@/components/mood/MoodIcon'
import { toast } from '@/components/common/ToastManager'

const MoodEntryScreen = () => {
  const { date } = useLocalSearchParams<{ date?: string }>()
  const { user } = useAuth()
  const { selectedDate, triggerRefresh } = useDate()
  const targetDate = date || selectedDate
  const isFutureDate = isFutureMoodDate(targetDate)

  const [moodLevel, setMoodLevel] = useState<MoodLevel>(4)
  const [energyLevel, setEnergyLevel] = useState(7)
  const [exercised, setExercised] = useState(true)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)

  useEffect(() => {
    const loadMood = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const mood = await MoodService.getMoodForDate(user.id, targetDate)
      if (mood) {
        setMoodLevel(mood.mood_level)
        setEnergyLevel(mood.energy_level)
        setExercised(mood.exercised)
        setNotes(mood.notes || '')
      }
      setLoading(false)
    }

    loadMood()
  }, [targetDate, user?.id])

  const handleSave = async () => {
    if (isFutureDate) {
      toast.warning(
        'Ngày không hợp lệ',
        'Bạn không thể ghi nhận cảm xúc cho ngày trong tương lai.',
      )
      return
    }

    if (!user?.id) {
      toast.error('Lỗi', 'Vui lòng đăng nhập để ghi nhận cảm xúc.')
      return
    }

    setSaving(true)
    const result = await MoodService.upsertMood({
      userId: user.id,
      date: targetDate,
      moodLevel,
      energyLevel,
      exercised,
      notes: notes.trim() || undefined,
    })
    setSaving(false)

    if (!result) {
      toast.error(
        'Không thể lưu',
        'Vui lòng kiểm tra đã chạy supabase/mood_logs_schema.sql.',
      )
      return
    }

    triggerRefresh()
    setSuccessVisible(true)
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator size="large" color="#477AFF" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <View className="flex-row items-center px-6 pt-5 mb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-14 h-14 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#637381" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold text-gray-900 mr-14">
          Ghi nhận cảm xúc
        </Text>
      </View>

      <View className="px-6 flex-1">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Hôm nay bạn cảm thấy thế nào?
        </Text>
        <View className="bg-white rounded-3xl px-4 py-5 flex-row justify-between mb-7">
          {MOOD_OPTIONS.map((mood) => {
            const selected = moodLevel === mood.level
            return (
              <TouchableOpacity
                key={mood.level}
                onPress={() => setMoodLevel(mood.level)}
                className="w-14 h-14 items-center justify-center"
              >
                <MoodIcon level={mood.level} active={selected} size={48} />
              </TouchableOpacity>
            )
          })}
        </View>

        <Text className="text-xl font-bold text-gray-900 mb-4">Mức năng lượng</Text>
        <View className="mb-8">
          <View className="h-2 bg-[#E9EDF2] rounded-full mb-3">
            <View
              className="h-2 bg-primary-main rounded-full"
              style={{ width: `${((energyLevel - 1) / 9) * 100}%` }}
            />
            <View
              className="absolute w-7 h-7 rounded-full bg-primary-main -top-2.5"
              style={{ left: `${((energyLevel - 1) / 9) * 100}%`, marginLeft: -14 }}
            />
            <View className="absolute inset-0 flex-row">
              {Array.from({ length: 10 }).map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => setEnergyLevel(index + 1)}
                  className="flex-1 h-10 -top-4"
                />
              ))}
            </View>
          </View>
          <View className="flex-row justify-between px-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <Text key={index} className="text-base text-gray-700">
                {index + 1}
              </Text>
            ))}
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-900 mb-4">
          Hôm nay bạn có vận động không?
        </Text>
        <View className="flex-row gap-3 mb-7">
          {[true, false].map((value) => (
            <TouchableOpacity
              key={String(value)}
              onPress={() => setExercised(value)}
              className="flex-1 py-4 rounded-2xl items-center border"
              style={{
                borderColor: exercised === value ? '#477AFF' : '#E5E7EB',
                backgroundColor: exercised === value ? '#EEF3FF' : '#EEF1F4',
              }}
            >
              <Text className="text-lg font-semibold text-gray-900">
                {value ? 'Có' : 'Không'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-xl font-bold text-gray-900 mb-4">
          Ghi chú <Text className="font-normal">(Tùy chọn)</Text>
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Chia sẻ thêm về cảm xúc..."
          placeholderTextColor="#A0A7B0"
          multiline
          textAlignVertical="top"
          className="h-32 border border-gray-300 rounded-2xl px-4 py-4 text-base text-gray-900"
        />
      </View>

      <View className="px-4 py-4 bg-white rounded-t-[32px]">
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="h-14 rounded-2xl items-center justify-center bg-primary-main"
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-lg font-semibold text-white">Hoàn tất</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={successVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="w-full bg-white rounded-[32px] p-7 items-center">
            <TouchableOpacity
              onPress={() => setSuccessVisible(false)}
              className="absolute right-5 top-5"
            >
              <Ionicons name="close" size={30} color="#637381" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900 mt-3 mb-3">Cảm ơn bạn</Text>
            <Text className="text-base text-secondary text-center mb-8">
              Bạn đã ghi nhận cảm xúc thành công!
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSuccessVisible(false)
                router.back()
              }}
              className="w-full h-12 bg-primary-main rounded-xl items-center justify-center"
            >
              <Text className="text-base font-semibold text-white">Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default MoodEntryScreen
