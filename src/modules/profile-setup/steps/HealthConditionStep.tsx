import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'
import {
    HEALTH_CONDITION_OPTIONS,
    HealthConditionType,
} from '../types/profile-setup.types'

interface HealthConditionStepProps {
    value: HealthConditionType | null
    notes: string
    onChange: (value: HealthConditionType) => void
    onChangeNotes: (notes: string) => void
    onNext: () => void
    onBack: () => void
}

const HealthConditionStep: React.FC<HealthConditionStepProps> = ({
    value,
    notes,
    onChange,
    onChangeNotes,
    onNext,
    onBack,
}) => {
    const canContinue = !!value && (value !== 'other' || notes.trim().length > 0)

    return (
        <ProfileSetupLayout
            currentStep={PROFILE_SETUP_STEPS.HEALTH}
            totalSteps={PROFILE_SETUP_TOTAL_STEPS}
            title="Tình trạng sức khỏe đặc biệt?"
            onBack={onBack}
            onNext={onNext}
            nextButtonDisabled={!canContinue}
        >
            <View>
                {HEALTH_CONDITION_OPTIONS.map((option) => {
                    const selected = value === option.value
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onChange(option.value)}
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

                {value === 'other' && (
                    <View className="mt-2">
                        <Text className="text-sm font-medium text-secondary mb-2">Ghi chú</Text>
                        <TextInput
                            value={notes}
                            onChangeText={onChangeNotes}
                            placeholder="Mô tả ngắn tình trạng của bạn..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            textAlignVertical="top"
                            className="min-h-[100px] border border-gray-300 rounded-xl px-4 py-3 bg-white text-base text-gray-900"
                        />
                    </View>
                )}
            </View>
        </ProfileSetupLayout>
    )
}

export default HealthConditionStep
