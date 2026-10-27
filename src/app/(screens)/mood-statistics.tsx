import React, { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '@/context/auth-provider'
import {
  getMoodMeta,
  isFutureMoodDate,
  MOOD_OPTIONS,
  MoodLog,
  MoodService,
} from '@/services/mood.service'
import { ERouteTable } from '@/constants/route-table'
import MoodIcon from '@/components/mood/MoodIcon'
import { toast } from '@/components/common/ToastManager'

const toDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const MoodStatisticsScreen = () => {
  const { user } = useAuth()
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [logs, setLogs] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)

  const loadMonth = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    const start = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1)
    const end = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0)
    const result = await MoodService.getMoodsForRange(
      user.id,
      toDateString(start),
      toDateString(end),
    )
    setLogs(result)
    setLoading(false)
  }, [displayMonth, user?.id])

  useFocusEffect(
    useCallback(() => {
      loadMonth()
    }, [loadMonth]),
  )

  const calendarCells = useMemo(() => {
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const mondayOffset = firstDay === 0 ? 6 : firstDay - 1
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: Array<number | null> = Array.from({ length: mondayOffset }, () => null)

    for (let day = 1; day <= daysInMonth; day++) cells.push(day)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [displayMonth])

  const logsByDate = useMemo(
    () => new Map(logs.map((log) => [log.date, log])),
    [logs],
  )

  const counts = useMemo(
    () =>
      MOOD_OPTIONS.map((mood) => ({
        ...mood,
        count: logs.filter((log) => log.mood_level === mood.level).length,
      })),
    [logs],
  )
  const maxCount = Math.max(...counts.map((item) => item.count), 1)
  const mostFrequent = [...counts].sort((a, b) => b.count - a.count)[0]

  const changeMonth = (offset: number) => {
    setDisplayMonth(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() + offset, 1),
    )
  }

  const openDay = (day: number) => {
    const date = toDateString(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day),
    )
    if (isFutureMoodDate(date)) {
      toast.warning(
        'Ngày không hợp lệ',
        'Bạn không thể ghi nhận cảm xúc cho ngày trong tương lai.',
      )
      return
    }

    const log = logsByDate.get(date)
    router.push({
      pathname: log ? ERouteTable.MOOD_DETAIL : ERouteTable.MOOD_ENTRY,
      params: { date },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <View className="flex-row items-center px-6 pt-5 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-14 h-14 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#637381" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold text-gray-900 mr-14">
          Thống kê cảm xúc
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Ionicons name="chevron-back" size={30} color="#637381" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Tháng {displayMonth.getMonth() + 1}, {displayMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Ionicons name="chevron-forward" size={30} color="#637381" />
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-3">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label) => (
            <Text key={label} className="w-[14.285%] text-center text-sm text-secondary">
              {label}
            </Text>
          ))}
        </View>

        {loading ? (
          <View className="h-64 items-center justify-center">
            <ActivityIndicator size="large" color="#477AFF" />
          </View>
        ) : (
          <View className="flex-row flex-wrap">
            {calendarCells.map((day, index) => {
              if (!day) return <View key={`empty-${index}`} className="w-[14.285%] h-14" />

              const date = toDateString(
                new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day),
              )
              const log = logsByDate.get(date)
              const mood = getMoodMeta(log?.mood_level)

              return (
                <TouchableOpacity
                  key={date}
                  onPress={() => openDay(day)}
                  className="w-[14.285%] h-14 items-center justify-center"
                >
                  <View
                    className="w-11 h-11 rounded-full items-center justify-center border"
                    style={{
                      backgroundColor: mood?.color || 'transparent',
                      borderColor: mood?.color || '#DDE1E6',
                    }}
                  >
                    <Text
                      className={`text-base ${mood ? 'text-white font-semibold' : 'text-gray-800'}`}
                    >
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        <View className="flex-row items-center justify-center mt-3 mb-6">
          <Ionicons name="information-circle-outline" size={22} color="#7C8A99" />
          <Text className="text-sm text-secondary ml-2">Nhấn vào từng ngày để xem thêm</Text>
        </View>

        <View className="bg-white rounded-[32px] p-5">
          <Text className="text-xl font-bold text-gray-900 mb-5">Xu hướng cảm xúc</Text>
          {counts.map((item) => (
            <View key={item.level} className="flex-row items-center mb-3">
              <View
                className="h-10 rounded-2xl border mr-3"
                style={{
                  width: `${Math.max(10, (item.count / maxCount) * 72)}%`,
                  borderColor: item.color,
                  backgroundColor: `${item.color}0D`,
                }}
              />
              <View className="mr-3">
                <MoodIcon level={item.level} active size={40} />
              </View>
              <Text className="text-lg font-semibold text-gray-900">{item.count}</Text>
            </View>
          ))}

          <Text className="text-base text-secondary leading-6 mt-2">
            {logs.length > 0
              ? `Tâm trạng được ghi nhận nhiều nhất là ${mostFrequent.label.toLowerCase()} với ${mostFrequent.count} mục trong tháng này.`
              : 'Bạn chưa ghi nhận cảm xúc nào trong tháng này.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MoodStatisticsScreen
