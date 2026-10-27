-- Mood logs for home mood tracker / statistics
-- Run in Supabase SQL Editor after core schema

create table if not exists public.mood_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default CURRENT_DATE,
  mood_level int not null check (mood_level between 1 and 5),
  energy_level int not null default 5 check (energy_level between 1 and 10),
  exercised boolean not null default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table public.mood_logs enable row level security;

create policy "Users can view own mood logs."
  on public.mood_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own mood logs."
  on public.mood_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mood logs."
  on public.mood_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own mood logs."
  on public.mood_logs for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.mood_logs to authenticated;
