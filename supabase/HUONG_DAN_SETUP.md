# Hướng dẫn setup Supabase mới cho Expo Health Steps

Tài liệu này dùng khi bạn tạo **project Supabase mới** (tài khoản hoặc organization mới) và muốn chạy app `expo-health-steps` từ đầu.

---

## Tổng quan

| Thành phần | Vai trò |
|------------|---------|
| **Supabase Auth** | Đăng ký / đăng nhập email |
| **PostgreSQL** | Profiles, logs bữa ăn/nước/cân/tập/ngủ, bài viết, thông báo |
| **Realtime** | Cập nhật thông báo theo thời gian thực |
| **Storage** | Upload avatar (bucket `profiles`) |

App đọc cấu hình từ file `.env` (xem mục 3). Các file SQL trong thư mục `supabase/` tạo schema và dữ liệu mẫu.

---

## 1. Tạo project Supabase

1. Đăng nhập [supabase.com](https://supabase.com) → **New project**.
2. Chọn region gần người dùng, đặt mật khẩu database (lưu lại nếu cần truy cập SQL trực tiếp).
3. Đợi project khởi tạo xong (vài phút).

### Lấy API keys

Vào **Project Settings** → **API**:

| Biến môi trường | Lấy từ đâu |
|-----------------|------------|
| `EXPO_PUBLIC_SUPABASE_URL` | **Project URL** (dạng `https://xxxxx.supabase.co`) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | **anon public** key (JWT dạng `eyJ...` hoặc publishable key mới) |

> Chỉ dùng **anon key** trong app. Không đưa `service_role` vào client.

---

## 2. Cấu hình Auth

**Authentication** → **Providers**:

- Bật **Email**.
- Tắt **Confirm email** nếu muốn test nhanh trên dev (bật lại khi production).

**Authentication** → **URL Configuration** (tùy chọn):

- Thêm redirect scheme `myapp://` (khớp `scheme` trong `app.json`) nếu sau này dùng magic link / reset password qua deep link.

---

## 3. Cấu hình app (`.env`)

Ở thư mục gốc dự án, copy mẫu và điền key mới:

```bash
cp .env.example .env
```

Chỉnh `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Tùy chọn — chat AI sức khỏe
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

Client Supabase: `src/lib/supabase.ts` (đọc 2 biến trên).

Sau khi sửa `.env`, **khởi động lại** Expo:

```bash
npm start
# hoặc: npx expo start -c   (xóa cache nếu env không áp dụng)
```

---

## 4. Chạy SQL — thứ tự bắt buộc

Mở **SQL Editor** trong Supabase Dashboard. Chạy **từng file** theo bảng dưới (copy toàn bộ nội dung file → Run).

### 4.1. Schema cốt lõi (chọn **một** trong hai)

| File | Khi nào dùng |
|------|----------------|
| **`schema.sql`** | Project **trống**, lần setup đầu tiên |
| **`setup_steps.sql`** | Muốn **xóa và tạo lại** bảng cơ bản (có `DROP TABLE`) |

Cả hai tạo: `profiles`, `weight_logs`, `water_logs`, `meal_plans`, `meals`, `meal_logs`, `articles`, `saved_articles`, RLS, trigger `on_auth_user_created`.

**Lưu ý `schema.sql` dòng đầu:**

```sql
alter table auth.users enable row level security;
```

Nếu SQL báo lỗi quyền trên `auth.users`, **bỏ qua dòng đó** (comment hoặc xóa) rồi chạy phần còn lại. `setup_steps.sql` không có dòng này.

**Ngay sau bước 4.1**, chạy **`grant_table_permissions.sql`** (bắt buộc nếu app báo `permission denied for table profiles` / mã `42501`).

### 4.2. Mở rộng schema

| # | File | Nội dung |
|---|------|----------|
| 2 | `add_exercise_sleep_tables.sql` | `exercise_logs`, `sleep_logs` + RLS |
| 3 | `add_meal_type_column.sql` | Cột `meal_type` trên `meal_logs` (`breakfast` / `lunch` / `snack` / `dinner`) |
| 4 | `notifications_schema.sql` | `notifications`, `notification_settings`, hàm/trigger cơ bản |
| 5 | `add_notification_triggers.sql` | Logic trigger nâng cao (BMR, mục tiêu nước, streak…) |

**Sau bước 5**, chạy thêm một lần trong SQL Editor (tránh 2 trigger chào mừng trùng):

```sql
DROP TRIGGER IF EXISTS create_notification_settings_trigger ON public.profiles;
```

| # | File | Nội dung |
|---|------|----------|
| 6 | `enable_realtime_notifications.sql` | Thêm `notifications` vào publication Realtime |
| 7 | `fix_meal_logs_policy.sql` | Policy **DELETE** cho `meal_logs` |
| 8 | `create_profiles_storage_bucket.sql` | Tạo bucket Storage `profiles` (public) |
| 9 | `storage_policies.sql` | Policy Storage cho avatar |

### 4.3. Seed dữ liệu (khuyến nghị)

| File | Nội dung |
|------|----------|
| `meals_data.sql` | ~60 món ăn mẫu (Việt Nam) vào bảng `meals` |
| `seed_articles_simple.sql` | 10 bài blog Sức khỏe (Notion public) — xóa toàn bộ `articles` cũ rồi insert mới. Tạo lại file: `python3 scripts/generate-article-seed.py` |

Có thể seed bằng script Node (cần `.env` đã cấu hình):

```bash
node scripts/seed-meals.js
```

---

## 5. Storage — bucket avatar

**Cách A (SQL — khuyến nghị):** SQL Editor → chạy lần lượt:

1. `create_profiles_storage_bucket.sql` — tạo bucket **`profiles`** (public)
2. `storage_policies.sql` — policy upload/xem avatar

**Cách B (Dashboard):**

1. **Storage** → **New bucket**
2. Tên: **`profiles`** (đúng chữ thường, không dấu cách)
3. **Public bucket**: bật
4. Chạy `storage_policies.sql`

App upload vào path: `avatars/<userId>_<timestamp>.jpg`

Nếu app báo **`Bucket not found`** → chưa làm bước trên.

---

## 6. Kiểm tra sau setup

### Bảng đã tạo

Trong **Table Editor**, kiểm tra có các bảng:

`profiles`, `weight_logs`, `water_logs`, `meal_plans`, `meals`, `meal_logs`, `articles`, `saved_articles`, `exercise_logs`, `sleep_logs`, `notifications`, `notification_settings`

### Realtime

Chạy trong SQL Editor:

```sql
SELECT tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'notifications';
```

Phải trả về một dòng `notifications`.

### Đăng ký user thử

1. Chạy app: `npm start`
2. Đăng ký email + mật khẩu
3. Trong Supabase → **Authentication** → **Users**: có user mới
4. **Table Editor** → `profiles`: có một dòng `id` = `user.id`
5. `notification_settings`: có một dòng cho user đó
6. `notifications`: có thông báo `welcome` (nếu trigger chạy đúng)

---

## 7. Chạy ứng dụng

```bash
npm install
npm start
```

- **Expo Go**: quét QR
- **Simulator**: `i` (iOS) / `a` (Android)

Build native (tùy chọn): `npm run ios` / `npm run android`

---

## 8. Bản đồ file `supabase/`

| File | Mục đích |
|------|----------|
| `schema.sql` | Schema gốc (project mới) |
| `setup_steps.sql` | Reset + tạo lại bảng gốc |
| `add_exercise_sleep_tables.sql` | Tập luyện & giấc ngủ |
| `add_meal_type_column.sql` | `meal_type` trên `meal_logs` |
| `notifications_schema.sql` | Hệ thống thông báo |
| `add_notification_triggers.sql` | Cập nhật logic trigger |
| `enable_realtime_notifications.sql` | Realtime cho `notifications` |
| `fix_meal_logs_policy.sql` | Cho phép xóa `meal_logs` |
| `grant_table_permissions.sql` | Cấp quyền `authenticated`/`anon` trên bảng `public` (sửa lỗi 42501) |
| `create_profiles_storage_bucket.sql` | Tạo bucket Storage `profiles` |
| `storage_policies.sql` | Policy bucket `profiles` |
| `meals_data.sql` | Seed món ăn |
| `seed_articles_simple.sql` | Seed bài viết |
| `HUONG_DAN_SETUP.md` | File hướng dẫn này |

---

## 9. Lỗi thường gặp

| Triệu chứng | Nguyên nhân / cách xử lý |
|-------------|---------------------------|
| App crash khi mở: missing Supabase config | Chưa có `EXPO_PUBLIC_SUPABASE_*` trong `.env` hoặc chưa restart Expo |
| `relation already exists` | Đã chạy `schema.sql` rồi chạy lại — dùng project mới hoặc `setup_steps.sql` (cẩn thận: xóa data) |
| `trigger already exists` | Chạy lại `notifications_schema` + `add_notification_triggers` — file bước 5 đã có `DROP TRIGGER IF EXISTS` cho hầu hết trigger |
| RLS / permission denied (`42501` trên `profiles`) | Chạy **`grant_table_permissions.sql`** trong SQL Editor; đảm bảo user đã đăng nhập (có session) |
| RLS / permission denied (khác) | Chưa chạy đủ file SQL; user chưa đăng nhập |
| Không xóa được meal log | Chưa chạy `fix_meal_logs_policy.sql` |
| Realtime không có thông báo mới | Chưa chạy `enable_realtime_notifications.sql` |
| Upload avatar `Bucket not found` | Chạy `create_profiles_storage_bucket.sql` rồi `storage_policies.sql` |
| Đăng ký OK nhưng không có `profiles` | Trigger `on_auth_user_created` lỗi — xem **Database** → **Logs** |

---

## 10. Ghi chú kỹ thuật (đã rà soát)

1. **`src/lib/supabase.ts`** — dùng biến môi trường, không hardcode project cũ.
2. **`scripts/seed-meals.js`** — đọc `.env` đúng chuẩn; **`scripts/seed-simple.js`** vẫn hardcode URL cũ → chỉ dùng `seed-meals.js` hoặc SQL `meals_data.sql`.
3. **`meals.meal_type`** dùng `morning_snack` / `afternoon_snack` (bảng `meals`); **`meal_logs.meal_type`** dùng `snack` (app UI) — đúng thiết kế hiện tại.
4. **`README.md`** (thư mục gốc) có hướng dẫn chung dự án; file này tập trung **chỉ Supabase + project mới**.

---

## Checklist nhanh

- [ ] Tạo project Supabase mới
- [ ] Copy URL + anon key vào `.env`
- [ ] Bật Email Auth
- [ ] Chạy SQL bước 1 → 8 (đúng thứ tự)
- [ ] Chạy `grant_table_permissions.sql` (sau schema cốt lõi)
- [ ] `DROP TRIGGER create_notification_settings_trigger` sau bước 5
- [ ] Chạy `create_profiles_storage_bucket.sql` + `storage_policies.sql`
- [ ] Chạy seed `meals_data.sql` + `seed_articles_simple.sql`
- [ ] `npm start` → đăng ký thử → kiểm tra `profiles` + `notifications`

Sau checklist trên, app có thể đăng nhập, ghi log sức khỏe, xem món ăn/bài viết mẫu và nhận thông báo realtime.
