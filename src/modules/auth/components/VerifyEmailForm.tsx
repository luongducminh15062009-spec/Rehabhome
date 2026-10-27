import { Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import AppButton from '@/components/common/AppButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import OtpInput from '@/components/form/OtpInput'
import { ArrowLeft2 } from 'iconsax-react-native'
import { AuthService } from '@/services/auth.service'

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const maskedLocal = local.length <= 2 ? `${local[0]}***` : `${local[0]}${'*'.repeat(Math.min(local.length - 2, 8))}${local[local.length - 1]}`
  const [domainName, tld] = domain.split('.')
  const maskedDomain = domainName ? `${domainName[0]}${'*'.repeat(Math.min(domainName.length - 1, 6))}` : domain
  return `${maskedLocal}@${maskedDomain}${tld ? `.${tld}` : ''}`
}

const VerifyEmailForm = () => {
  const router = useRouter()
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>()
  const email = typeof emailParam === 'string' ? emailParam.trim() : ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const _handleVerify = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy email. Vui lòng đăng ký lại.')
      router.replace(ERouteTable.SIGIN_UP)
      return
    }

    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số mã xác nhận')
      return
    }

    setLoading(true)
    try {
      const { session } = await AuthService.verifySignUpOtp(email, otp)
      if (session) {
        router.replace(ERouteTable.PROFILE_SETUP)
      } else {
        Alert.alert('Lỗi', 'Xác thực thất bại. Vui lòng thử lại.')
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  const _onResendCode = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy email. Vui lòng đăng ký lại.')
      return
    }

    setResending(true)
    try {
      await AuthService.resendSignUpOtp(email)
      Alert.alert('Thành công', 'Đã gửi lại mã xác nhận. Vui lòng kiểm tra email.')
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể gửi lại mã. Vui lòng thử lại.')
    } finally {
      setResending(false)
    }
  }

  const _onSignIn = () => {
    router.replace(ERouteTable.SIGIN_IN)
  }

  return (
    <View className="px-8">
      <Text className="text-3xl text-center text-primary mb-10">Kiểm tra email</Text>
      <View className="p-6">
        <Text className="text-sm text-center text-disabled">
          Chúng tôi đã gửi cho bạn một mã xác nhận.{'\n'}
          Vui lòng kiểm tra hộp thư đến của bạn tại{'\n'}
          {email ? maskEmail(email) : 'email đã đăng ký'}.
        </Text>
      </View>
      <View className="flex-col gap-4">
        <View>
          <OtpInput length={6} onChange={setOtp} />
        </View>

        <AppButton
          title={loading ? 'Đang xác thực...' : 'Xác thực'}
          onPress={_handleVerify}
          disabled={loading || resending}
        />
        <View className="items-center gap-4">
          <Text className="text-primary text-sm">Gửi lại mã. Vui lòng kiểm tra email của bạn.</Text>
          <TouchableOpacity onPress={_onResendCode} disabled={loading || resending}>
            <Text className="text-secondary">{resending ? 'Đang gửi...' : 'Gửi lại mã'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_onSignIn} className="flex-row gap-1 items-center mt-8">
            <ArrowLeft2 size="20" color="#212B36" />
            <Text className="text-primary">Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default VerifyEmailForm
