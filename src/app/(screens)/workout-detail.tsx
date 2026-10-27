import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { useAuth } from '@/context/auth-provider'
import { ERouteTable } from '@/constants/route-table'
import { toast } from '@/components/common/ToastManager'
import {
  EXERCISE_LIBRARY,
  ExerciseTemplate,
  getExerciseSections,
  WorkoutPlanItem,
  WorkoutPlanService,
} from '@/services/workout-plan.service'

/** Bundle ID dùng làm Referer — YouTube yêu cầu để tránh Error 153 */
const APP_ORIGIN = 'https://com.fit.mind'

type SectionKey = 'warmup' | 'main' | 'cooldown'

const youtubeEmbedHtml = (videoId: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe
      src="https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1"
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  </body>
</html>
`

const AccordionHeader = ({
  title,
  duration,
  open,
  onPress,
}: {
  title: string
  duration: string
  open: boolean
  onPress: () => void
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className="h-14 bg-white rounded-2xl px-4 flex-row items-center justify-between"
  >
    <Text className="font-semibold text-gray-900">
      {title} <Text className="font-normal text-secondary">• {duration}</Text>
    </Text>
    <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#7C8A99" />
  </TouchableOpacity>
)

const WorkoutDetailScreen = () => {
  const { id, key } = useLocalSearchParams<{ id?: string; key?: string }>()
  const { user } = useAuth()
  const [item, setItem] = useState<WorkoutPlanItem | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [openSection, setOpenSection] = useState<SectionKey | null>('main')

  useFocusEffect(
    useCallback(() => {
      if (!id) return
      WorkoutPlanService.getPlanItem(id).then((data) => {
        setItem(data)
        setLoading(false)
      })
    }, [id]),
  )

  const exercise: ExerciseTemplate | undefined = EXERCISE_LIBRARY.find(
    (entry) => entry.key === (item?.exercise_key || key),
  )
  if (loading || !exercise) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator color="#477AFF" />
      </View>
    )
  }

  const sections = getExerciseSections(exercise)
  const toggle = (section: SectionKey) => {
    setOpenSection((prev) => (prev === section ? null : section))
  }

  const complete = async () => {
    if (!user?.id || !item) return
    if (await WorkoutPlanService.completePlanItem(user.id, item)) {
      toast.success('Đã hoàn thành', 'Buổi tập đã được ghi nhận.')
      router.back()
    } else toast.error('Không thể lưu', 'Vui lòng thử lại.')
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={exercise.image} className="w-full h-[340px] rounded-b-[30px]" />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-5 w-12 h-12 rounded-full bg-white items-center justify-center"
          >
            <Ionicons name="chevron-back" size={28} color="#7C8A99" />
          </TouchableOpacity>
        </View>

        <View className="px-5 pt-5">
          <Text className="text-2xl font-bold text-primary-main">{exercise.title}</Text>
          <Text className="text-secondary mt-3">{item?.scheduled_date || 'Chưa chọn ngày'}</Text>
          <Text className="text-secondary mt-1">
            {exercise.durationMinutes} phút • {exercise.difficulty} •{' '}
            <Text className="text-[#38BFA0]">{exercise.category}</Text>
          </Text>

          <Text className="text-base font-bold text-gray-900 mt-5 mb-2">Mục tiêu buổi tập</Text>
          <Text className="text-secondary leading-6">
            {exercise.description} Hãy thực hiện đúng động tác, đúng kỹ thuật và nghỉ thêm khi cần thiết.
          </Text>

          <Text className="text-2xl font-medium text-gray-900 mt-7 mb-4">Cách thực hiện</Text>

          {/* Khởi động */}
          <View className="mb-3 overflow-hidden rounded-2xl bg-white">
            <AccordionHeader
              title="Khởi động"
              duration={sections.warmup.duration}
              open={openSection === 'warmup'}
              onPress={() => toggle('warmup')}
            />
            {openSection === 'warmup' && (
              <View className="px-4 pb-4 border-t border-gray-100">
                {sections.warmup.steps.map((step, index) => (
                  <Text key={step} className="text-secondary leading-6 mt-3">
                    {index + 1}. {step}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Bài tập chính */}
          <View className="mb-3 overflow-hidden rounded-2xl bg-white">
            <AccordionHeader
              title="Bài tập chính"
              duration={sections.main.duration}
              open={openSection === 'main'}
              onPress={() => toggle('main')}
            />
            {openSection === 'main' && (
              <View className="px-4 pb-4 border-t border-gray-100">
                <Text className="text-secondary leading-6 mt-3 mb-2">{sections.main.intro}</Text>

                {sections.main.steps.map((step, index) => (
                  <View key={step.title} className="mt-3">
                    <Text className="font-semibold text-gray-900">
                      {index + 1}. {step.title}
                    </Text>
                    <Text className="text-secondary leading-6 mt-1">{step.detail}</Text>
                  </View>
                ))}

                {exercise.videoId ? (
                  <View className="mt-5">
                    <Text className="text-base font-bold text-gray-900 mb-3">Video hướng dẫn</Text>
                    <View className="rounded-2xl overflow-hidden bg-black" style={{ height: 220 }}>
                      <WebView
                        source={{
                          html: youtubeEmbedHtml(exercise.videoId),
                          baseUrl: APP_ORIGIN,
                          headers: {
                            Referer: APP_ORIGIN,
                            'Referrer-Policy': 'strict-origin-when-cross-origin',
                          },
                        }}
                        style={{ flex: 1, backgroundColor: '#000' }}
                        allowsFullscreenVideo
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabled
                        domStorageEnabled
                        originWhitelist={['*']}
                        setSupportMultipleWindows={false}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`https://www.youtube.com/watch?v=${exercise.videoId}`)
                      }
                      className="mt-3 h-11 rounded-2xl bg-[#F5F6F8] items-center justify-center flex-row"
                    >
                      <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                      <Text className="ml-2 font-semibold text-gray-800">Xem trên YouTube</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          {/* Thả lỏng */}
          <View className="mb-3 overflow-hidden rounded-2xl bg-white">
            <AccordionHeader
              title="Thả lỏng"
              duration={sections.cooldown.duration}
              open={openSection === 'cooldown'}
              onPress={() => toggle('cooldown')}
            />
            {openSection === 'cooldown' && (
              <View className="px-4 pb-4 border-t border-gray-100">
                {sections.cooldown.steps.map((step, index) => (
                  <Text key={step} className="text-secondary leading-6 mt-3">
                    {index + 1}. {step}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View className="bg-[#FFF8E7] rounded-2xl p-4 mt-2">
            <Text className="text-[#EBA900] font-bold mb-3">⚠️  Lưu ý an toàn</Text>
            <Text className="text-secondary leading-5">
              Dừng bài tập nếu bạn cảm thấy đau nhói, chóng mặt, khó thở bất thường hoặc mất thăng bằng.
              Tham khảo ý kiến chuyên gia nếu cần.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-3 pb-8 flex-row">
        {item && (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: ERouteTable.REPLACE_WORKOUT_SESSION, params: { id: item.id } })
            }
            className="h-14 flex-1 border border-gray-300 rounded-2xl items-center justify-center mr-3"
          >
            <Text className="font-semibold text-gray-800">Thay thế</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={
            item
              ? complete
              : () => router.push({ pathname: ERouteTable.ADD_WORKOUT_SESSION, params: { key: exercise.key } })
          }
          className="h-14 flex-1 bg-primary-main rounded-2xl items-center justify-center"
        >
          <Text className="font-semibold text-white">
            {item ? (item.status === 'completed' ? 'Đã hoàn thành' : 'Hoàn thành') : 'Thêm buổi tập'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default WorkoutDetailScreen
