import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export type QuickActionId =
  | 'workout'
  | 'sleep'
  | 'mood'
  | 'water'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'

type ActionItem = {
  id: QuickActionId
  label: string
  icon: keyof typeof Ionicons.glyphMap
  bg: string
  color: string
}

const ACTIONS: ActionItem[] = [
  { id: 'workout', label: 'Tập luyện', icon: 'barbell', bg: '#FFF4D6', color: '#F5A623' },
  { id: 'sleep', label: 'Giấc ngủ', icon: 'leaf', bg: '#DDF7E8', color: '#2F9E6A' },
  { id: 'mood', label: 'Cảm xúc', icon: 'happy', bg: '#FFE4E6', color: '#F43F5E' },
  { id: 'water', label: 'Ghi nước', icon: 'water', bg: '#DBEAFE', color: '#3B82F6' },
  { id: 'breakfast', label: 'Bữa sáng', icon: 'sunny', bg: '#FFEDD5', color: '#EA580C' },
  { id: 'lunch', label: 'Bữa trưa', icon: 'partly-sunny', bg: '#FFF4D6', color: '#F5A623' },
  { id: 'dinner', label: 'Bữa tối', icon: 'moon', bg: '#DDF6FA', color: '#22B8CF' },
  { id: 'snack', label: 'Bữa xế', icon: 'restaurant', bg: '#E8EDFF', color: '#477AFF' },
]

type Props = {
  onPress: (id: QuickActionId) => void
}

const QuickActions = ({ onPress }: Props) => {
  return (
    <View className="mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 14 }}
      >
        {ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onPress(item.id)}
            className="items-center"
            style={{ width: 64 }}
            activeOpacity={0.8}
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
              style={{ backgroundColor: item.bg }}
            >
              <Ionicons name={item.icon} size={25} color={item.color} />
            </View>
            <Text className="text-xs text-gray-700 text-center font-medium" numberOfLines={1}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default QuickActions
