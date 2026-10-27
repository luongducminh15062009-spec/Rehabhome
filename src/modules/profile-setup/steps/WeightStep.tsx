import React from 'react'
import { View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import NumericStepper from '../components/NumericStepper'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'

interface WeightStepProps {
    value: number
    onChange: (value: number) => void
    onNext: () => void
    onBack: () => void
}

const WeightStep: React.FC<WeightStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={PROFILE_SETUP_STEPS.WEIGHT}
            totalSteps={PROFILE_SETUP_TOTAL_STEPS}
            title="Cân nặng của bạn?"
            onBack={onBack}
            onNext={onNext}
        >
            <View>
                <NumericStepper
                    value={value}
                    onChange={onChange}
                    unit="kg"
                    min={30}
                    max={300}
                    step={0.1}
                    decimalPlaces={1}
                />
            </View>
        </ProfileSetupLayout>
    )
}

export default WeightStep
