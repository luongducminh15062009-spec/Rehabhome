import React from 'react'
import { TouchableOpacity, Text, View, Pressable } from 'react-native'
import { MenuItem } from '../types/user-profile.types'

interface SettingsMenuItemProps {
  item: MenuItem
  isLast?: boolean
}

const SettingsToggle = ({
  value,
  onValueChange,
}: {
  value: boolean
  onValueChange: (next: boolean) => void
}) => {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={8}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
        backgroundColor: value ? '#A5C0FF' : '#E5E7EB',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: value ? '#477AFF' : '#FFFFFF',
          alignSelf: value ? 'flex-end' : 'flex-start',
        }}
      />
    </Pressable>
  )
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ item, isLast }) => {
  const isDanger = item.variant === 'danger'
  const Icon = item.icon
  const iconColor = isDanger ? '#FF5C39' : '#1A1A1A'
  const labelColor = isDanger ? '#FF5C39' : '#1A1A1A'

  const content = (
    <View className="flex-row items-center py-3.5 px-5">
      <View className="w-7 items-center justify-center">
        <Icon size={22} color={iconColor} variant="Linear" />
      </View>

      <Text className="flex-1 ml-3.5 text-base" style={{ color: labelColor }}>
        {item.label}
      </Text>

      {item.toggle ? (
        <SettingsToggle
          value={item.toggle.value}
          onValueChange={item.toggle.onValueChange}
        />
      ) : null}
    </View>
  )

  if (item.toggle) {
    return (
      <View>
        {content}
        {!isLast && <View className="h-px bg-[#F1F3F5] mx-5" />}
      </View>
    )
  }

  return (
    <View>
      <TouchableOpacity onPress={item.onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
      {!isLast && <View className="h-px bg-[#F1F3F5] mx-5" />}
    </View>
  )
}

export default SettingsMenuItem
