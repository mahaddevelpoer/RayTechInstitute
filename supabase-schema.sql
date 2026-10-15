-- Supabase SQL Schema for RayTech Educational Platform
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  numeric_grade INT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  class_slug TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  icon_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  class_slug TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  chapter_number INT NOT NULL,
  chapter_title TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT NOT NULL,
  file_size TEXT,
  download_count INT DEFAULT 0,
  last_updated TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MCQs Table
CREATE TABLE IF NOT EXISTS mcqs (
  id TEXT PRIMARY KEY,
  class_slug TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  chapter_number INT NOT NULL,
  question TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB NOT NULL,
  correct_index INT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Past Papers Table
CREATE TABLE IF NOT EXISTS past_papers (
  id TEXT PRIMARY KEY,
  class_slug TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  board TEXT NOT NULL,
  year INT NOT NULL,
  session TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Result Gazettes Table
CREATE TABLE IF NOT EXISTS gazettes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  board TEXT NOT NULL,
  class_slug TEXT NOT NULL,
  year INT NOT NULL,
  session TEXT,
  pdf_url TEXT NOT NULL,
  direct_result_url TEXT,
  release_date TEXT,
  total_candidates TEXT,
  passing_percentage TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  author TEXT NOT NULL,
  date_published TEXT NOT NULL,
  read_time TEXT NOT NULL,
  tags JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Push Notification Subscribers Table
CREATE TABLE IF NOT EXISTS notification_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  device_info TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gazettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access (All students can read)
CREATE POLICY "Public Read Classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Public Read Subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public Read Notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Public Read MCQs" ON mcqs FOR SELECT USING (true);
CREATE POLICY "Public Read Past Papers" ON past_papers FOR SELECT USING (true);
CREATE POLICY "Public Read Gazettes" ON gazettes FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Insert Subscribers" ON notification_subscribers FOR INSERT WITH CHECK (true);

-- Allow Admin (Anon Key) Insert/Update/Delete
CREATE POLICY "Public Read Classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Public Read Subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public Read Notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Public Read MCQs" ON mcqs FOR SELECT USING (true);
CREATE POLICY "Public Read Past Papers" ON past_papers FOR SELECT USING (true);
CREATE POLICY "Public Read Gazettes" ON gazettes FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
