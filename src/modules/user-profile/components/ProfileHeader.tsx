import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Edit2 } from 'iconsax-react-native'
import { UserProfile } from '../types/user-profile.types'

interface ProfileHeaderProps {
  user: UserProfile
  onEditPress: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
  return (
    <View
      className="bg-white rounded-3xl p-5 mx-4 mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        <Image
          source={{
            uri:
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=34A853&color=fff`,
          }}
          className="w-16 h-16 rounded-full bg-gray-100"
        />

        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-[#1A1A1A]">{user.name}</Text>
          <Text className="text-sm text-[#7D7D7D] mt-0.5">{user.email}</Text>

          <TouchableOpacity
            onPress={onEditPress}
            activeOpacity={0.7}
            className="flex-row items-center self-start mt-2.5 bg-[#F3F4F6] rounded-full px-3 py-1.5"
          >
            <Edit2 size={14} color="#637381" variant="Linear" />
            <Text className="text-sm text-[#637381] ml-1.5 font-medium">Sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ProfileHeader
