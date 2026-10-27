import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  ExerciseTemplate,
  EXERCISE_LIBRARY,
  WorkoutPlanItem,
  WorkoutPlanService,
} from '@/services/workout-plan.service'
import WorkoutScreenHeader from '@/components/workout-plan/WorkoutScreenHeader'

const ExerciseRow = ({ exercise, selected, onPress }: { exercise: ExerciseTemplate; selected?: boolean; onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress} className="bg-white rounded-[24px] p-2.5 mb-3 flex-row items-center">
    <Image source={exercise.image} className="w-[78px] h-[78px] rounded-2xl mr-4" />
    <View className="flex-1"><Text className="text-lg font-bold" numberOfLines={1}>{exercise.title}</Text><Text className="text-secondary mt-2">{exercise.durationMinutes} phút • {exercise.difficulty} • <Text className="text-[#38BFA0]">{exercise.category}</Text></Text></View>
    {onPress && <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={selected ? '#477AFF' : '#7C8A99'} />}
  </TouchableOpacity>
)

const ReplaceWorkoutSessionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [item, setItem] = useState<WorkoutPlanItem | null>(null)
  const [selected, setSelected] = useState<ExerciseTemplate | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => { WorkoutPlanService.getPlanItem(id).then(setItem) }, [id])
  const current = EXERCISE_LIBRARY.find((entry) => entry.key === item?.exercise_key)
  const alternatives = EXERCISE_LIBRARY.filter((entry) => entry.key !== item?.exercise_key).slice(0, 5)

  const save = async () => {
    if (selected && await WorkoutPlanService.replacePlanItem(id, selected)) setSuccess(true)
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <WorkoutScreenHeader title="Thay thế buổi tập" />
      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 110 }}>
        {current && <ExerciseRow exercise={current} />}
        <Text className="text-2xl font-medium text-gray-900 mt-6 mb-4">Chọn bài tập thay thế</Text>
        {alternatives.map((exercise) => <ExerciseRow key={exercise.key} exercise={exercise} selected={selected?.key === exercise.key} onPress={() => setSelected(exercise)} />)}
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-7 pt-3 bg-white"><TouchableOpacity disabled={!selected} onPress={save} className={`h-14 rounded-2xl items-center justify-center ${selected ? 'bg-primary-main' : 'bg-blue-300'}`}><Text className="text-white text-lg">Xác nhận</Text></TouchableOpacity></View>
      <Modal visible={success} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-6"><View className="w-full bg-white rounded-[28px] p-7 items-center">
          <TouchableOpacity onPress={() => router.replace('/(screens)/weekly-workout-plan')} className="self-end"><Ionicons name="close" size={28} color="#7C8A99" /></TouchableOpacity>
          <Text className="text-2xl font-bold mt-1">Thay thế buổi tập</Text><Text className="text-secondary text-base mt-4 mb-8">Thay thế buổi tập thành công!</Text>
          <TouchableOpacity onPress={() => router.replace('/(screens)/weekly-workout-plan')} className="w-full h-14 bg-primary-main rounded-2xl items-center justify-center"><Text className="text-white text-lg">Xong</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </SafeAreaView>
  )
}

export default ReplaceWorkoutSessionScreen
