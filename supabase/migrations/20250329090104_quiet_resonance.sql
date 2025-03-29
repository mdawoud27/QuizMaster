/*
  # Quiz App Database Schema

  1. New Tables
    - users
      - Stores user profiles and stats
    - categories
      - Quiz categories (e.g., Science, History)
    - questions
      - Quiz questions with category association
    - user_scores
      - Track user quiz attempts and scores
    - achievements
      - User achievements and badges
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES categories(id),
  score integer NOT NULL,
  time_taken integer NOT NULL,
  correct_answers integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  achievement_id uuid REFERENCES achievements(id),
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT TO public USING (true);

CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can view all scores" ON user_scores
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own scores" ON user_scores
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can view their achievements" ON user_achievements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can unlock achievements" ON user_achievements
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create the user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Add RLS policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Admin users can read all roles
CREATE POLICY "Admin users can read all roles"
  ON user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Users can read their own roles
CREATE POLICY "Users can read their own roles"
  ON user_roles
  FOR SELECT
  USING (user_id = auth.uid());

-- Only admin users can insert, update, delete roles
CREATE POLICY "Only admin users can insert roles"
  ON user_roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Only admin users can update roles"
  ON user_roles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Only admin users can delete roles"
  ON user_roles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );
  
-- Insert initial categories
INSERT INTO categories (name, description, icon) VALUES
  ('Science', 'Test your knowledge of scientific concepts', 'flask'),
  ('History', 'Journey through time with historical facts', 'landmark'),
  ('Geography', 'Explore the world''s places and cultures', 'globe'),
  ('Literature', 'Discover the world of books and authors', 'book-open'),
  ('Technology', 'Modern tech and computer knowledge', 'cpu'),
  ('Sports', 'Athletic achievements and sports facts', 'trophy'),
  ('Movies', 'Film industry and cinema knowledge', 'film'),
  ('Music', 'Musical history and theory', 'music');

-- Insert initial achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value) VALUES
  ('Quick Learner', 'Complete your first quiz', 'award', 'quizzes_completed', 1),
  ('Knowledge Seeker', 'Score 1000 points total', 'brain', 'total_score', 1000),
  ('Speed Demon', 'Complete a quiz with 5+ minutes remaining', 'timer', 'time_remaining', 300),
  ('Perfect Score', 'Get all questions correct in a quiz', 'target', 'perfect_score', 1),
  ('Category Master', 'Complete all categories', 'crown', 'categories_completed', 8);