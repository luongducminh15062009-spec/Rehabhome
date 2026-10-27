import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { TodayPlanItem } from '@/services/home.service'
import { exerciseImageSource } from '@/services/workout-plan.service'
import { ERouteTable } from '@/constants/route-table'

type Props = {
  items: TodayPlanItem[]
  onSeeAll?: () => void
}

const TodayPlanSection = ({ items, onSeeAll }: Props) => {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-gray-900">Kế hoạch hôm nay</Text>
        <TouchableOpacity onPress={onSeeAll || (() => router.push(ERouteTable.WEEKLY_WORKOUT_PLAN))}>
          <Text className="text-sm text-secondary">Xem thêm</Text>
        </TouchableOpacity>
      </View>

      {items.map((item) => {
        const done = item.status === 'completed'
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            onPress={() =>
              item.exerciseKey
                ? router.push({
                    pathname: ERouteTable.WORKOUT_DETAIL,
                    params: { id: item.id, key: item.exerciseKey },
                  })
                : router.push(ERouteTable.EXERCISE)
            }
            className="bg-white rounded-2xl p-3 mb-3 flex-row items-center"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.04,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 1,
            }}
          >
            {exerciseImageSource(item.exerciseKey, item.imageUrl) ? (
              <Image
                source={exerciseImageSource(item.exerciseKey, item.imageUrl)}
                className="w-16 h-16 rounded-2xl mr-3"
              />
            ) : (
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mr-3"
                style={{ backgroundColor: item.bgColor }}
              >
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={28}
                  color={item.color}
                />
              </View>
            )}
            <View className="flex-1">
              <View
                className={`self-start px-2.5 py-1 rounded-full mb-1.5 ${
                  done ? 'bg-[#E8F8EE]' : 'bg-[#FEECEC]'
                }`}
              >
                <Text
                  className={`text-[10px] font-semibold ${
                    done ? 'text-[#22C55E]' : 'text-[#F04438]'
                  }`}
                >
                  {done ? 'Hoàn thành' : 'Chưa bắt đầu'}
                </Text>
              </View>
              <Text className="text-base font-semibold text-gray-900 mb-1">{item.title}</Text>
              <Text className="text-xs text-secondary">
                {item.durationMin} phút • {item.difficulty} • {item.category}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TodayPlanSection
