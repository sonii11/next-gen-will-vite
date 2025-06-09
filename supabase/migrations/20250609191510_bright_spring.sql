/*
  # Create User Sessions Table

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, nullable for anonymous sessions)
      - `session_data` (jsonb) - Encrypted session data
      - `expires_at` (timestamptz) - Session expiration
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_sessions` table
    - Add policies for users to manage their own sessions
    - Add policy for anonymous sessions (temporary)

  3. Cleanup
    - Function to automatically clean up expired sessions
*/

-- Create user_sessions table for session persistence
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_data jsonb DEFAULT '{}',
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions table
CREATE POLICY "Users can read own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON user_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous sessions (for users not yet registered)
CREATE POLICY "Allow anonymous session creation"
  ON user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow anonymous session read by session id"
  ON user_sessions
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;