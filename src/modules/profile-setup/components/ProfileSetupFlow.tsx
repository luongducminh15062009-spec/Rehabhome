import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { AuthService } from '@/services/auth.service'
import {
    ProfileSetupData,
    WeekdayValue,
    WorkoutPeriodType,
    HealthConditionType,
} from '../types/profile-setup.types'
import { updateUserProfile } from '../services/profile-setup.service'
import { PROFILE_SETUP_STEPS, PROFILE_SETUP_TOTAL_STEPS } from '../constants'

import NameStep from '../steps/NameStep'
import GenderStep from '../steps/GenderStep'
import GoalStep from '../steps/GoalStep'
import AgeStep from '../steps/AgeStep'
import HeightStep from '../steps/HeightStep'
import WeightStep from '../steps/WeightStep'
import ActivityLevelStep from '../steps/ActivityLevelStep'
import WorkoutScheduleStep from '../steps/WorkoutScheduleStep'
import HealthConditionStep from '../steps/HealthConditionStep'
import PlanSummaryStep from '../steps/PlanSummaryStep'

const ProfileSetupFlow: React.FC = () => {
    const router = useRouter()
    const { user, loading: authLoading, isAuthenticated } = useAuth()
    const [currentStep, setCurrentStep] = useState<number>(PROFILE_SETUP_STEPS.NAME)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (authLoading || isAuthenticated) return

        Alert.alert(
            'Cần đăng nhập',
            'Vui lòng xác thực email hoặc đăng nhập trước khi thiết lập hồ sơ.',
            [
                {
                    text: 'Đăng nhập',
                    onPress: () => router.replace(ERouteTable.SIGIN_IN),
                },
            ],
        )
    }, [authLoading, isAuthenticated, router])

    const [formData, setFormData] = useState<ProfileSetupData>({
        full_name: '',
        gender: null,
        goal: null,
        age: 23,
        height_cm: 172.5,
        current_weight_kg: 70.2,
        activity_level: null,
        workout_days: [1, 2, 3, 4, 5],
        workout_period: 'evening',
        workout_start_time: '19:00',
        workout_duration_min: 45,
        health_condition: 'none',
        health_notes: '',
    })

    const handleNext = () => {
        if (currentStep < PROFILE_SETUP_TOTAL_STEPS) {
            setCurrentStep(currentStep + 1)
            return
        }

        handleComplete()
    }

    const handleBack = () => {
        if (currentStep > PROFILE_SETUP_STEPS.NAME) {
            setCurrentStep(currentStep - 1)
            return
        }
        router.back()
    }

    const handleComplete = async () => {
        setLoading(true)
        try {
            let currentUser = user

            if (!currentUser) {
                const session = await AuthService.getSession()
                currentUser = session?.user ?? null
            }

            if (!currentUser) {
                Alert.alert(
                    'Chưa đăng nhập',
                    'Phiên đăng nhập đã hết hạn hoặc email chưa được xác thực. Vui lòng xác thực email hoặc đăng nhập lại.',
                    [
                        {
                            text: 'Đăng nhập',
                            onPress: () => router.replace(ERouteTable.SIGIN_IN),
                        },
                    ],
                )
                return
            }

            const result = await updateUserProfile(currentUser.id, formData)

            if (result.success) {
                Alert.alert('Thành công!', 'Kế hoạch của bạn đã sẵn sàng.', [
                    {
                        text: 'OK',
                        onPress: () => router.replace(ERouteTable.HOME),
                    },
                ])
            } else {
                Alert.alert('Lỗi', result.error || 'Không thể lưu thông tin. Vui lòng thử lại.')
            }
        } catch (error) {
            console.error('Error completing profile setup:', error)
            Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case PROFILE_SETUP_STEPS.NAME:
                return (
                    <NameStep
                        value={formData.full_name}
                        onChange={(value) => setFormData({ ...formData, full_name: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.GENDER:
                return (
                    <GenderStep
                        value={formData.gender}
                        onChange={(value) => setFormData({ ...formData, gender: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.GOAL:
                return (
                    <GoalStep
                        value={formData.goal}
                        onChange={(value) => setFormData({ ...formData, goal: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.AGE:
                return (
                    <AgeStep
                        value={formData.age}
                        onChange={(value) => setFormData({ ...formData, age: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.HEIGHT:
                return (
                    <HeightStep
                        value={formData.height_cm}
                        onChange={(value) => setFormData({ ...formData, height_cm: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.WEIGHT:
                return (
                    <WeightStep
                        value={formData.current_weight_kg}
                        onChange={(value) => setFormData({ ...formData, current_weight_kg: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.ACTIVITY:
                return (
                    <ActivityLevelStep
                        value={formData.activity_level}
                        onChange={(value) => setFormData({ ...formData, activity_level: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.SCHEDULE:
                return (
                    <WorkoutScheduleStep
                        workoutDays={formData.workout_days}
                        workoutPeriod={formData.workout_period}
                        workoutStartTime={formData.workout_start_time}
                        workoutDurationMin={formData.workout_duration_min}
                        onChangeDays={(days: WeekdayValue[]) =>
                            setFormData({ ...formData, workout_days: days })
                        }
                        onChangePeriod={(period: WorkoutPeriodType) =>
                            setFormData({ ...formData, workout_period: period })
                        }
                        onChangeStartTime={(time: string) =>
                            setFormData({ ...formData, workout_start_time: time })
                        }
                        onChangeDuration={(minutes: number) =>
                            setFormData({ ...formData, workout_duration_min: minutes })
                        }
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.HEALTH:
                return (
                    <HealthConditionStep
                        value={formData.health_condition}
                        notes={formData.health_notes}
                        onChange={(value: HealthConditionType) =>
                            setFormData({
                                ...formData,
                                health_condition: value,
                                health_notes: value === 'other' ? formData.health_notes : '',
                            })
                        }
                        onChangeNotes={(notes: string) =>
                            setFormData({ ...formData, health_notes: notes })
                        }
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case PROFILE_SETUP_STEPS.PLAN_SUMMARY:
                return (
                    <PlanSummaryStep
                        formData={formData}
                        onNext={handleNext}
                        onBack={handleBack}
                        loading={loading}
                    />
                )
            default:
                return null
        }
    }

    return <>{renderStep()}</>
}

export default ProfileSetupFlow
