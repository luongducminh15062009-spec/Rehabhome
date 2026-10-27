import { Text, TouchableOpacity, View, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import GoogleButton from '@/components/common/GoogleButton'
import AppInput from '@/components/form/AppInput'
import AppButton from '@/components/common/AppButton'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { AuthService } from '@/services/auth.service'
import { images } from '@/constants'

type Props = {}

const SignUpForm = ({ }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const _handleSignUp = async () => {
    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ')
      return
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      const data = await AuthService.signUp(email, password, name)

      if (data) {
        if (data.session) {
          router.replace(ERouteTable.PROFILE_SETUP)
          return
        }

        Alert.alert(
          'Đăng ký thành công',
          'Chúng tôi đã gửi mã xác nhận đến email của bạn. Vui lòng xác thực trước khi thiết lập hồ sơ.',
          [
            {
              text: 'Xác thực email',
              onPress: () => {
                router.replace({
                  pathname: ERouteTable.VERIFY_EMAIL,
                  params: { email: email.trim() },
                })
              },
            },
          ],
        )
      }
    } catch (error: any) {

      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.'

      // Check error message
      if (error?.message) {
        const msg = error.message.toLowerCase()

        if (msg.includes('already registered') || msg.includes('already been registered')) {
          errorMessage = 'Email này đã được đăng ký'
        } else if (msg.includes('password should be') || msg.includes('password is too weak')) {
          errorMessage = 'Mật khẩu không đủ mạnh. Vui lòng dùng mật khẩu mạnh hơn.'
        } else if (msg.includes('invalid email') || msg.includes('email is invalid') || msg.includes('email address') && msg.includes('invalid')) {
          errorMessage = 'Email không hợp lệ. Vui lòng sử dụng email thật (Gmail, Outlook, v.v.)'
        } else if (msg.includes('network') || msg.includes('fetch')) {
          errorMessage = 'Không thể kết nối. Vui lòng kiểm tra internet.'
        } else if (msg.includes('user already registered')) {
          errorMessage = 'Email này đã được đăng ký'
        } else {
          // Show actual error message for debugging
          errorMessage = `Lỗi: ${error.message}`
        }
      }

      // Check error code
      if (error?.code === 'email_address_invalid') {
        errorMessage = 'Email không hợp lệ. Vui lòng sử dụng email thật (Gmail, Outlook, Yahoo, v.v.)'
      }

      Alert.alert('Lỗi đăng ký', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const _onSignInScreen = () => {
    router.push(ERouteTable.SIGIN_IN)
  }

  return (
    <View className="px-8">
      <View className="justify-center items-center mb-4">
        <Image source={images.logoApp} className="w-40 h-40" resizeMode="contain" />
      </View>
      <Text className="text-3xl text-center text-primary mb-10">Tạo tài khoản</Text>
      <View className="flex-col gap-4">
        <View>
          <AppInput
            className="h-14 border border-[#919EAB52] pl-2 rounded-xl bg-white"
            label="Tên"
            placeholder="Tên của bạn?"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <AppInput
            className="h-14 border border-[#919EAB52] pl-2 rounded-xl bg-white"
            label="Email"
            placeholder="user@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <AppInput
            className="h-14 border border-[#919EAB52] pl-2 rounded-xl bg-white"
            label="Password"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <AppButton
          title={loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
          onPress={_handleSignUp}
          disabled={loading}
        />
        <View className="flex-row gap-2 justify-center">
          <Text className="text-secondary text-sm">Bạn có một tài khoản?</Text>
          <TouchableOpacity onPress={_onSignInScreen} disabled={loading}>
            <Text className="underline text-primary">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default SignUpForm
