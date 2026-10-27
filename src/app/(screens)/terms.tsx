import React from 'react'
import { Text, View } from 'react-native'
import UserSubScreenLayout from '@/modules/user-profile/components/UserSubScreenLayout'

const sections = [
  {
    title: '1. Phạm vi dịch vụ',
    content: 'RehabHome cung cấp nội dung tập luyện, theo dõi tiến độ, cảm xúc và các gợi ý phục hồi nhằm hỗ trợ sức khỏe chủ động và duy trì lối sống lành mạnh.\n\nCác tính năng có thể được cập nhật, thay đổi hoặc ngừng cung cấp trong quá trình vận hành.',
  },
  {
    title: '2. Điều kiện sử dụng',
    content:
      'Bạn cam kết:\n  •  Cung cấp thông tin chính xác.\n  •  Bảo mật tài khoản và mật khẩu.\n  •  Không sử dụng RehabHome cho mục đích trái pháp luật.\n  •  Không xâm nhập, sao chép hoặc làm gián đoạn hệ thống.\n  •  Không đăng nội dung không phù hợp, spam hoặc gây hại.\n  •  Chịu trách nhiệm đối với hoạt động và nội dung được thực hiện bằng tài khoản của mình.\n\nNgười dùng dưới tuổi vị thành niên cần có sự đồng ý và giám sát của cha mẹ hoặc người giám hộ.',
  },
  {
    title: '3. Lưu ý về sức khỏe',
    content:
      'Nội dung của RehabHome chỉ mang tính chất tham khảo, không thay thế tư vấn, chẩn đoán hoặc điều trị của bác sĩ và chuyên gia y tế.\n\nBạn cần tự đánh giá thể trạng, lựa chọn bài tập phù hợp và dừng tập nếu cảm thấy đau, chóng mặt hoặc có dấu hiệu bất thường.',
  },
  {
    title: '4. Kết quả và thông tin ước tính',
    content:
      'Các chỉ số sức khỏe, lượng calo tiêu hao, thời gian phục hồi và tiến độ luyện tập chỉ là giá trị tham khảo. Kết quả thực tế có thể khác nhau tùy cơ địa, thói quen và mức độ tuân thủ của mỗi người.',
  },
  {
    title: '5. Dữ liệu cá nhân',
    content:
      'RehabHome có thể xử lý thông tin tài khoản, thể trạng, lịch sử luyện tập, cảm xúc và dữ liệu bạn cung cấp để vận hành dịch vụ.\n\nViệc xử lý dữ liệu được thực hiện theo Chính sách bảo mật của RehabHome.',
  },
  {
    title: '6. Nội dung do người dùng tạo',
    content:
      'Khi bạn tạo bài tập công khai, nội dung có thể được người dùng khác xem.\n\nNgười dùng có thể Báo cáo bài tập hoặc Chặn tác giả. RehabHome có thể ẩn hoặc gỡ nội dung vi phạm.\n\nBạn giữ quyền đối với nội dung mình tạo, đồng thời cấp cho RehabHome quyền hiển thị nội dung đó trong ứng dụng.',
  },
  {
    title: '7. Quyền sở hữu nội dung RehabHome',
    content:
      'Giao diện, hình ảnh, video, văn bản, chương trình tập luyện, biểu tượng và các nội dung của RehabHome thuộc quyền sở hữu của chúng tôi hoặc bên cấp phép.\n\nBạn chỉ được sử dụng nội dung cho mục đích cá nhân, không được sao chép, chỉnh sửa hoặc phân phối khi chưa có sự cho phép.',
  },
  {
    title: '8. Dịch vụ bên thứ ba',
    content:
      'RehabHome có thể kết nối với thiết bị đeo hoặc dịch vụ hạ tầng bên thứ ba. Việc sử dụng các dịch vụ này tuân theo điều khoản và chính sách riêng của từng bên.',
  },
  {
    title: '9. Tài khoản và chấm dứt sử dụng',
    content:
      'Bạn có thể ngừng sử dụng hoặc xóa tài khoản bất kỳ lúc nào trong ứng dụng (Cá nhân → Quyền riêng tư → Xóa tài khoản). RehabHome có quyền tạm khóa tài khoản vi phạm điều khoản hoặc gây ảnh hưởng đến hệ thống và người dùng khác.',
  },
  {
    title: '10. Giới hạn trách nhiệm',
    content:
      'Trong phạm vi pháp luật cho phép, RehabHome không chịu trách nhiệm đối với thiệt hại phát sinh do người dùng tự ý luyện tập, sử dụng sai hướng dẫn, nội dung do người dùng khác đăng tải, gián đoạn dịch vụ hoặc sự cố từ bên thứ ba.',
  },
  {
    title: '11. Thay đổi điều khoản',
    content:
      'RehabHome có thể cập nhật điều khoản này khi cần thiết. Việc tiếp tục sử dụng ứng dụng sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận nội dung mới.',
  },
]

const TermsScreen = () => {
  return (
    <UserSubScreenLayout title="Điều khoản & Điều kiện">
      <View>
        <Text className="text-sm text-[#303842] leading-5 mb-5">
          Bằng việc truy cập hoặc sử dụng RehabHome, bạn xác nhận đã đọc, hiểu và đồng ý với các điều khoản dưới đây.
        </Text>
        {sections.map((section) => (
          <View key={section.title} className="mb-5">
            <Text className="text-sm font-bold text-[#303842] mb-2">{section.title}</Text>
            <Text className="text-sm text-[#303842] leading-5">{section.content}</Text>
          </View>
        ))}
      </View>
    </UserSubScreenLayout>
  )
}

export default TermsScreen
