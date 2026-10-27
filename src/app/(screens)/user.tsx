import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import {
  Notification,
  Notification as NotificationIcon,
  User,
  Key,
  InfoCircle,
  MessageQuestion,
  ShieldTick,
  DocumentText,
  Logout,
  Trash,
} from 'iconsax-react-native'
import ProfileHeader from '@/modules/user-profile/components/ProfileHeader'
import SettingsMenuItem from '@/modules/user-profile/components/SettingsMenuItem'
import SettingsSection from '@/modules/user-profile/components/SettingsSection'
import { MenuItem } from '@/modules/user-profile/types/user-profile.types'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/context/auth-provider'
import { useNotifications } from '@/context/notification-provider'
import { AuthService } from '@/services/auth.service'
import { notificationService } from '@/services/notifications.service'
import IconHeal from '~/assets/icons/IconHeal'

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0'

const UserScreen = () => {
  const { user: authUser } = useAuth()
  const { profile, isLoading } = useProfile()
  const { unreadCount } = useNotifications()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const user = {
    id: authUser?.id || '',
    name: profile?.full_name || authUser?.email?.split('@')[0] || 'User',
    email: profile?.email || authUser?.email || '',
    avatar:
      profile?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=34A853&color=fff`,
  }

  const loadNotificationSettings = useCallback(async () => {
    try {
      const settings = await notificationService.getSettings()
      if (settings) {
        const enabled =
          settings.goal_notifications_enabled ||
          settings.breakfast_enabled ||
          settings.lunch_enabled ||
          settings.dinner_enabled ||
          settings.water_enabled ||
          settings.exercise_enabled ||
          settings.sleep_enabled
        setNotificationsEnabled(enabled)
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
  }, [])

  useEffect(() => {
    loadNotificationSettings()
  }, [loadNotificationSettings])

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value)
    try {
      await notificationService.updateSettings({
        breakfast_enabled: value,
        lunch_enabled: value,
        dinner_enabled: value,
        water_enabled: value,
        exercise_enabled: value,
        sleep_enabled: value,
        goal_notifications_enabled: value,
      })
    } catch (error) {
      setNotificationsEnabled(!value)
      Alert.alert('Lỗi', 'Không thể cập nhật cài đặt thông báo')
      console.error('Error updating notification settings:', error)
    }
  }

  const handleEditProfile = () => {
    router.push(ERouteTable.EDIT_PROFILE)
  }

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await AuthService.signOut()
            router.replace(ERouteTable.SIGIN_IN)
          } catch (error) {
            console.error('Error logging out:', error)
            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.')
          }
        },
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa tài khoản',
      'Hành động này không thể hoàn tác. Toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tài khoản',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Xác nhận lần nữa', 'Bạn chắc chắn muốn xóa tài khoản này?', [
              { text: 'Hủy', style: 'cancel' },
              {
                text: 'Xóa vĩnh viễn',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await AuthService.deleteAccount()
                    router.replace(ERouteTable.SIGIN_IN)
                  } catch (error: any) {
                    console.error('Error deleting account:', error)
                    Alert.alert(
                      'Lỗi',
                      error?.message ||
                        'Không thể xóa tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
                    )
                  }
                },
              },
            ])
          },
        },
      ],
    )
  }

  const settingsItems: MenuItem[] = [
    // {
    //   icon: User,
    //   label: 'Cập nhật chỉ số trao đổi chất (BMR)',
    //   route: ERouteTable.BMR_TRACKING,
    //   onPress: () => router.push(ERouteTable.BMR_TRACKING),
    // },
    {
      icon: Key,
      label: 'Thay đổi mật khẩu',
      route: ERouteTable.CHANGE_PASSWORD,
      onPress: () => router.push(ERouteTable.CHANGE_PASSWORD),
    },
    {
      icon: NotificationIcon,
      label: 'Thông báo',
      toggle: {
        value: notificationsEnabled,
        onValueChange: handleNotificationToggle,
      },
    },
  ]

  const privacyItems: MenuItem[] = [
    {
      icon: InfoCircle,
      label: 'Giới thiệu',
      route: ERouteTable.ABOUT,
      onPress: () => router.push(ERouteTable.ABOUT),
    },
    {
      icon: MessageQuestion,
      label: 'Liên hệ hỗ trợ',
      route: ERouteTable.SUPPORT,
      onPress: () => router.push(ERouteTable.SUPPORT),
    },
    {
      icon: ShieldTick,
      label: 'Chính sách bảo mật',
      route: ERouteTable.PRIVACY_POLICY,
      onPress: () => router.push(ERouteTable.PRIVACY_POLICY),
    },
    {
      icon: DocumentText,
      label: 'Điều khoản & Điều kiện',
      route: ERouteTable.TERMS,
      onPress: () => router.push(ERouteTable.TERMS),
    },
    {
      icon: Logout,
      label: 'Đăng xuất',
      variant: 'danger',
      showChevron: false,
      onPress: handleLogout,
    },
    {
      icon: Trash,
      label: 'Xóa tài khoản',
      variant: 'danger',
      showChevron: false,
      onPress: handleDeleteAccount,
    },
  ]

  return (
    <ImageBackground source={images.bgProfile} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row justify-between items-center px-5 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-11 h-11 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(ERouteTable.NOTIFICATIONS)}
            activeOpacity={0.7}
            className="relative w-11 h-11 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Notification size={22} color="#1A1A1A" variant="Linear" />
            {unreadCount > 0 && (
              <View className="absolute -top-0.5 -right-0.5 bg-[#29B6F6] rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                <Text className="text-white text-[10px] font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#34A853" />
            </View>
          ) : (
            <ProfileHeader user={user} onEditPress={handleEditProfile} />
          )}

          <TouchableOpacity
            onPress={() => router.push(ERouteTable.MY_WORKOUTS)}
            activeOpacity={0.85}
            className="bg-white rounded-3xl mx-4 mb-4 px-5 py-4 flex-row items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="w-7 items-center justify-center">
              <IconHeal />
            </View>
            <Text className="text-base text-[#1A1A1A] ml-3.5">Bài tập của tôi</Text>
          </TouchableOpacity>

          <SettingsSection title="Cài đặt chung">
            {settingsItems.map((item, index) => (
              <SettingsMenuItem
                key={item.label}
                item={item}
                isLast={index === settingsItems.length - 1}
              />
            ))}
          </SettingsSection>

          <SettingsSection title="Quyền riêng tư">
            {privacyItems.map((item, index) => (
              <SettingsMenuItem
                key={item.label}
                item={item}
                isLast={index === privacyItems.length - 1}
              />
            ))}
          </SettingsSection>

          <Text className="text-center text-sm text-[#9CA3AF] mb-10 mt-2">
            Phiên bản v{APP_VERSION}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default UserScreen
