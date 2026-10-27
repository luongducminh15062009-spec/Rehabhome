import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  userName: string
  avatar: string
  notificationCount?: number
  onNotificationPress?: () => void
  onSettingsPress?: () => void
}

const iconButtonStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
}

const HomeHeader = ({
  userName,
  avatar,
  notificationCount = 0,
  onNotificationPress,
  onSettingsPress,
}: Props) => {
  return (
    <View className="flex-row items-center justify-between mb-5">
      <View className="flex-row items-center gap-3 flex-1">
        <Image source={{ uri: avatar }} className="w-12 h-12 rounded-full bg-gray-200" />
        <View className="flex-1 pr-2">
          <Text className="text-base text-gray-900">
            Xin chào! <Text className="font-bold">{userName}</Text> 👋
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5">
        <TouchableOpacity
          onPress={onNotificationPress}
          className="relative bg-white rounded-full p-3"
          activeOpacity={0.8}
          style={iconButtonStyle}
        >
          <Ionicons name="notifications-outline" size={22} color="#212B36" />
          {notificationCount > 0 && (
            <View className="absolute -top-0.5 -right-0.5 bg-[#14B8A6] rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
              <Text className="text-white text-[10px] font-bold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSettingsPress}
          className="bg-white rounded-full p-3"
          activeOpacity={0.8}
          style={iconButtonStyle}
        >
          <Ionicons name="settings-outline" size={22} color="#212B36" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeHeader
