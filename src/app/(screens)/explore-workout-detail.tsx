import React, { useCallback, useMemo, useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Heart } from 'iconsax-react-native'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { ERouteTable } from '@/constants/route-table'
import { toast } from '@/components/common/ToastManager'
import {
  CustomWorkout,
  extractYoutubeId,
  fetchExerciseSetup,
  formatRelativeDays,
  getWorkoutTags,
  MyWorkoutsService,
  ReportReason,
  resolveCreatorName,
} from '@/services/my-workouts.service'
import {
  EXERCISE_LIBRARY,
  ExerciseTemplate,
  getExerciseSections,
  getExerciseSetup,
} from '@/services/workout-plan.service'
import { useAuth } from '@/context/auth-provider'

const APP_ORIGIN = 'https://com.fit.mind'

const STEP_TARGETS = [
  'Đùi, mông và cơ trung tâm',
  'Ngực, vai và tay',
  'Đùi, mông',
  'Lưng và cơ trung tâm',
  'Mông và lưng dưới',
]

const youtubeEmbedHtml = (videoId: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe
      src="https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowfullscreen
    ></iframe>
  </body>
</html>
`

type DetailModel = {
  key: string
  title: string
  description: string
  tags: string[]
  durationMinutes: number
  calories: number
  posture: string
  equipment: string
  image: ImageSourcePropType
  videoId?: string
  likes: number
  creator: string
  creatorId?: string
  createdLabel: string
  safetyNotes: string
  contentIntro: string
  steps: { title: string; reps: string; target: string; instruction: string; note: string }[]
  libraryKey?: string
}

const buildFromLibrary = (exercise: ExerciseTemplate): DetailModel => {
  const sections = getExerciseSections(exercise)
  return {
    key: exercise.key,
    title: exercise.title,
    description: exercise.description,
    tags: getWorkoutTags(exercise.category),
    durationMinutes: exercise.durationMinutes,
    calories: Math.round(exercise.durationMinutes * 2.5),
    ...getExerciseSetup(exercise.key),
    image: exercise.image,
    videoId: exercise.videoId,
    likes: 28,
    creator: 'Rehab Home',
    createdLabel: '3 ngày trước',
    safetyNotes:
      'Dừng bài tập nếu bạn cảm thấy đau nhói, chóng mặt, khó thở bất thường hoặc mất thăng bằng. Nếu bạn đang có chấn thương hoặc bệnh lý, hãy tham khảo ý kiến chuyên gia trước khi tập.',
    contentIntro: sections.main.intro,
    steps: sections.main.steps.map((step, index) => {
      const repsMatch = step.detail.match(/(\d+[–\-]\d+|\d+)\s*lần/i)
      return {
        title: step.title,
        reps: repsMatch ? `${repsMatch[1]} lần` : '10–12 lần',
        target: STEP_TARGETS[index % STEP_TARGETS.length],
        instruction: step.detail.replace(/^.*?lần\.\s*/i, '') || step.detail,
        note: 'Giữ tư thế ổn định, thở đều và không gồng cổ.',
      }
    }),
    libraryKey: exercise.key,
  }
}

const buildFromCustom = (
  workout: CustomWorkout,
  currentUserId?: string | null,
): DetailModel => {
  const lines = workout.content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const steps =
    lines.length > 0
      ? lines.map((line, index) => ({
          title: line.replace(/^\d+\.\s*/, ''),
          reps: '10–12 lần',
          target: workout.targetArea || 'Toàn thân',
          instruction: line,
          note: 'Thực hiện chậm, kiểm soát biên độ động tác.',
        }))
      : [
          {
            title: 'Bài tập chính',
            reps: 'Theo hướng dẫn',
            target: workout.targetArea || 'Toàn thân',
            instruction: workout.description || 'Thực hiện theo nội dung bài tập.',
            note: 'Dừng lại nếu cảm thấy khó chịu.',
          },
        ]

  return {
    key: workout.id,
    title: workout.title,
    description: workout.description,
    tags: getWorkoutTags(workout.categories),
    durationMinutes: workout.durationMinutes,
    calories: Math.round(workout.durationMinutes * 2.5),
    posture: workout.posture || 'Ngồi hoặc nằm thoải mái',
    equipment: workout.equipment || 'Không cần',
    image: { uri: workout.imageUrl },
    videoId: extractYoutubeId(workout.videoUrl),
    likes: workout.likes,
    creator: resolveCreatorName(workout, currentUserId),
    creatorId: workout.creatorId,
    createdLabel: formatRelativeDays(workout.createdAt),
    safetyNotes:
      workout.safetyNotes ||
      'Dừng bài tập nếu bạn cảm thấy đau nhói, chóng mặt, khó thở bất thường hoặc mất thăng bằng.',
    contentIntro: 'Thực hiện theo nội dung bên dưới. Nghỉ khi cần thiết.',
    steps,
  }
}

const ExploreWorkoutDetailScreen = () => {
  const { key, source } = useLocalSearchParams<{ key?: string; source?: string }>()
  const { user } = useAuth()
  const [detail, setDetail] = useState<DetailModel | null>(null)
  const [liked, setLiked] = useState(false)
  const [playing, setPlaying] = useState(false)

  useFocusEffect(
    useCallback(() => {
      let mounted = true
      const load = async () => {
        if (!key) return
        if (source === 'custom') {
          const custom = await MyWorkoutsService.getCreatedWorkout(key)
          if (mounted && custom) setDetail(buildFromCustom(custom, user?.id))
        } else {
          const exercise = EXERCISE_LIBRARY.find((item) => item.key === key)
          if (mounted && exercise) setDetail(buildFromLibrary(exercise))
        }
        const setup = await fetchExerciseSetup(key)
        if (mounted && setup) {
          setDetail((current) =>
            current
              ? { ...current, posture: setup.posture, equipment: setup.equipment }
              : current,
          )
        }
        if (mounted) setLiked(await MyWorkoutsService.isSaved(key))
      }
      load()
      return () => {
        mounted = false
      }
    }, [key, source, user?.id]),
  )

  const caloriesLabel = useMemo(
    () => (detail ? `${detail.calories} calo` : ''),
    [detail],
  )

  if (!detail) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-secondary">Không tìm thấy bài tập</Text>
      </View>
    )
  }

  const isOwner =
    source === 'custom' && !!user?.id && !!detail.creatorId && detail.creatorId === user.id
  const canModerate = source === 'custom' && !isOwner

  const toggleLike = async () => {
    const next = await MyWorkoutsService.toggleSaved(detail.key)
    setLiked(next)
    toast.success(next ? 'Đã lưu bài tập' : 'Đã bỏ lưu', 'Bài tập của tôi đã được cập nhật.')
  }

  const openEdit = () => {
    router.push({
      pathname: ERouteTable.CREATE_WORKOUT,
      params: { id: detail.key },
    })
  }

  const submitReport = async (reason: ReportReason) => {
    await MyWorkoutsService.reportWorkout({
      workoutId: detail.key,
      creatorId: detail.creatorId,
      reason,
      reporterId: user?.id,
    })
    toast.success('Đã gửi báo cáo', 'Cảm ơn bạn. Nội dung sẽ được ẩn khỏi Khám phá của bạn.')
    router.back()
  }

  const openReportSheet = () => {
    const reasons: { label: string; value: ReportReason }[] = [
      { label: 'Nội dung không phù hợp', value: 'inappropriate' },
      { label: 'Spam / quảng cáo', value: 'spam' },
      { label: 'Thông tin sai lệch', value: 'misleading' },
      { label: 'Không an toàn khi tập', value: 'unsafe' },
      { label: 'Lý do khác', value: 'other' },
    ]

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Báo cáo bài tập',
          options: [...reasons.map((r) => r.label), 'Hủy'],
          cancelButtonIndex: reasons.length,
          destructiveButtonIndex: 0,
        },
        (index) => {
          if (index === undefined || index >= reasons.length) return
          submitReport(reasons[index].value)
        },
      )
      return
    }

    Alert.alert(
      'Báo cáo bài tập',
      'Chọn lý do báo cáo',
      [
        ...reasons.map((r) => ({
          text: r.label,
          onPress: () => submitReport(r.value),
        })),
        { text: 'Hủy', style: 'cancel' as const },
      ],
      { cancelable: true },
    )
  }

  const blockCreator = () => {
    if (!detail.creatorId) return
    Alert.alert(
      'Chặn tác giả',
      `Bạn sẽ không còn thấy bài tập công khai của “${detail.creator}”.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Chặn',
          style: 'destructive',
          onPress: async () => {
            await MyWorkoutsService.blockCreator(detail.creatorId!)
            await MyWorkoutsService.reportWorkout({
              workoutId: detail.key,
              creatorId: detail.creatorId,
              reason: 'other',
              note: 'blocked-creator',
              reporterId: user?.id,
            })
            toast.success('Đã chặn', 'Nội dung của tác giả này đã được ẩn.')
            router.back()
          },
        },
      ],
    )
  }

  const openModerationMenu = () => {
    Alert.alert('Kiểm duyệt nội dung', undefined, [
      { text: 'Báo cáo bài tập', onPress: openReportSheet },
      ...(detail.creatorId
        ? [{ text: 'Chặn tác giả', style: 'destructive' as const, onPress: blockCreator }]
        : []),
      { text: 'Hủy', style: 'cancel' },
    ])
  }

  const addToMyWorkouts = async () => {
    await MyWorkoutsService.saveWorkout(detail.key)
    setLiked(true)
    toast.success('Đã thêm vào bài tập', 'Xem trong mục Đã lưu')
  }

  const addToPlan = () => {
    const planKey = detail.libraryKey || detail.key
    if (!detail.libraryKey) {
      toast.error('Chưa hỗ trợ', 'Bài tập tự tạo chưa thể thêm vào kế hoạch.')
      return
    }
    router.push({ pathname: ERouteTable.ADD_WORKOUT_SESSION, params: { key: planKey } })
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-5 pt-1 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 rounded-full bg-[#F5F6F8] items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#637381" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5">
          <View className="rounded-[28px] overflow-hidden bg-black h-[210px] mb-5">
            {playing && detail.videoId ? (
              <WebView
                source={{
                  html: youtubeEmbedHtml(detail.videoId),
                  baseUrl: APP_ORIGIN,
                }}
                style={{ flex: 1 }}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
              />
            ) : detail.videoId ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setPlaying(true)}
                className="flex-1"
              >
                <Image source={detail.image} className="w-full h-full" />
                <View className="absolute inset-0 items-center justify-center">
                  <View className="w-16 h-16 rounded-full bg-white/85 items-center justify-center">
                    <Ionicons name="play" size={30} color="#1A1A1A" style={{ marginLeft: 3 }} />
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <Image source={detail.image} className="w-full h-full" />
            )}
          </View>

          <Text className="text-2xl font-bold text-primary-main mb-2">{detail.title}</Text>

          <Text className="text-sm text-[#38BFA0] mb-3">{detail.tags.join('   ')}</Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="time-outline" size={18} color="#637381" />
            <Text className="text-sm text-[#637381] ml-1.5 mr-5">{detail.durationMinutes} phút</Text>
            <Ionicons name="flame-outline" size={18} color="#637381" />
            <Text className="text-sm text-[#637381] ml-1.5">{caloriesLabel}</Text>
          </View>

          <Text className="text-sm text-gray-900 mb-1">
            Tư thế: <Text className="text-[#637381]">{detail.posture}</Text>
          </Text>
          <Text className="text-sm text-gray-900 mb-5">
            Dụng cụ: <Text className="text-[#637381]">{detail.equipment}</Text>
          </Text>

          <Text className="text-lg font-bold text-gray-900 mb-2">Mô tả ngắn</Text>
          <Text className="text-sm text-[#637381] leading-6 mb-5">{detail.description}</Text>

          <View className="bg-[#FFF8E7] rounded-2xl p-4 mb-6 flex-row">
            <Ionicons name="warning" size={20} color="#EBA900" style={{ marginTop: 2 }} />
            <View className="flex-1 ml-2">
              <Text className="text-[#EBA900] font-bold mb-1">Lưu ý an toàn</Text>
              <Text className="text-sm text-[#637381] leading-5">{detail.safetyNotes}</Text>
              <Text className="text-sm text-[#637381] leading-5 mt-2">
                Nội dung chỉ mang tính tham khảo, không thay thế tư vấn y tế chuyên nghiệp.
              </Text>
            </View>
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-2">Nội dung bài tập</Text>
          <Text className="text-sm text-[#637381] leading-6 mb-4">{detail.contentIntro}</Text>

          {detail.steps.map((step, index) => (
            <View key={`${step.title}-${index}`} className="mb-5">
              <Text className="text-base font-bold text-gray-900 mb-1">
                {index + 1}. {step.title}
              </Text>
              <Text className="text-sm text-[#637381] mb-0.5">Số lần: {step.reps}</Text>
              <Text className="text-sm text-[#637381] mb-1">Tác động: {step.target}</Text>
              <Text className="text-sm text-[#637381] leading-5 mb-1">{step.instruction}</Text>
              <Text className="text-sm text-[#637381]">
                <Text className="font-semibold text-gray-800">Lưu ý: </Text>
                {step.note}
              </Text>
            </View>
          ))}

          {detail.videoId ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${detail.videoId}`)}
              className="mb-4 h-11 rounded-2xl bg-[#F5F6F8] items-center justify-center flex-row"
            >
              <Ionicons name="logo-youtube" size={18} color="#FF0000" />
              <Text className="ml-2 font-semibold text-gray-800">Xem trên YouTube</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-3 pb-8 flex-row border-t border-gray-100">
        <TouchableOpacity
          onPress={addToMyWorkouts}
          className="h-14 flex-1 border border-gray-300 rounded-2xl items-center justify-center mr-3"
        >
          <Text className="font-semibold text-gray-800">Thêm vào bài tập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={addToPlan}
          className="h-14 flex-1 bg-primary-main rounded-2xl items-center justify-center"
        >
          <Text className="font-semibold text-white">Thêm vào kế hoạch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ExploreWorkoutDetailScreen
