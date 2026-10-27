import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  MOOD_OPTIONS,
  MoodLevel,
  getEnergyLabel,
} from '@/services/mood.service'
import MoodIcon from '@/components/mood/MoodIcon'

type Props = {
  selectedMood?: MoodLevel | null
  energyLevel?: number | null
  onPress: () => void
}

const MoodTrackerCard = ({ selectedMood, energyLevel, onPress }: Props) => {
  const energyLabel = getEnergyLabel(energyLevel || (selectedMood ? 7 : null))
  const energyColor =
    energyLabel === 'Cao' ? '#22C55E' : energyLabel === 'Trung bình' ? '#EAB308' : '#EF4444'

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white rounded-[28px] px-5 pt-4 pb-5 mb-6"
    >
      <View className="flex-row items-start justify-between mb-5">
        <Text className="text-lg font-medium text-gray-900 w-[48%] leading-7">
          Hôm nay bạn cảm thấy thế nào?
        </Text>
        <View className="items-end">
          <View className="flex-row items-center">
            <Ionicons name="flash" size={20} color="#FF5630" />
            <Text className="text-base text-gray-900 ml-2">Năng lượng</Text>
          </View>
          <Text className="text-xl font-bold mt-1" style={{ color: energyColor }}>
            {energyLabel}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        {MOOD_OPTIONS.map((mood) => {
          const selected = selectedMood === mood.level
          return (
            <View
              key={mood.level}
              className="w-12 h-12 items-center justify-center"
            >
              <MoodIcon level={mood.level} active={selected} size={48} />
            </View>
          )
        })}
      </View>
      <TouchableOpacity onPress={onPress} className="w-full text-center items-center justify-center h-12 bg-[#919EAB14] rounded-2xl mt-6">
        <Text>Cảm xúc</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MoodTrackerCard
