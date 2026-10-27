import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Cup from '~/assets/icons/home/cup'
import CupActive from '~/assets/icons/home/cup_active'

type Props = {
  visible: boolean
  initialAmount: number
  targetAmount: number
  onClose: () => void
  onChange: (delta: number) => Promise<void> | void
}

const WaterModal = ({
  visible,
  initialAmount,
  targetAmount,
  onClose,
  onChange,
}: Props) => {
  const [amount, setAmount] = useState(initialAmount)
  const [loading, setLoading] = useState(false)
  const glassSize = 250
  const totalGlasses = 8
  const filledGlasses = Math.floor(amount / glassSize)

  useEffect(() => {
    if (visible) setAmount(initialAmount)
  }, [visible, initialAmount])

  const handleIncrement = async () => {
    if (amount >= targetAmount || loading) return
    setLoading(true)
    try {
      await onChange(glassSize)
      setAmount((prev) => Math.min(prev + glassSize, targetAmount))
    } finally {
      setLoading(false)
    }
  }

  const handleDecrement = async () => {
    if (amount <= 0 || loading) return
    setLoading(true)
    try {
      await onChange(-glassSize)
      setAmount((prev) => Math.max(prev - glassSize, 0))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={onClose}>
        <Pressable
          className="bg-white rounded-3xl p-6 mx-6 w-[85%]"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-xl font-bold text-gray-900 mb-6 text-center">Ghi nước</Text>

          <View className="items-center mb-5">
            <View className="flex-row items-center gap-6">
              <TouchableOpacity
                onPress={handleDecrement}
                className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
              >
                <Text className="text-2xl font-bold text-gray-700">−</Text>
              </TouchableOpacity>
              <View className="items-center min-w-[120px]">
                <Text className="text-4xl font-bold text-gray-900">{amount}</Text>
                <Text className="text-sm text-gray-500 mt-1">ml</Text>
              </View>
              <TouchableOpacity
                onPress={handleIncrement}
                className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
              >
                <Text className="text-2xl font-bold text-gray-700">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between mb-6 px-1">
            {Array.from({ length: totalGlasses }).map((_, index) => (
              <View key={index}>
                {index < filledGlasses ? (
                  <CupActive width={28} height={28} />
                ) : (
                  <Cup width={28} height={28} />
                )}
              </View>
            ))}
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 items-center"
            >
              <Text className="text-base font-semibold text-gray-900">Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              className="flex-1 bg-primary-main rounded-2xl py-4 items-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-semibold text-white">Cập nhật</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default WaterModal
