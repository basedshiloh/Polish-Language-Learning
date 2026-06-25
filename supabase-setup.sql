-- Run this in Supabase Dashboard → SQL Editor → New Query → paste and click "Run"

-- Ratings table: stores aggregated ratings per item
create table if not exists ratings (
  id text primary key,           -- e.g. "lesson-introductions" or "grammar-noun-gender"
  item_type text not null,       -- "lesson" or "grammar"
  total_score integer default 0, -- sum of all ratings
  total_votes integer default 0, -- number of votes
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comments table
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  page_id text not null,         -- e.g. "lesson-introductions"
  page_type text not null,       -- "lesson" or "grammar"
  author_name text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Create index for fast lookups
create index if not exists idx_comments_page on comments(page_id, created_at desc);
create index if not exists idx_ratings_type on ratings(item_type);

-- Enable Row Level Security
alter table ratings enable row level security;
alter table comments enable row level security;

-- Allow anyone to read ratings and comments
create policy "Anyone can read ratings" on ratings for select using (true);
create policy "Anyone can read comments" on comments for select using (true);

-- Allow anyone to insert/update ratings (anonymous voting)
create policy "Anyone can upsert ratings" on ratings for insert with check (true);
create policy "Anyone can update ratings" on ratings for update using (true);

-- Allow anyone to insert comments (with name)
create policy "Anyone can insert comments" on comments for insert with check (
  length(author_name) > 0 and length(author_name) <= 50
  and length(content) > 0 and length(content) <= 2000
);
