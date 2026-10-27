import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { toast } from '@/components/common/ToastManager'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { MyWorkoutsService, WorkoutVisibility } from '@/services/my-workouts.service'
import { EXERCISE_CATEGORIES } from '@/services/workout-plan.service'

const CATEGORIES = [...EXERCISE_CATEGORIES]
const DIFFICULTIES = ['Dễ', 'Trung bình', 'Khó']

const FieldLabel = ({ children }: { children: string }) => (
  <Text className="text-base font-bold text-gray-900 mb-2.5">{children}</Text>
)

const InputBox = ({
  value,
  onChangeText,
  placeholder,
  multiline,
  className,
}: {
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  multiline?: boolean
  className?: string
}) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#94A3B8"
    multiline={multiline}
    textAlignVertical={multiline ? 'top' : 'center'}
    className={`bg-white rounded-2xl px-4 text-base text-gray-900 border border-[#D0D5DD] ${
      multiline ? 'py-3.5 min-h-[100px]' : 'h-14'
    } ${className || ''}`}
  />
)

const Chip = ({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className="h-11 px-4 rounded-full mr-2 mb-2 items-center justify-center"
    style={{
      backgroundColor: active ? '#477AFF' : '#FFFFFF',
      borderWidth: 1,
      borderColor: active ? '#477AFF' : '#E5E7EB',
    }}
  >
    <Text className={`text-sm ${active ? 'text-white font-semibold' : 'text-gray-900'}`}>
      {label}
    </Text>
  </TouchableOpacity>
)

const CreateWorkoutScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const { user } = useAuth()
  const { profile } = useProfile()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<string[]>([CATEGORIES[0]])
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState('Dễ')
  const [targetArea, setTargetArea] = useState('')
  const [posture, setPosture] = useState('')
  const [equipment, setEquipment] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [visibility, setVisibility] = useState<WorkoutVisibility>('public')
  const [content, setContent] = useState('')
  const [safetyNotes, setSafetyNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      const workout = await MyWorkoutsService.getCreatedWorkout(id)
      if (!mounted) return
      if (!workout) {
        toast.error('Lỗi', 'Không tìm thấy bài tập.')
        router.back()
        return
      }
      if (user?.id && workout.creatorId !== user.id) {
        toast.error('Không có quyền', 'Bạn chỉ có thể sửa bài tập của mình.')
        router.back()
        return
      }
      setTitle(workout.title)
      setDescription(workout.description)
      setCategories(workout.categories.length ? workout.categories : [CATEGORIES[0]])
      setDuration(String(workout.durationMinutes || ''))
      setDifficulty(workout.difficulty || 'Dễ')
      setTargetArea(workout.targetArea || '')
      setPosture(workout.posture || '')
      setEquipment(workout.equipment || '')
      setImageUrl(workout.imageUrl || '')
      setVideoUrl(workout.videoUrl || '')
      setVisibility(workout.visibility || 'public')
      setContent(workout.content || '')
      setSafetyNotes(workout.safetyNotes || '')
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [id, user?.id])

  const toggleCategory = (item: string) => {
    setCategories((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item],
    )
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      toast.error('Cần quyền truy cập', 'Cho phép truy cập thư viện ảnh để tiếp tục.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]?.uri) {
      setImageUrl(result.assets[0].uri)
    }
  }

  const submit = async () => {
    if (!user?.id) {
      toast.error('Lỗi', 'Vui lòng đăng nhập để tạo bài tập.')
      return
    }
    if (!title.trim()) {
      toast.error('Thiếu thông tin', 'Vui lòng nhập tên bài tập.')
      return
    }
    if (!categories.length) {
      toast.error('Thiếu thông tin', 'Vui lòng chọn ít nhất một danh mục.')
      return
    }
    const durationMinutes = Number(duration) || 15
    const creatorName =
      profile?.full_name?.trim() ||
      user.email?.split('@')[0] ||
      'Người dùng'

    const payload = {
      title: title.trim(),
      description: description.trim(),
      categories,
      durationMinutes,
      difficulty,
      targetArea,
      posture: posture.trim() || 'Ngồi hoặc nằm thoải mái',
      equipment: equipment.trim() || 'Không cần',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700',
      videoUrl: videoUrl.trim(),
      visibility,
      content: content.trim(),
      safetyNotes: safetyNotes.trim(),
    }

    setSaving(true)
    try {
      if (isEdit && id) {
        await MyWorkoutsService.updateWorkout(id, user.id, payload)
        toast.success('Thành công', 'Đã cập nhật bài tập.')
      } else {
        await MyWorkoutsService.createWorkout({
          ...payload,
          creator: creatorName,
          creatorId: user.id,
        })
        toast.success('Thành công', 'Đã tạo bài tập mới.')
      }
      router.back()
    } catch {
      toast.error('Lỗi', isEdit ? 'Không thể cập nhật bài tập.' : 'Không thể tạo bài tập.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
        <ActivityIndicator size="large" color="#477AFF" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#637381" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-gray-900 mr-12">
          {isEdit ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <FieldLabel>Tên bài tập</FieldLabel>
          <InputBox
            value={title}
            onChangeText={setTitle}
            placeholder="VD: Năng lượng mỗi ngày"
          />

          <View className="h-5" />
          <FieldLabel>Mô tả ngắn</FieldLabel>
          <InputBox
            value={description}
            onChangeText={setDescription}
            placeholder="Mô tả ngắn về bài tập của bạn..."
            multiline
          />

          <View className="h-5" />
          <FieldLabel>Danh mục</FieldLabel>
          <View className="flex-row flex-wrap">
            {CATEGORIES.map((item) => (
              <Chip
                key={item}
                label={item}
                active={categories.includes(item)}
                onPress={() => toggleCategory(item)}
              />
            ))}
          </View>

          <View className="h-3" />
          <FieldLabel>Thời lượng</FieldLabel>
          <InputBox value={duration} onChangeText={setDuration} placeholder="phút" />

          <View className="h-5" />
          <FieldLabel>Độ khó</FieldLabel>
          <View className="flex-row flex-wrap">
            {DIFFICULTIES.map((item) => (
              <Chip
                key={item}
                label={item}
                active={difficulty === item}
                onPress={() => setDifficulty(item)}
              />
            ))}
          </View>

          <View className="h-3" />
          <FieldLabel>Tư thế</FieldLabel>
          <InputBox
            value={posture}
            onChangeText={setPosture}
            placeholder="VD: Ngồi hoặc nằm thoải mái"
          />

          <View className="h-5" />
          <FieldLabel>Dụng cụ</FieldLabel>
          <InputBox
            value={equipment}
            onChangeText={setEquipment}
            placeholder="VD: Không cần"
          />

          <View className="h-5" />
          <FieldLabel>Hình thu nhỏ</FieldLabel>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.85}
            className="h-40 rounded-2xl bg-white border border-[#D0D5DD] items-center justify-center overflow-hidden"
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Ionicons name="camera-outline" size={28} color="#94A3B8" />
                <Text className="text-sm text-[#94A3B8] mt-2">
                  Thêm hình ảnh, <Text className="text-primary-main font-semibold">Duyệt</Text>
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="h-5" />
          <FieldLabel>Thêm URL video của bạn</FieldLabel>
          <InputBox value={videoUrl} onChangeText={setVideoUrl} placeholder="Thêm URL video" />
          <View className="flex-row items-center mt-2">
            <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
            <Text className="text-xs text-[#94A3B8] ml-1">Hỗ trợ video Youtube</Text>
          </View>

          <View className="h-5" />
          <FieldLabel>Cài đặt hiển thị</FieldLabel>
          {(
            [
              {
                key: 'public' as const,
                title: 'Công khai',
                desc: 'Mọi người có thể thấy bài tập này',
              },
              {
                key: 'private' as const,
                title: 'Riêng tư',
                desc: 'Chỉ bạn có thể thấy bài tập này',
              },
            ] as const
          ).map((item) => {
            const active = visibility === item.key
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setVisibility(item.key)}
                activeOpacity={0.85}
                className="flex-row items-start mb-4"
              >
                <View
                  className="w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5 mr-3"
                  style={{ borderColor: active ? '#477AFF' : '#CBD5E1' }}
                >
                  {active && <View className="w-2.5 h-2.5 rounded-full bg-primary-main" />}
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
                  <Text className="text-sm text-[#94A3B8] mt-0.5">{item.desc}</Text>
                </View>
              </TouchableOpacity>
            )
          })}

          <FieldLabel>Nội dung bài tập</FieldLabel>
          <InputBox
            value={content}
            onChangeText={setContent}
            placeholder="Nhập nội dung..."
            multiline
          />

          <View className="h-5" />
          <FieldLabel>Lưu ý an toàn</FieldLabel>
          <InputBox
            value={safetyNotes}
            onChangeText={setSafetyNotes}
            placeholder="Lưu ý an toàn..."
            multiline
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-[#F7F8FA]">
        <TouchableOpacity
          onPress={submit}
          disabled={saving}
          activeOpacity={0.85}
          className="h-14 rounded-2xl bg-primary-main items-center justify-center"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          <Text className="text-white text-lg font-semibold">
            {saving
              ? isEdit
                ? 'Đang lưu...'
                : 'Đang tạo...'
              : isEdit
                ? 'Lưu thay đổi'
                : 'Tạo bài tập'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CreateWorkoutScreen
