import React from 'react'
import { Text, View } from 'react-native'
import UserSubScreenLayout from '@/modules/user-profile/components/UserSubScreenLayout'

const AboutScreen = () => {
  return (
    <UserSubScreenLayout title="Giới thiệu">
      <View>
        <Text className="text-base text-[#303842] leading-6 mb-6">
          RehabHome là ứng dụng đồng hành cùng bạn trong hành trình xây dựng một cơ thể khỏe mạnh và
          tinh thần cân bằng.
        </Text>
        <Text className="text-base text-[#303842] leading-6 mb-6">
          Dựa trên mục tiêu, thể trạng và thói quen cá nhân, RehabHome gợi ý các kế hoạch tập luyện
          phù hợp với nhiều cấp độ. Bạn có thể chọn bài thở, khởi động, kéo giãn, tập trên ghế,
          vận động toàn thân hoặc sức mạnh nhẹ theo thời gian và cường độ mong muốn.
        </Text>
        <Text className="text-base text-[#303842] leading-6 mb-5">
          Không chỉ tập trung vào luyện tập, RehabHome còn giúp bạn theo dõi tiến độ, ghi nhận cảm xúc
          và nhận các gợi ý phục hồi phù hợp. Mỗi ngày, ứng dụng sẽ hỗ trợ bạn duy trì động lực,
          điều chỉnh nhịp độ và hình thành thói quen vận động bền vững.
        </Text>
        <Text className="text-lg font-bold text-[#303842] mb-3">RehabHome giúp bạn</Text>
        <Text className="text-base text-[#303842] leading-6 mb-5">
          {
            '  •  Cá nhân hóa kế hoạch tập luyện theo mục tiêu.\n  •  Khám phá bài tập phù hợp với thể trạng.\n  •  Theo dõi số buổi tập và tiến độ hàng tuần.\n  •  Ghi nhận cảm xúc trước và sau khi tập.\n  •  Nhận gợi ý nghỉ ngơi và phục hồi cơ thể.\n  •  Duy trì động lực bằng những mục tiêu mỗi ngày.'
          }
        </Text>
        <Text className="text-lg font-bold text-[#303842] mb-3">Lưu ý sức khỏe</Text>
        <Text className="text-base text-[#303842] leading-6 mb-5">
          RehabHome chỉ mang tính hỗ trợ lối sống và theo dõi thói quen. Nội dung trong ứng dụng không
          phải tư vấn y tế, không dùng để chẩn đoán, điều trị hay thay thế ý kiến của bác sĩ hoặc
          chuyên gia sức khỏe. Nếu bạn có bệnh lý, chấn thương hoặc đang mang thai, hãy tham khảo
          chuyên gia trước khi tập luyện. Dừng ngay nếu cảm thấy đau, chóng mặt hoặc khó chịu bất
          thường.
        </Text>
        <Text className="text-lg font-bold text-[#303842] mb-3">Thông điệp</Text>
        <Text className="text-base text-[#303842] leading-6">
          Bạn không cần phải hoàn hảo để bắt đầu. Chỉ cần tiến thêm một bước mỗi ngày.
        </Text>
      </View>
    </UserSubScreenLayout>
  )
}

export default AboutScreen
