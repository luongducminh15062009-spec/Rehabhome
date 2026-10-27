import React from 'react'
import { Text, View } from 'react-native'
import UserSubScreenLayout from '@/modules/user-profile/components/UserSubScreenLayout'

const SupportScreen = () => {
  return (
    <UserSubScreenLayout title="Liên hệ hỗ trợ">
      <View>
        <Text className="text-base text-[#303842] leading-6 mb-3">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn để hành trình làm nóng trở nên dễ dàng và hiệu quả hơn.
        </Text>
        <Text className="text-base text-[#303842] leading-6">
          {'  •  Email hỗ trợ: example@gmail.com\n  •  Điện thoại (giờ hành chính): +84 9xx xxx xxx'}
        </Text>
      </View>
    </UserSubScreenLayout>
  )
}

export default SupportScreen
