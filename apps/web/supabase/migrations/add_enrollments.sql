-- Create enrollments table to track course enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'canceled')),
  payment_status TEXT CHECK (payment_status IN ('free', 'pending', 'paid', 'refunded')),
  payment_amount DECIMAL(10, 2),
  payment_id TEXT, -- ID de la transaction Stripe/PayPal
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Add foreign key constraints only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_enrollments_user'
  ) THEN
    ALTER TABLE enrollments
      ADD CONSTRAINT fk_enrollments_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_enrollments_course'
  ) THEN
    ALTER TABLE enrollments
      ADD CONSTRAINT fk_enrollments_course
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at DESC);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Creators can view course enrollments" ON enrollments;

-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can enroll themselves
CREATE POLICY "Users can insert own enrollments" ON enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollments (for progress, last_accessed)
CREATE POLICY "Users can update own enrollments" ON enrollments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Course creators can view all enrollments for their courses
CREATE POLICY "Creators can view course enrollments" ON enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.creator_id = auth.uid()
    )
  );

-- Function to update progress percentage based on completed lessons
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  new_progress INTEGER;
  enrollment_record RECORD;
BEGIN
  -- Get the enrollment record
  SELECT * INTO enrollment_record
  FROM enrollments
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

  -- If no enrollment found, skip
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Count total lessons in the course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons l
  JOIN sections s ON l.section_id = s.id
  WHERE s.course_id = NEW.course_id;

  -- Count completed lessons
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress lp
  JOIN lessons l ON lp.lesson_id = l.id
  JOIN sections s ON l.section_id = s.id
  WHERE lp.user_id = NEW.user_id
    AND s.course_id = NEW.course_id
    AND lp.completed = true;

  -- Calculate progress percentage
  IF total_lessons > 0 THEN
    new_progress := ROUND((completed_lessons::DECIMAL / total_lessons) * 100);
  ELSE
    new_progress := 0;
  END IF;

  -- Update enrollment
  UPDATE enrollments
  SET
    progress_percentage = new_progress,
    updated_at = NOW(),
    completed_at = CASE WHEN new_progress = 100 THEN NOW() ELSE completed_at END,
    status = CASE WHEN new_progress = 100 THEN 'completed' ELSE status END
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update enrollment progress when lesson progress changes
DROP TRIGGER IF EXISTS trigger_update_enrollment_progress ON lesson_progress;
CREATE TRIGGER trigger_update_enrollment_progress
AFTER INSERT OR UPDATE ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION update_enrollment_progress();
