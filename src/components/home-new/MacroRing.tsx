import React from 'react'
import { Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

type Props = {
  label: string
  current: number
  target: number
  color: string
}

const MacroRing = ({ label, current, target, color }: Props) => {
  const size = 76
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = target > 0 ? Math.min(current / target, 1) : 0
  const dash = progress * circumference

  return (
    <View className="flex-1 items-center">
      <View className="relative items-center justify-center">
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
          />
        </Svg>
        <View className="absolute items-center justify-center">
          <Text className="text-xs font-bold text-gray-900">
            {current}/{target}g
          </Text>
        </View>
      </View>
      <Text className="text-sm font-medium mt-2" style={{ color }}>
        {label}
      </Text>
    </View>
  )
}

export default MacroRing
