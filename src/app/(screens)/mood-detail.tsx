import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '@/context/auth-provider'
import {
  getEnergyLabel,
  getMoodMeta,
  MoodLog,
  MoodService,
} from '@/services/mood.service'
import { ERouteTable } from '@/constants/route-table'
import MoodIcon from '@/components/mood/MoodIcon'

const formatDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return `${day} thg ${month}, ${year}`
}

const MoodDetailScreen = () => {
  const { date } = useLocalSearchParams<{ date?: string }>()
  const { user } = useAuth()
  const [log, setLog] = useState<MoodLog | null>(null)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const loadDetail = async () => {
        setLoading(true)
        if (!user?.id || !date) {
          setLoading(false)
          return
        }
        const result = await MoodService.getMoodForDate(user.id, date)
        setLog(result)
        setLoading(false)
      }

      loadDetail()
    }, [date, user?.id]),
  )

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator size="large" color="#477AFF" />
      </View>
    )
  }

  if (!date || !log) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-lg text-secondary text-center mb-5">
            Không tìm thấy ghi nhận cảm xúc cho ngày này.
          </Text>
          {date && (
            <TouchableOpacity
              onPress={() =>
                router.replace({
                  pathname: ERouteTable.MOOD_ENTRY,
                  params: { date },
                })
              }
              className="bg-primary-main px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Ghi nhận ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    )
  }

  const mood = getMoodMeta(log.mood_level)
  const energyLabel = getEnergyLabel(log.energy_level)
  const energyColor =
    energyLabel === 'Cao' ? '#22C55E' : energyLabel === 'Trung bình' ? '#EAB308' : '#EF4444'

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <View className="flex-row items-center px-6 pt-5 mb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-14 h-14 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#637381" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold text-gray-900">
          Chi tiết cảm xúc
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: ERouteTable.MOOD_ENTRY,
              params: { date },
            })
          }
          className="w-14 items-end"
        >
          <Ionicons name="create-outline" size={25} color="#477AFF" />
        </TouchableOpacity>
      </View>

      <View className="px-6">
        <Text className="text-xl font-bold text-center text-gray-900 mb-4">
          {formatDate(date)}
        </Text>

        <View className="bg-white rounded-[32px] py-6 items-center mb-7">
          {mood && <MoodIcon level={mood.level} active size={112} />}
          <Text className="text-3xl text-gray-900">{mood?.label}</Text>
        </View>

        <View className="flex-row items-center justify-between mb-7">
          <Text className="text-xl font-bold text-gray-900">Mức năng lượng</Text>
          <Text className="text-xl" style={{ color: energyColor }}>
            {energyLabel}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-7">
          <Text className="text-xl font-bold text-gray-900">Vận động</Text>
          <Text className="text-xl text-gray-900">{log.exercised ? 'Có' : 'Không'}</Text>
        </View>

        <Text className="text-xl font-bold text-gray-900 mb-4">Ghi chú</Text>
        <View className="min-h-32 border border-gray-300 rounded-2xl p-4">
          <Text className="text-base text-gray-800 leading-6">
            {log.notes || 'Không có ghi chú.'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MoodDetailScreen
