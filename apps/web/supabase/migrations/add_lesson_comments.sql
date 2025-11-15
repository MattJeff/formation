-- Create lesson_comments table for comments on lessons
CREATE TABLE IF NOT EXISTS lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL,
  course_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_lesson_comments_lesson'
  ) THEN
    ALTER TABLE lesson_comments
      ADD CONSTRAINT fk_lesson_comments_lesson
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_lesson_comments_course'
  ) THEN
    ALTER TABLE lesson_comments
      ADD CONSTRAINT fk_lesson_comments_course
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_lesson_comments_user'
  ) THEN
    ALTER TABLE lesson_comments
      ADD CONSTRAINT fk_lesson_comments_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_lesson_comments_parent'
  ) THEN
    ALTER TABLE lesson_comments
      ADD CONSTRAINT fk_lesson_comments_parent
      FOREIGN KEY (parent_id) REFERENCES lesson_comments(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lesson_comments_lesson_id ON lesson_comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_course_id ON lesson_comments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_user_id ON lesson_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_parent_id ON lesson_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_created_at ON lesson_comments(created_at DESC);

-- Enable RLS
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view lesson comments" ON lesson_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON lesson_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON lesson_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON lesson_comments;
DROP POLICY IF EXISTS "Creators can delete course comments" ON lesson_comments;

-- Anyone enrolled in the course can view comments
CREATE POLICY "Users can view lesson comments" ON lesson_comments
  FOR SELECT
  USING (true);  -- For now, allow everyone to view. Later can restrict to enrolled users

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments" ON lesson_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON lesson_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON lesson_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Course creators can delete any comments on their courses
CREATE POLICY "Creators can delete course comments" ON lesson_comments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lesson_comments.course_id
      AND courses.creator_id = auth.uid()
    )
  );
