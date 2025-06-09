/*
  # Create Will Data Storage System

  1. New Tables
    - `will_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `personal_info` (jsonb) - Personal information data
      - `digital_assets` (jsonb) - Digital assets selections and details
      - `crypto_setup` (jsonb) - Cryptocurrency setup and instructions
      - `beneficiaries` (jsonb) - Beneficiaries and executor information
      - `will_content` (jsonb) - Generated will content and metadata
      - `status` (text) - Will status: draft, completed, paid
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `will_data` table
    - Add policies for authenticated users to manage their own will data
    - Add policy for users to read their own will data
    - Add policy for users to update their own will data
    - Add policy for users to delete their own will data

  3. Indexes
    - Index on user_id for fast lookups
    - Index on status for filtering
    - Index on updated_at for sorting

  4. Functions
    - Auto-update updated_at timestamp on changes
*/

-- Create will_data table
CREATE TABLE IF NOT EXISTS will_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  personal_info jsonb DEFAULT '{}',
  digital_assets jsonb DEFAULT '{}',
  crypto_setup jsonb DEFAULT '{}',
  beneficiaries jsonb DEFAULT '{}',
  will_content jsonb DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'paid')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE will_data ENABLE ROW LEVEL SECURITY;

-- Create policies for will_data table
CREATE POLICY "Users can read own will data"
  ON will_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own will data"
  ON will_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own will data"
  ON will_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own will data"
  ON will_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_will_data_user_id ON will_data(user_id);
CREATE INDEX IF NOT EXISTS idx_will_data_status ON will_data(status);
CREATE INDEX IF NOT EXISTS idx_will_data_updated_at ON will_data(updated_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_will_data_updated_at ON will_data;
CREATE TRIGGER update_will_data_updated_at
  BEFORE UPDATE ON will_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();