# RehabHome AI

Ứng dụng đồng hành xây dựng cơ thể khỏe mạnh và tinh thần cân bằng: kế hoạch tập luyện, theo dõi bữa ăn / nước / giấc ngủ, ghi cảm xúc, bài viết sức khỏe và thông báo nhắc nhở.

---

## Tính năng chính

| Tab / Luồng | Nội dung |
|-------------|----------|
| **Trang chủ** | Tổng quan calo, macro, nước, ngủ, BMI/TDEE, mood tracker, kế hoạch hôm nay |
| **Kế hoạch tập** | Mục tiêu, lịch tuần, tiến độ, thư viện bài tập, thêm / thay thế / hoàn thành buổi tập |
| **Bữa ăn** | Log bữa sáng / trưa / tối / ăn vặt theo ngày |
| **Bài viết** | Dinh dưỡng, lối sống, mẹo nấu ăn |
| **Cá nhân** | Profile, BMR, thông báo, đổi mật khẩu, giới thiệu / hỗ trợ / điều khoản / bảo mật |
| **Onboarding** | Đăng ký → thiết lập profile (giới tính, tuổi, chiều cao, cân nặng, mục tiêu, lịch tập, sức khỏe) |

---

## Công nghệ

| Thành phần | Stack |
|------------|--------|
| App | React Native, Expo SDK ~53, Expo Router, NativeWind (Tailwind) |
| State / data | React Query, Zustand, React Hook Form, Zod |
| Backend | Supabase (Auth, PostgreSQL, RLS, Realtime, Storage) |
| UI | iconsax-react-native, react-native-svg, expo-linear-gradient |

---

## Yêu cầu môi trường

| Công nghệ | Khuyến nghị |
|-----------|-------------|
| Node.js | 18.x hoặc 20.x LTS |
| npm | 9.x+ |
| Git | Bất kỳ |
| Supabase | Tài khoản + project mới |
| iOS | Xcode (Mac) khi `npm run ios` |
| Android | Android Studio + SDK khi `npm run android` |
| Expo Go | Tùy chọn, quét QR từ `npm start` |

---

## Cài đặt nhanh

```bash
git clone <url-repo> fit-mind
cd fit-mind
npm install
```

### Biến môi trường

Sao chép `.env.example` thành `.env` (nếu có) hoặc tạo `.env` ở thư mục gốc:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Lấy URL và **anon key** tại: Supabase Dashboard → **Project Settings** → **API**.

> Hiện `src/lib/supabase.ts` có thể đang hardcode URL/key. Nên chuyển sang `process.env.EXPO_PUBLIC_*` trước khi đổi project.

**Không** commit `.env` hoặc `service_role` key lên Git.

---

## Setup Supabase

Tạo project trên [supabase.com](https://supabase.com), mở **SQL Editor**, chạy các file trong `supabase/` **theo thứ tự** dưới đây.

### Schema & migration (bắt buộc)

| # | File | Mô tả |
|---|------|--------|
| 1 | `schema.sql` **hoặc** `setup_steps.sql` | Chọn **một**. Schema gốc: `profiles`, weight/water/meal, articles + RLS + trigger tạo profile. `setup_steps.sql` dùng khi muốn **reset** DB (DROP rồi tạo lại). |
| 2 | `add_profile_workout_health_fields.sql` | Cột lịch tập / mục tiêu chi tiết / tình trạng sức khỏe trên `profiles`. |
| 3 | `add_exercise_sleep_tables.sql` | `exercise_logs`, `sleep_logs`. |
| 4 | `add_meal_type_column.sql` | Cột `meal_type` (breakfast/lunch/snack/dinner). |
| 5 | `mood_logs_schema.sql` | Bảng ghi cảm xúc theo ngày. |
| 6 | `workout_plan_schema.sql` | Kế hoạch tuần (`workout_plan_items`) — đồng bộ Home & tab Kế hoạch tập. |
| 7 | `notifications_schema.sql` | `notifications`, `notification_settings`, trigger chào mừng / mục tiêu. |
| 8 | `add_notification_triggers.sql` | Cập nhật logic trigger thông báo. Sau đó có thể: `DROP TRIGGER IF EXISTS create_notification_settings_trigger ON public.profiles;` nếu trùng. |
| 9 | `enable_realtime_notifications.sql` | Bật Realtime cho `notifications`. |
| 10 | `fix_meal_logs_policy.sql` | Policy DELETE cho `meal_logs`. |
| 11 | `storage_policies.sql` | Policy Storage avatar (bucket `profiles`). |
| 12 | `grant_table_permissions.sql` | (Nếu cần) cấp quyền bảng cho role `authenticated`. |
| 13 | `create_profiles_storage_bucket.sql` | (Tùy chọn) tạo bucket bằng SQL; hoặc tạo tay trên Dashboard. |

> Nếu gặp lỗi `42501: must be owner of table users` khi chạy trigger trên `auth.users`: bỏ qua dòng trigger trong `schema.sql` và tạo profile trong app sau `signUp` (xem comment trong file SQL).

### Seed dữ liệu (khuyến nghị)

| File | Mô tả |
|------|--------|
| `meals_data.sql` | Món ăn mẫu |
| `seed_articles_simple.sql` | Bài viết mẫu |

Chạy **sau** các bước schema ở trên.

### Storage bucket (avatar)

1. Dashboard → **Storage** → **New bucket**.
2. Tên: **`profiles`** (Public nếu muốn URL công khai).
3. Chạy `storage_policies.sql`.

### Auth

- **Authentication → Providers**: bật **Email**.
- Redirect URL / deep link: scheme app `myapp://` (xem `app.json`) nếu dùng reset mật khẩu / verify email.

---

## Chạy app

```bash
# Dev server
npm start

# Native (tùy chọn)
npm run ios
npm run android

# Web
npm run web
```

- Quét QR bằng **Expo Go**, hoặc nhấn **i** / **a** trên simulator/emulator.

---

## Cấu trúc thư mục (rút gọn)

```
fit-mind/
├── assets/                 # Ảnh, icon, logo
├── src/
│   ├── app/                # Expo Router (auth, tabs, screens)
│   ├── components/         # UI (home, meals, workout, mood, …)
│   ├── constants/          # Route, images
│   ├── context/            # Auth, date, notification
│   ├── modules/            # Auth, profile-setup, user-profile
│   ├── services/           # Supabase services (home, mood, workout, meals, …)
│   └── types/
├── supabase/               # Schema, migration, seed SQL
├── app.json
└── package.json
```

---

## Xử lý lỗi thường gặp

| Vấn đề | Cách xử lý |
|--------|------------|
| Không kết nối Supabase | Kiểm tra URL/anon key và network project |
| RLS chặn query | Đã login? Đã chạy đủ schema + policy? |
| Realtime thông báo không về | Đã chạy `enable_realtime_notifications.sql`? |
| Upload avatar lỗi | Bucket `profiles` + `storage_policies.sql` |
| Kế hoạch tuần / mood trống | Đã chạy `workout_plan_schema.sql` và `mood_logs_schema.sql`? |
| Trigger `auth.users` lỗi owner | Bỏ trigger, tạo profile sau signUp trong app |

---

## Phiên bản

- App: **Rehab Home** `1.0.0` (`com.fit.mind`)
- Package name nội bộ: `expo-health` (có thể đổi sau khi publish)

---

Sau khi setup xong: đăng ký → hoàn tất profile setup → dùng Home, kế hoạch tập, bữa ăn, mood và bài viết trên dữ liệu Supabase của bạn.
