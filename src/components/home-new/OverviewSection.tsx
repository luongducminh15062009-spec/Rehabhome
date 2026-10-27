import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { HomeData } from '@/services/home.service'
import { getMoodMeta } from '@/services/mood.service'
import CalorieProgress from './CalorieProgress'
import MoodIcon from '@/components/mood/MoodIcon'

type Props = {
  data: HomeData
  onSeeMoodHistory?: () => void
}

const formatSleep = (hours: number) => {
  if (!hours) return '0h'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m > 0 ? `${h}h${m}m` : `${h}h`
}

const MetricCard = ({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  subValue,
}: {
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  iconBg: string
  label: string
  value: string
  subValue?: string
}) => (
  <View className="w-[48%] bg-white rounded-2xl p-4 mb-3">
    <View className="flex-row items-center mb-3">
      <View
        className="w-9 h-9 rounded-full items-center justify-center mr-2"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text className="text-sm text-secondary">{label}</Text>
    </View>
    <Text className="text-xl font-bold text-gray-900">
      {value}
      {subValue ? (
        <Text className="text-sm font-medium text-secondary"> {subValue}</Text>
      ) : null}
    </Text>
  </View>
)

const OverviewSection = ({ data, onSeeMoodHistory }: Props) => {
  const weekLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const weekDates = Object.keys(data.weekMoods).sort()

  return (
    <View className="mb-6">
      {/*<Text className="text-lg font-bold text-gray-900 mb-4">Tổng quan</Text>*/}

      {/*<View className="bg-white rounded-3xl p-4 mb-3">*/}
      {/*  <View className="flex-row items-center justify-between mb-3">*/}
      {/*    <Text className="text-sm text-secondary">Calo nạp vào</Text>*/}
      {/*    <Text className="text-base font-bold text-gray-900">*/}
      {/*      🔥 {Math.round(data.todayCalories)}*/}
      {/*      <Text className="text-sm font-normal text-secondary">*/}
      {/*        {' '}*/}
      {/*        / {Math.round(data.targetCalories)} kcal*/}
      {/*      </Text>*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*  <CalorieProgress*/}
      {/*    currentCalories={data.todayCalories}*/}
      {/*    targetCalories={data.targetCalories}*/}
      {/*    macros={data.macros}*/}
      {/*  />*/}
      {/*</View>*/}

      {/*<View className="flex-row flex-wrap justify-between">*/}
      {/*  <MetricCard*/}
      {/*    icon="water"*/}
      {/*    iconColor="#3B82F6"*/}
      {/*    iconBg="#DBEAFE"*/}
      {/*    label="Nước"*/}
      {/*    value={`${data.waterIntake.current}ml`}*/}
      {/*    subValue={`/ ${data.waterIntake.target}ml`}*/}
      {/*  />*/}
      {/*  <MetricCard*/}
      {/*    icon="cloudy-night"*/}
      {/*    iconColor="#3B82F6"*/}
      {/*    iconBg="#E0F2FE"*/}
      {/*    label="Ngủ"*/}
      {/*    value={formatSleep(data.sleepHours)}*/}
      {/*    subValue={`/ ${data.targetSleepHours}h`}*/}
      {/*  />*/}
      {/*  <MetricCard*/}
      {/*    icon="body"*/}
      {/*    iconColor="#8B5CF6"*/}
      {/*    iconBg="#EDE9FE"*/}
      {/*    label="BMI"*/}
      {/*    value={`${data.bmi}`}*/}
      {/*  />*/}
      {/*  <MetricCard*/}
      {/*    icon="flame"*/}
      {/*    iconColor="#F97316"*/}
      {/*    iconBg="#FFEDD5"*/}
      {/*    label="TDEE"*/}
      {/*    value={`${data.tdee}`}*/}
      {/*    subValue="Kcal/ngày"*/}
      {/*  />*/}
      {/*</View>*/}

      <View className="bg-white rounded-3xl p-4 mt-1">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-semibold text-gray-900">Lịch sử cảm xúc</Text>
          <TouchableOpacity onPress={onSeeMoodHistory}>
            <Text className="text-sm text-secondary">Xem thêm</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between">
          {weekDates.map((date, index) => {
            const mood = data.weekMoods[date]
            const meta = getMoodMeta(mood?.mood_level)
            return (
              <View key={date} className="items-center">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mb-1"
                  style={{ backgroundColor: meta ? 'transparent' : '#F3F4F6' }}
                >
                  {meta ? (
                    <MoodIcon level={meta.level} active size={34} />
                  ) : (
                    <Text className="text-base text-gray-400">·</Text>
                  )}
                </View>
                <Text className="text-[10px] text-secondary">{weekLabels[index]}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default OverviewSection
