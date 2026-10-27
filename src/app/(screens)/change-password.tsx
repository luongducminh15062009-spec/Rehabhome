import React, { useState } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Lock } from 'iconsax-react-native'
import UserSubScreenLayout from '@/modules/user-profile/components/UserSubScreenLayout'
import AppInput from '@/components/form/AppInput'
import { AuthService } from '@/services/auth.service'

const ChangePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)
    try {
      await AuthService.updatePassword(newPassword)
      Alert.alert('Thành công', 'Đã cập nhật mật khẩu mới')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Không thể cập nhật mật khẩu'

      let errorMessage = 'Không thể cập nhật mật khẩu. Vui lòng thử lại.'
      if (message.includes('New password should be different')) {
        errorMessage = 'Mật khẩu mới phải khác mật khẩu hiện tại'
      } else if (message.includes('Password is too weak')) {
        errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.'
      }

      Alert.alert('Lỗi', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserSubScreenLayout title="Thay đổi mật khẩu">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          className="bg-white rounded-3xl py-6"
        >
          <View className="items-center mb-6">
            <Text className="text-sm text-[#7D7D7D] mt-3 leading-5 px-2">
              Đặt mật khẩu mạnh để bảo vệ tài khoản
              của bạn an toàn hơn.
            </Text>
          </View>

          <AppInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            autoCapitalize="none"
          />

          <AppInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="bg-[#34A853] rounded-2xl py-4 items-center mt-2"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">Cập nhật mật khẩu</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </UserSubScreenLayout>
  )
}

export default ChangePasswordScreen
