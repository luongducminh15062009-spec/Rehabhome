-- Tư thế và dụng cụ cho từng bài tập (thư viện + bài tự tạo).
-- Chạy trong SQL Editor sau schema.sql.

create table if not exists public.exercise_details (
  exercise_key text primary key,
  posture text not null,
  equipment text not null,
  user_id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exercise_details enable row level security;

drop policy if exists "Exercise details are viewable by everyone." on public.exercise_details;
create policy "Exercise details are viewable by everyone."
  on public.exercise_details for select
  using (true);

drop policy if exists "Users can insert own exercise details." on public.exercise_details;
create policy "Users can insert own exercise details."
  on public.exercise_details for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own exercise details." on public.exercise_details;
create policy "Users can update own exercise details."
  on public.exercise_details for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own exercise details." on public.exercise_details;
create policy "Users can delete own exercise details."
  on public.exercise_details for delete
  using (auth.uid() = user_id);

grant select on public.exercise_details to anon, authenticated;
grant insert, update, delete on public.exercise_details to authenticated;

-- Thư viện bài tập mới (user_id null — app chỉ đọc).
delete from public.exercise_details where user_id is null;

insert into public.exercise_details (exercise_key, posture, equipment, user_id)
values
  ('belly-breath', 'Ngồi hoặc nằm thoải mái', 'Không cần', null),
  ('shoulder-roll', 'Ngồi hoặc đứng', 'Không cần', null),
  ('neck-side-stretch', 'Ngồi thoải mái', 'Không cần', null),
  ('seated-knee-extension', 'Ngồi trên ghế', 'Ghế chắc chắn', null),
  ('march-in-place', 'Đứng', 'Giày thoải mái', null),
  ('side-step', 'Đứng', 'Không cần', null),
  ('supported-sit-to-stand', 'Ngồi trên ghế có tay vịn', 'Ghế chắc chắn', null),
  ('wall-push-up', 'Đứng đối diện tường', 'Tường', null),
  ('full-body-stretch', 'Đứng', 'Không cần', null)
on conflict (exercise_key) do update
set
  posture = excluded.posture,
  equipment = excluded.equipment,
  updated_at = timezone('utc'::text, now())
where public.exercise_details.user_id is null;
