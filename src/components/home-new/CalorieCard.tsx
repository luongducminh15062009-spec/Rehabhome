import { Text, View } from 'react-native'
import React from 'react'

type Props = {
  calories: number
  targetCalories: number
}

const formatCalories = (value: number) => value.toLocaleString('vi-VN')

const CalorieCard = ({ calories, targetCalories }: Props) => {
  const remaining = Math.max(targetCalories - calories, 0)

  return (
    <View className="mb-3">
      <Text className="text-base font-semibold text-gray-900 mb-3">Calo hôm nay</Text>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-4xl font-bold text-gray-900 leading-tight">
            {formatCalories(calories)}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">Đã tiêu thụ</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500">
            Mục tiêu <Text className="font-semibold text-gray-900">{formatCalories(targetCalories)}</Text>
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Còn thiếu <Text className="font-semibold text-[#22C55E]">{formatCalories(remaining)}</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CalorieCard
