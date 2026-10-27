import { Text, View } from 'react-native'
import React from 'react'
import TrainIconHome from '~/assets/icons/home/train'
import SleepHomeIcon from '~/assets/icons/home/sleep_home'

type Props = {
  bmi: number
  tdee: number
  exerciseMinutes: number
  sleepHours: number
}

const HealthMetrics = ({ bmi, tdee, exerciseMinutes, sleepHours }: Props) => {
  return (
    <View className="mb-6">
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <Text className="text-sm font-medium text-gray-500 mb-2">BMI</Text>
          <Text className="text-2xl font-bold text-gray-900">{bmi}</Text>
        </View>
        <View className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <Text className="text-sm font-medium text-gray-500 mb-2">TDEE</Text>
          <Text className="text-2xl font-bold text-gray-900">
            {tdee}
            <Text className="text-xs font-normal text-gray-500"> Kcal/ngày</Text>
          </Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center gap-1 mb-2">
            <TrainIconHome />
            <Text className="text-sm font-medium text-gray-700">Tập luyện</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {exerciseMinutes}
            <Text className="text-sm font-normal text-gray-500"> phút</Text>
          </Text>
        </View>
        <View className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center gap-1 mb-2">
            <SleepHomeIcon />
            <Text className="text-sm font-medium text-gray-700">Ngủ</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {sleepHours}
            <Text className="text-sm font-normal text-gray-500"> giờ</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default HealthMetrics
