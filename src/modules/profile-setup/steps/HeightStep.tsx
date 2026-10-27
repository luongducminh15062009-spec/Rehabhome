import React from 'react'
import { View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import NumericStepper from '../components/NumericStepper'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'

interface HeightStepProps {
    value: number
    onChange: (value: number) => void
    onNext: () => void
    onBack: () => void
}

const HeightStep: React.FC<HeightStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={PROFILE_SETUP_STEPS.HEIGHT}
            totalSteps={PROFILE_SETUP_TOTAL_STEPS}
            title="Chiều cao của bạn?"
            onBack={onBack}
            onNext={onNext}
        >
            <View>
                <NumericStepper
                    value={value}
                    onChange={onChange}
                    unit="cm"
                    min={100}
                    max={250}
                    step={0.5}
                    decimalPlaces={1}
                />
            </View>
        </ProfileSetupLayout>
    )
}

export default HeightStep
