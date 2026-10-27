import React from 'react'
import { ImageBackground, Text, View } from 'react-native'
import { images } from '@/constants'

const DEFAULT_TIP =
  'Phục hồi sức khỏe và tinh thần cho bệnh nhân ung thư'

/** Static tip banner on Home — not linked to AI chat. */
const FitMindAICard = () => {
  return (
    <ImageBackground
      source={images.fitMindBanner}
      resizeMode="cover"
      imageStyle={{ borderRadius: 24 }}
      className="rounded-3xl mb-5 overflow-hidden"
      style={{ minHeight: 148 }}
    >
      <View className="flex-1 px-5 py-5 pr-[42%] justify-center">
        <View className="self-start bg-[#58D3BF] px-3 py-1 rounded-full mb-3">
          <Text className="text-xs font-semibold text-white">RehabHome</Text>
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2">Bạn có biết?</Text>
        <Text className="text-sm text-primary leading-5">{DEFAULT_TIP}</Text>
      </View>
    </ImageBackground>
  )
}

export default FitMindAICard
