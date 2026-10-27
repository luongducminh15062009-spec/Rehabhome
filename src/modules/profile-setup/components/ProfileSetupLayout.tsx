import React, { ReactNode } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProgressBar from './ProgressBar'
import AppButton from '@/components/common/AppButton'

interface ProfileSetupLayoutProps {
    currentStep: number
    totalSteps: number
    title?: string
    children: ReactNode
    onBack?: () => void
    onNext?: () => void
    nextButtonText?: string
    nextButtonDisabled?: boolean
    hideHeader?: boolean
    hideFooter?: boolean
    hideProgress?: boolean
}

const ProfileSetupLayout: React.FC<ProfileSetupLayoutProps> = ({
    currentStep,
    totalSteps,
    title,
    children,
    onBack,
    onNext,
    nextButtonText = 'Tiếp theo',
    nextButtonDisabled = false,
    hideHeader = false,
    hideFooter = false,
    hideProgress = false,
}) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {!hideHeader && (
                <View className="pt-4 pb-6">
                    {onBack && (
                        <TouchableOpacity onPress={onBack} className="px-8 mb-6">
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                    )}

                    {!hideProgress && (
                        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                    )}
                </View>
            )}

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={hideFooter ? { flexGrow: 1 } : undefined}>
                <View className={`px-8 py-6 ${hideFooter ? 'flex-1 justify-center' : ''}`}>
                    {!!title && (
                        <Text className="text-2xl font-bold text-gray-900 mb-8">{title}</Text>
                    )}
                    {children}
                </View>
            </ScrollView>

            {!hideFooter && onNext && (
                <View className="px-8 pb-8 pt-4">
                    <AppButton title={nextButtonText} onPress={onNext} disabled={nextButtonDisabled} />
                </View>
            )}
        </SafeAreaView>
    )
}

export default ProfileSetupLayout
