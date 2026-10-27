import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Cup from '~/assets/icons/home/cup'
import CupActive from '~/assets/icons/home/cup_active'

type Props = {
  initialAmount?: number
  targetAmount?: number
  selectedDate?: string
  onAmountChange?: (delta: number) => void
}

const WaterTracker = ({
  initialAmount = 1200,
  targetAmount = 2000,
  onAmountChange,
}: Props) => {
  const [waterAmount, setWaterAmount] = useState(initialAmount)

  useEffect(() => {
    setWaterAmount(initialAmount)
  }, [initialAmount])

  const glassSize = 250
  const totalGlasses = 8
  const filledGlasses = Math.floor(waterAmount / glassSize)

  const handleIncrement = () => {
    if (waterAmount >= targetAmount) return
    const newAmount = Math.min(waterAmount + glassSize, targetAmount)
    setWaterAmount(newAmount)
    onAmountChange?.(glassSize)
  }

  const handleDecrement = () => {
    if (waterAmount === 0) return
    const newAmount = Math.max(waterAmount - glassSize, 0)
    setWaterAmount(newAmount)
    onAmountChange?.(-glassSize)
  }

  return (
    <View className="mb-6">
      <Text className="text-base font-semibold text-gray-900 mb-3">Theo dõi uống nước</Text>

      <View className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-base font-semibold text-gray-900">
            {waterAmount}ml <Text className="text-gray-400 font-normal">/ {targetAmount}ml</Text>
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleDecrement}
              disabled={waterAmount === 0}
              className="w-9 h-9 rounded-full bg-gray-200 items-center justify-center"
            >
              <Text className="text-xl font-bold text-gray-600">−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleIncrement}
              disabled={waterAmount >= targetAmount}
              className="w-9 h-9 rounded-full bg-gray-200 items-center justify-center"
            >
              <Text className="text-xl font-bold text-gray-600">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between px-4 pb-4 pt-1">
          {Array.from({ length: totalGlasses }).map((_, index) => {
            const isFilled = index < filledGlasses
            return (
              <View key={index} className="items-center justify-center">
                {isFilled ? <CupActive width={28} height={28} /> : <Cup width={28} height={28} />}
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default WaterTracker
