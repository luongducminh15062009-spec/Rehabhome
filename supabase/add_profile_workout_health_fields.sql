-- Extend profiles for workout schedule + health condition (profile setup steps 8-10)
-- Run in Supabase SQL Editor after schema.sql

alter table public.profiles
  add column if not exists workout_days smallint[] default '{}',
  add column if not exists workout_period text check (workout_period is null or workout_period in ('morning', 'noon', 'evening')),
  add column if not exists workout_start_time text,
  add column if not exists workout_duration_min int,
  add column if not exists fitness_goal_detail text check (
    fitness_goal_detail is null or fitness_goal_detail in (
      'lose_weight', 'maintain', 'gain_weight', 'body_composition',
      'overall_health', 'eat_better', 'feel_better'
    )
  ),
  add column if not exists health_condition text check (
    health_condition is null or health_condition in ('none', 'diabetes', 'hypertension', 'heart', 'joints', 'other')
  ),
  add column if not exists health_notes text;
