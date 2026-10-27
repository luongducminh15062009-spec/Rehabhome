import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Heart } from 'iconsax-react-native'
import { WorkoutListItem } from '@/services/my-workouts.service'

type Props = {
  item: WorkoutListItem
  onPress: () => void
  onCreatorPress?: () => void
  variant?: 'explore' | 'mine'
}

const WorkoutListCard = ({ item, onPress, onCreatorPress, variant = 'explore' }: Props) => {
  const creatorLabel = (
    <Text className="text-xs text-[#94A3B8]">
      Tạo bởi:{' '}
      <Text className={onCreatorPress ? 'text-[#477AFF] font-semibold' : undefined}>
        {item.creator}
      </Text>
    </Text>
  )

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white rounded-[24px] p-3 mb-3 flex-row"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Image source={item.imageUrl} className="w-[64px] h-[64px] rounded-2xl" />

      <View className="flex-1 ml-3.5 justify-center">
        <Text className="text-base font-bold text-gray-900 mb-0.5" numberOfLines={1}>
          {item.title}
        </Text>

        <View className="flex-row items-center flex-wrap gap-x-3 gap-y-1 mb-1.5">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#637381" />
            <Text className="text-xs text-[#637381] ml-1">{item.durationMinutes} phút</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons
              name={variant === 'mine' ? 'barbell-outline' : 'cellular-outline'}
              size={13}
              color="#637381"
            />
            <Text className="text-xs text-[#637381] ml-1">{item.difficulty}</Text>
          </View>
        </View>

        <Text className="text-xs text-[#38BFA0]" numberOfLines={1}>
          {item.tags.join('  •  ')}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default WorkoutListCard
