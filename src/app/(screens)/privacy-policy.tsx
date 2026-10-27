import React from 'react'
import { Text, View } from 'react-native'
import UserSubScreenLayout from '@/modules/user-profile/components/UserSubScreenLayout'

const sections = [
  {
    title: '1. Thông tin được thu thập',
    content:
      'RehabHome có thể thu thập:\n  •  Thông tin tài khoản như tên, email và ảnh đại diện.\n  •  Thông tin cá nhân như tuổi, giới tính, chiều cao và cân nặng.\n  •  Mục tiêu, lịch sử và tiến độ luyện tập.\n  •  Dữ liệu cảm xúc, đánh giá sức khỏe và hoạt động trong ứng dụng.\n  •  Nội dung do bạn tạo (bài tập, mô tả, hình ảnh).\n  •  Báo cáo nội dung / chặn người dùng (để kiểm duyệt).\n  •  Thông tin thiết bị, phiên bản ứng dụng và dữ liệu sử dụng.\n\nDữ liệu có thể được tự động hoặc do bạn chủ động nhập.',
  },
  {
    title: '2. Mục đích sử dụng',
    content:
      'Dữ liệu được sử dụng để:\n  •  Tạo và duy trì tài khoản.\n  •  Cung cấp kế hoạch và bài tập phù hợp.\n  •  Theo dõi tiến độ luyện tập.\n  •  Cá nhân hóa nội dung và gợi ý phục hồi.\n  •  Hiển thị nội dung công khai do người dùng chia sẻ.\n  •  Xử lý báo cáo, ẩn nội dung và chặn tác giả khi cần.\n  •  Cải thiện chất lượng, hiệu suất và độ an toàn của ứng dụng.\n  •  Hỗ trợ người dùng và gửi thông báo cần thiết.\n  •  Tuân thủ các yêu cầu pháp lý.',
  },
  {
    title: '3. Nội dung do người dùng tạo (UGC)',
    content:
      'Bạn có thể tạo và chia sẻ bài tập ở chế độ công khai hoặc riêng tư.\n\n  •  Nội dung công khai có thể được người dùng khác xem trên Khám phá.\n  •  Bạn chịu trách nhiệm về nội dung mình đăng tải.\n  •  Người dùng có thể Báo cáo bài tập hoặc Chặn tác giả ngay trong ứng dụng.\n  •  RehabHome có thể ẩn hoặc gỡ nội dung vi phạm khi nhận báo cáo hoặc theo yêu cầu pháp lý.\n\nKhông đăng nội dung bất hợp pháp, khiêu dâm, bạo lực, lừa đảo hoặc gây hại.',
  },
  {
    title: '4. Quyền truy cập thiết bị',
    content:
      'Một số tính năng có thể yêu cầu quyền truy cập vào thư viện ảnh hoặc máy ảnh (ví dụ ảnh đại diện, hình thu nhỏ bài tập).\n\nRehabHome chỉ yêu cầu quyền khi bạn sử dụng tính năng liên quan. Bạn có thể từ chối hoặc thu hồi quyền trong cài đặt thiết bị.',
  },
  {
    title: '5. Chia sẻ dữ liệu',
    content:
      'RehabHome không bán dữ liệu cá nhân của bạn. Thông tin chỉ có thể được chia sẻ với nhà cung cấp dịch vụ lưu trữ, phân tích hoặc thông báo; cơ quan có thẩm quyền khi pháp luật yêu cầu; hoặc bên thứ ba khi có sự đồng ý của bạn.\n\nNội dung công khai bạn đăng có thể được người dùng khác trong ứng dụng nhìn thấy.',
  },
  {
    title: '6. Lưu trữ và bảo vệ dữ liệu',
    content:
      'RehabHome áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ tài khoản và dữ liệu của bạn.\n\nDữ liệu được lưu trong thời gian cần thiết để cung cấp dịch vụ hoặc theo yêu cầu pháp luật. Không hệ thống nào có thể đảm bảo an toàn tuyệt đối.',
  },
  {
    title: '7. Quyền của người dùng & xóa tài khoản',
    content:
      'Bạn có thể:\n  •  Xem và chỉnh sửa thông tin cá nhân.\n  •  Thay đổi quyền truy cập trên thiết bị.\n  •  Rút lại sự đồng ý đối với xử lý dữ liệu tùy chọn.\n  •  Yêu cầu cung cấp, chỉnh sửa hoặc xóa dữ liệu.\n  •  Tắt thông báo.\n  •  Xóa tài khoản ngay trong ứng dụng: Cá nhân → Quyền riêng tư → Xóa tài khoản.\n\nKhi xóa tài khoản, dữ liệu hồ sơ và dữ liệu liên quan sẽ được xử lý xóa theo quy trình của hệ thống. Một số bản ghi có thể được giữ tạm thời nếu pháp luật yêu cầu.',
  },
  {
    title: '8. Dữ liệu của người chưa thành niên',
    content:
      'Người chưa đủ tuổi sử dụng theo quy định pháp luật cần có sự đồng ý của cha mẹ hoặc người giám hộ. Nếu phát hiện dữ liệu được thu thập không phù hợp, RehabHome sẽ thực hiện biện pháp xóa hoặc xử lý cần thiết.',
  },
  {
    title: '9. Dịch vụ bên thứ ba',
    content:
      'RehabHome có thể sử dụng dịch vụ lưu trữ đám mây và hạ tầng hỗ trợ vận hành ứng dụng. Chính sách bảo mật của các bên này được áp dụng độc lập; bạn nên xem xét trước khi sử dụng.',
  },
  {
    title: '10. Thay đổi chính sách',
    content:
      'RehabHome có thể cập nhật chính sách bảo mật khi cần thiết. Thay đổi quan trọng sẽ được thông báo trong ứng dụng hoặc qua email.',
  },
]

const PrivacyPolicyScreen = () => {
  return (
    <UserSubScreenLayout title="Chính sách bảo mật">
      <View>
        <Text className="text-sm text-[#303842] leading-5 mb-5">
          RehabHome tôn trọng quyền riêng tư và cam kết bảo vệ dữ liệu cá nhân của người dùng. Chính
          sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin khi bạn
          sử dụng ứng dụng.
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

export default PrivacyPolicyScreen
