import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { SearchNormal } from 'iconsax-react-native'

const HomeSearchBar = () => {
  return (
    <TouchableOpacity
      onPress={() => router.push(ERouteTable.SEARCH_FOOD)}
      className="flex-row items-center"
    >
      <View className="flex-1 flex-row items-center bg-[#FFFFFF52] rounded-2xl px-4 h-[72px]">
        <View>
          <Text className="text-xs text-white/70">Tìm kiếm</Text>
          <Text className="text-base font-semibold text-white">Món ăn hàng ngày</Text>
        </View>
      </View>
      <View className="ml-3 w-[72px] h-[72px] rounded-3xl bg-[#FFFFFF52] items-center justify-center">
        <SearchNormal size="24" color="#fff"/>
      </View>
    </TouchableOpacity>
  )
}

export default HomeSearchBar
