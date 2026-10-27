import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'
import { RECOMMENDED_EXERCISES } from '@/services/workout-plan.service'
import {
    ProfileSetupData,
    WEEKDAY_OPTIONS,
    formatDurationLabel,
    getGoalLabel,
} from '../types/profile-setup.types'

interface PlanSummaryStepProps {
    formData: ProfileSetupData
    onNext: () => void
    onBack: () => void
    loading?: boolean
}

const PlanSummaryStep: React.FC<PlanSummaryStepProps> = ({
    formData,
    onNext,
    onBack,
    loading = false,
}) => {
    const frequency = formData.workout_days.length

    return (
        <ProfileSetupLayout
            currentStep={PROFILE_SETUP_STEPS.PLAN_SUMMARY}
            totalSteps={PROFILE_SETUP_TOTAL_STEPS}
            title="Kế hoạch tập luyện"
            onBack={onBack}
            onNext={onNext}
            nextButtonText="Hoàn tất"
            nextButtonDisabled={loading}
            hideProgress
        >
            <View className="mb-6">
                <View className="bg-[#F3F1FF] rounded-2xl px-4 py-4 flex-row items-center mb-3">
                    <View className="w-11 h-11 rounded-full bg-[#E4E9FF] items-center justify-center mr-3">
                        <Ionicons name="add" size={22} color="#477AFF" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-secondary mb-0.5">Mục tiêu chính</Text>
                        <Text className="text-base font-bold text-gray-900">
                            {getGoalLabel(formData.goal)}
                        </Text>
                    </View>
                </View>

                <View className="flex-row">
                    <View className="flex-1 bg-[#E7F6F8] rounded-2xl p-4 mr-3">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-xs text-secondary">Tần suất</Text>
                            <Ionicons name="calendar-outline" size={18} color="#2EB8C4" />
                        </View>
                        <Text className="text-base font-bold text-gray-900">
                            {frequency} buổi/tuần
                        </Text>
                    </View>
                    <View className="flex-1 bg-[#E8F8EE] rounded-2xl p-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-xs text-secondary">Thời lượng TB</Text>
                            <Ionicons name="time-outline" size={18} color="#22C55E" />
                        </View>
                        <Text className="text-base font-bold text-gray-900">
                            {formatDurationLabel(formData.workout_duration_min)}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                    Lịch tập hàng tuần
                </Text>
                <View className="flex-row justify-between">
                    {WEEKDAY_OPTIONS.map((day) => {
                        const selected = formData.workout_days.includes(day.value)
                        return (
                            <View key={day.value} className="items-center">
                                <Text className="text-xs text-secondary mb-2">{day.label}</Text>
                                <View
                                    className={`w-8 h-8 rounded-full items-center justify-center ${
                                        selected
                                            ? 'bg-primary-main'
                                            : 'bg-white border border-[#D0D5DD]'
                                    }`}
                                >
                                    {selected && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>

            <View>
                <Text className="text-base font-semibold text-gray-900 mb-3">
                    Các bài tập được đề xuất
                </Text>
                {RECOMMENDED_EXERCISES.map((item) => (
                    <View
                        key={item.key}
                        className="border border-[#EEF1F4] rounded-2xl px-4 py-3.5 mb-3 bg-white"
                    >
                        <Text className="text-base font-semibold text-gray-900 mb-1">
                            {item.title}
                        </Text>
                        <Text className="text-sm text-secondary leading-5">{item.description}</Text>
                    </View>
                ))}
            </View>
        </ProfileSetupLayout>
    )
}

export default PlanSummaryStep
