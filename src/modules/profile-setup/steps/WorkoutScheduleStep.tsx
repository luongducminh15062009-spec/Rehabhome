import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'
import {
    WORKOUT_DURATION_OPTIONS,
    WORKOUT_PERIOD_OPTIONS,
    WEEKDAY_OPTIONS,
    WeekdayValue,
    WorkoutPeriodType,
} from '../types/profile-setup.types'

interface WorkoutScheduleStepProps {
    workoutDays: WeekdayValue[]
    workoutPeriod: WorkoutPeriodType | null
    workoutStartTime: string | null
    workoutDurationMin: number | null
    onChangeDays: (days: WeekdayValue[]) => void
    onChangePeriod: (period: WorkoutPeriodType) => void
    onChangeStartTime: (time: string) => void
    onChangeDuration: (minutes: number) => void
    onNext: () => void
    onBack: () => void
}

const WorkoutScheduleStep: React.FC<WorkoutScheduleStepProps> = ({
    workoutDays,
    workoutPeriod,
    workoutStartTime,
    workoutDurationMin,
    onChangeDays,
    onChangePeriod,
    onChangeStartTime,
    onChangeDuration,
    onNext,
    onBack,
}) => {
    const selectedPeriod = WORKOUT_PERIOD_OPTIONS.find((item) => item.value === workoutPeriod)
    const canContinue =
        workoutDays.length > 0 && !!workoutPeriod && !!workoutStartTime && !!workoutDurationMin

    const toggleDay = (day: WeekdayValue) => {
        if (workoutDays.includes(day)) {
            onChangeDays(workoutDays.filter((item) => item !== day))
            return
        }
        onChangeDays([...workoutDays, day].sort((a, b) => {
            const order = (value: WeekdayValue) => (value === 0 ? 7 : value)
            return order(a) - order(b)
        }))
    }

    const handleSelectPeriod = (period: WorkoutPeriodType) => {
        onChangePeriod(period)
        const option = WORKOUT_PERIOD_OPTIONS.find((item) => item.value === period)
        if (option && (!workoutStartTime || !option.times.includes(workoutStartTime))) {
            onChangeStartTime(option.times[Math.min(1, option.times.length - 1)])
        }
    }

    return (
        <ProfileSetupLayout
            currentStep={PROFILE_SETUP_STEPS.SCHEDULE}
            totalSteps={PROFILE_SETUP_TOTAL_STEPS}
            title="Thời gian có thể tập mỗi ngày?"
            onBack={onBack}
            onNext={onNext}
            nextButtonDisabled={!canContinue}
        >
            <View className="mb-6">
                <Text className="text-sm font-medium text-secondary mb-3">Ngày trong tuần</Text>
                <View className="flex-row justify-between">
                    {WEEKDAY_OPTIONS.map((day) => {
                        const selected = workoutDays.includes(day.value)
                        return (
                            <TouchableOpacity
                                key={day.value}
                                onPress={() => toggleDay(day.value)}
                                className={`w-10 h-10 rounded-full items-center justify-center ${
                                    selected ? 'bg-primary-main' : 'bg-gray-100'
                                }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${
                                        selected ? 'text-white' : 'text-gray-600'
                                    }`}
                                >
                                    {day.label}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>

            <View className="mb-6">
                <Text className="text-sm font-medium text-secondary mb-3">Khung giờ</Text>
                <View className="gap-3">
                    {WORKOUT_PERIOD_OPTIONS.map((period) => {
                        const selected = workoutPeriod === period.value
                        return (
                            <TouchableOpacity
                                key={period.value}
                                onPress={() => handleSelectPeriod(period.value)}
                                className={`flex-row items-center p-4 rounded-2xl border ${
                                    selected
                                        ? 'border-primary-main bg-transparent-quaternary'
                                        : 'border-gray-200 bg-white'
                                }`}
                            >
                                <View
                                    className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${
                                        selected ? 'bg-primary-main/15' : 'bg-gray-100'
                                    }`}
                                >
                                    <Ionicons
                                        name={period.icon as keyof typeof Ionicons.glyphMap}
                                        size={22}
                                        color={selected ? '#477AFF' : '#637381'}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-gray-900">
                                        {period.title}
                                    </Text>
                                    <Text className="text-sm text-secondary">{period.range}</Text>
                                </View>
                                <View
                                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                                        selected ? 'border-primary-main' : 'border-gray-300'
                                    }`}
                                >
                                    {selected && (
                                        <View className="w-3 h-3 rounded-full bg-primary-main" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>

            {selectedPeriod && (
                <View className="mb-6">
                    <Text className="text-sm font-medium text-secondary mb-3">
                        Giờ bắt đầu gợi ý
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {selectedPeriod.times.map((time) => {
                            const selected = workoutStartTime === time
                            return (
                                <TouchableOpacity
                                    key={time}
                                    onPress={() => onChangeStartTime(time)}
                                    className={`px-4 py-2 rounded-full ${
                                        selected ? 'bg-primary-main' : 'bg-gray-100'
                                    }`}
                                >
                                    <Text
                                        className={`text-sm font-semibold ${
                                            selected ? 'text-white' : 'text-gray-700'
                                        }`}
                                    >
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            )}

            <View>
                <Text className="text-sm font-medium text-secondary mb-3">Thời lượng trung bình</Text>
                {WORKOUT_DURATION_OPTIONS.map((option) => {
                    const selected = workoutDurationMin === option.value
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onChangeDuration(option.value)}
                            className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-3"
                        >
                            <Text
                                className={`text-base font-semibold ${
                                    selected ? 'text-primary-main' : 'text-gray-900'
                                }`}
                            >
                                {option.label}
                            </Text>
                            <View
                                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                                    selected ? 'border-primary-main' : 'border-gray-300'
                                }`}
                            >
                                {selected && (
                                    <View className="w-3 h-3 rounded-full bg-primary-main" />
                                )}
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </ProfileSetupLayout>
    )
}

export default WorkoutScheduleStep
