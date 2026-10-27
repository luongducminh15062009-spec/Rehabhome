import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'iconsax-react-native'
import { router } from 'expo-router'

interface UserSubScreenLayoutProps {
  title: string
  children: React.ReactNode
  loading?: boolean
}

const UserSubScreenLayout: React.FC<UserSubScreenLayoutProps> = ({
  title,
  children,
  loading,
}) => {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator size="large" color="#34A853" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
          <View className="flex-row items-center justify-between px-6 py-5">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="w-14 h-14 rounded-full bg-white items-center justify-center"
            >
              <ArrowLeft size={25} color="#71808D" variant="Linear" />
            </TouchableOpacity>
            <Text className="text-center text-xl font-bold text-[#20262E]">
              {title}
            </Text>
            <View className="w-14" />
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-6 pt-2 pb-10">{children}</View>
          </ScrollView>
    </SafeAreaView>
  )
}

export default UserSubScreenLayout
