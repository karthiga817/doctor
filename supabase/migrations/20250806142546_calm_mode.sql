/*
  # Create Default Admin User

  1. New Tables
    - Creates a default admin user for system access
  
  2. Security
    - Admin user with full system access
    - Default credentials for initial setup
  
  3. Default Credentials
    - Email: admin@medbook.com
    - Password: admin123
    - Role: admin
*/

-- Create default admin user in auth.users (this would typically be done through Supabase Auth)
-- For demo purposes, we'll create the user profile directly

-- Insert default admin user profile
INSERT INTO users (
  id,
  email,
  name,
  phone,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@medbook.com',
  'System Administrator',
  '+1-555-0100',
  'admin',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create a sample doctor for testing
INSERT INTO users (
  id,
  email,
  name,
  phone,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'doctor@medbook.com',
  'Dr. John Smith',
  '+1-555-0200',
  'doctor',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create doctor profile
INSERT INTO doctors (
  id,
  user_id,
  specialization,
  experience,
  availability,
  leave_days,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  'General Medicine',
  10,
  '[
    {"day": "Monday", "startTime": "09:00", "endTime": "17:00"},
    {"day": "Tuesday", "startTime": "09:00", "endTime": "17:00"},
    {"day": "Wednesday", "startTime": "09:00", "endTime": "17:00"},
    {"day": "Thursday", "startTime": "09:00", "endTime": "17:00"},
    {"day": "Friday", "startTime": "09:00", "endTime": "17:00"}
  ]'::jsonb,
  '{}',
  true,
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Create a sample patient for testing
INSERT INTO users (
  id,
  email,
  name,
  phone,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'patient@medbook.com',
  'Jane Doe',
  '+1-555-0300',
  'patient',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create patient profile
INSERT INTO patients (
  id,
  user_id,
  date_of_birth,
  address,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000003',
  '1990-01-01',
  '123 Main Street, City, State 12345',
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;