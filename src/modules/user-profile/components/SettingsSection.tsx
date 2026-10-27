import React from 'react'
import { View, Text } from 'react-native'

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <View
      className="bg-white rounded-3xl mx-4 mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="px-5 pt-4 pb-1">
        <Text className="text-lg font-bold text-[#1A1A1A]">{title}</Text>
      </View>
      <View className="pb-1">{children}</View>
    </View>
  )
}

export default SettingsSection
