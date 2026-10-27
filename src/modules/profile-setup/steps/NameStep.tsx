import React from 'react'
import { TextInput, View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'

interface NameStepProps {
    value: string
    onChange: (value: string) => void
    onNext: () => void
    onBack: () => void
}

const NameStep: React.FC<NameStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={PROFILE_SETUP_STEPS.NAME}
            totalSteps={PROFILE_SETUP_TOTAL_STEPS}
            title="Bạn thích được xưng hô bằng danh xưng nào?"
            onBack={onBack}
            onNext={onNext}
            nextButtonDisabled={!value.trim()}
        >
            <View>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="VD: Dũng"
                    className="h-14 border border-gray-300 pl-4 rounded-xl bg-white text-base"
                    placeholderTextColor="#9CA3AF"
                />
            </View>
        </ProfileSetupLayout>
    )
}

export default NameStep
