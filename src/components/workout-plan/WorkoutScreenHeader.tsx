import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const WorkoutScreenHeader = ({ title }: { title: string }) => (
  <View className="flex-row items-center px-6 pt-5 mb-8">
    <TouchableOpacity
      onPress={() => router.back()}
      className="w-14 h-14 rounded-full bg-white items-center justify-center"
    >
      <Ionicons name="chevron-back" size={27} color="#637381" />
    </TouchableOpacity>
    <Text className="flex-1 text-center text-2xl font-bold text-gray-900 mr-14">
      {title}
    </Text>
  </View>
)

export default WorkoutScreenHeader
