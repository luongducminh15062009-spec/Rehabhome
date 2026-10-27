-- Weekly workout plan items shared by Home and Workout Plan screens
create table if not exists public.workout_plan_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scheduled_date date not null,
  exercise_key text not null,
  title text not null,
  category text not null,
  difficulty text not null,
  duration_minutes int not null check (duration_minutes > 0),
  image_url text,
  workout_period text check (workout_period in ('morning', 'noon', 'evening')),
  start_time text,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, scheduled_date, exercise_key)
);

alter table public.workout_plan_items enable row level security;

create policy "Users can view own workout plan."
  on public.workout_plan_items for select using (auth.uid() = user_id);
create policy "Users can insert own workout plan."
  on public.workout_plan_items for insert with check (auth.uid() = user_id);
create policy "Users can update own workout plan."
  on public.workout_plan_items for update using (auth.uid() = user_id);
create policy "Users can delete own workout plan."
  on public.workout_plan_items for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.workout_plan_items to authenticated;
create index if not exists workout_plan_items_user_date_idx
  on public.workout_plan_items(user_id, scheduled_date);
