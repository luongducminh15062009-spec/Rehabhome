import { Text, View } from 'react-native'
import React from 'react'

type Macros = {
  protein: { current: number; target: number }
  fat: { current: number; target: number }
  carbs: { current: number; target: number }
}

type Props = {
  currentCalories: number
  targetCalories: number
  macros: Macros
}

const MacroColumn = ({
  label,
  current,
  target,
}: {
  label: string
  current: number
  target: number
}) => (
  <View className="flex-1 items-center">
    <Text className="text-sm font-semibold text-gray-900 mb-1">{label}</Text>
    <Text className="text-xs text-secondary">
      {current.toFixed(current % 1 === 0 ? 0 : 1)}/{target.toFixed(1)} gr
    </Text>
  </View>
)

const CalorieProgress = ({ currentCalories, targetCalories, macros }: Props) => {
  const percentage =
    targetCalories > 0 ? Math.min((currentCalories / targetCalories) * 100, 100) : 0

  return (
    <View>
      <View className="h-2.5 bg-[#E8EEF5] rounded-full mb-4 overflow-hidden">
        <View
          className="h-full rounded-full bg-[#5ED0B3]"
          style={{ width: `${percentage}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        <MacroColumn
          label="Đạm"
          current={macros.protein.current}
          target={macros.protein.target}
        />
        <MacroColumn label="Béo" current={macros.fat.current} target={macros.fat.target} />
        <MacroColumn
          label="Tinh bột"
          current={macros.carbs.current}
          target={macros.carbs.target}
        />
      </View>
    </View>
  )
}

export default CalorieProgress
