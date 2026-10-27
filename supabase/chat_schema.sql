-- Lịch sử hỏi đáp sức khỏe (OpenRouter).
-- Chạy trong SQL Editor của project Supabase.

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.chat_conversations on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists chat_conversations_user_updated_idx
  on public.chat_conversations (user_id, updated_at desc);

create index if not exists chat_messages_conversation_idx
  on public.chat_messages (conversation_id, created_at);

alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Users read own conversations." on public.chat_conversations;
create policy "Users read own conversations."
  on public.chat_conversations for select using (auth.uid() = user_id);

drop policy if exists "Users insert own conversations." on public.chat_conversations;
create policy "Users insert own conversations."
  on public.chat_conversations for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own conversations." on public.chat_conversations;
create policy "Users update own conversations."
  on public.chat_conversations for update using (auth.uid() = user_id);

drop policy if exists "Users delete own conversations." on public.chat_conversations;
create policy "Users delete own conversations."
  on public.chat_conversations for delete using (auth.uid() = user_id);

drop policy if exists "Users read own messages." on public.chat_messages;
create policy "Users read own messages."
  on public.chat_messages for select using (auth.uid() = user_id);

drop policy if exists "Users insert own messages." on public.chat_messages;
create policy "Users insert own messages."
  on public.chat_messages for insert with check (auth.uid() = user_id);

drop policy if exists "Users delete own messages." on public.chat_messages;
create policy "Users delete own messages."
  on public.chat_messages for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.chat_conversations to authenticated;
grant select, insert, delete on public.chat_messages to authenticated;
