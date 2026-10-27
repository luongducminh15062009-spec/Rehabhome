import React from 'react'
import { View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import GoalOption from '../components/GoalOption'
import { GOAL_OPTIONS, GoalType } from '../types/profile-setup.types'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'

interface GoalStepProps {
    value: GoalType | null
    onChange: (value: GoalType) => void
    onNext: () => void
    onBack: () => void
}

const GoalStep: React.FC<GoalStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={PROFILE_SETUP_STEPS.GOAL}
            totalSteps={PROFILE_SETUP_TOTAL_STEPS}
            title="Mục tiêu chính của bạn?"
            onBack={onBack}
            onNext={onNext}
            nextButtonDisabled={!value}
        >
            <View>
                {GOAL_OPTIONS.map((option, index) => (
                    <GoalOption
                        key={index}
                        label={option.label}
                        selected={value === option.value}
                        onPress={() => onChange(option.value)}
                    />
                ))}
            </View>
        </ProfileSetupLayout>
    )
}

export default GoalStep
