-- =====================================================
-- Tạo bucket Storage "profiles" cho upload avatar
-- Chạy trong Supabase SQL Editor (một lần)
-- Sau đó chạy tiếp storage_policies.sql nếu chưa chạy
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Xác nhận bucket đã tạo
SELECT id, name, public, created_at
FROM storage.buckets
WHERE id = 'profiles';
