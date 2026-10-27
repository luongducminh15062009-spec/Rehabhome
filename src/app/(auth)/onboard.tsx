import {
  Dimensions,
  FlatList,
  ImageBackground,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { images } from '@/constants'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type OnboardSlide = {
  id: string
  image: ImageSourcePropType
  title: string
  description: string
}

const ONBOARD_SLIDES: OnboardSlide[] = [
  {
    id: '1',
    image: images.onboardSlide1,
    title: 'Tập theo \ncách của bạn',
    description: 'Khám phá cac bài tập nhẹ nhàng, phù hợp với thể trạng và giúp bạn chủ động phục hồi sức khỏe tại nhà.',
  },
  {
    id: '2',
    image: images.onboardSlide2,
    title: 'Theo dõi \ntừng bước',
    description:
      'Ghi nhận hoạt động tập luyện và cảm nhận sức khỏe mỗi ngày để hiểu rõ hơn hành trình phục hồi của bạn.',
  },
  {
    id: '3',
    image: images.onboardSlide3,
    title: 'Đồng hành cùng bạn \nmỗi ngày.',
    description:
      'Tìm hiểu kiến thức hưu ích, giải đáp thắc mắc và nhận thêm động lực trên hành trình chắc sóc sức khỏe.',
  },
]

const OnboardScreen = () => {
  const router = useRouter()
  const flatListRef = useRef<FlatList<OnboardSlide>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const isLastSlide = currentIndex === ONBOARD_SLIDES.length - 1

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setCurrentIndex(index)
  }

  const handleContinue = () => {
    if (isLastSlide) {
      router.push(ERouteTable.SIGIN_IN)
      return
    }
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={flatListRef}
        data={ONBOARD_SLIDES}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.image}
            resizeMode="cover"
            style={{ width: SCREEN_WIDTH, flex: 1 }}
          >
            <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
                <View className="flex-1 px-8 justify-end pb-2">
                  <View className="mb-10">
                    <Text className="text-4xl font-regular text-primary">{item.title}</Text>
                    <Text className="text-lg text-primary mt-4 leading-6">
                      {item.description}
                    </Text>
                  </View>
                  <View className="pb-2">
                    <TouchableOpacity
                      onPress={handleContinue}
                      className="bg-success-main px-6 h-14 py-3 items-center justify-center rounded-2xl"
                    >
                      <Text className="text-white text-center font-semibold text-base">
                        {isLastSlide ? 'Bắt đầu' : 'Tiếp tục'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
          </ImageBackground>
        )}
      />
    </View>
  )
}

export default OnboardScreen
