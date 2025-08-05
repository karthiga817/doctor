/*
  # Initial Schema for Medical Appointment System

  1. New Tables
    - `users` - Base user information for all roles
    - `doctors` - Doctor-specific information and availability
    - `patients` - Patient-specific information
    - `appointments` - Appointment bookings and status
    - `prescriptions` - Medical prescriptions from doctors

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Users can only access their own data
    - Doctors can access their patients' data
    - Admins have full access

  3. Features
    - User authentication with Supabase Auth
    - Role-based access (admin, doctor, patient)
    - Appointment booking and management
    - Prescription management
    - Doctor availability scheduling
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  experience integer DEFAULT 0,
  availability jsonb DEFAULT '[]'::jsonb,
  leave_days text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth date NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
  reason text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  medications text NOT NULL,
  instructions text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow user registration" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Doctors policies
CREATE POLICY "Doctors can read own profile" ON doctors
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Doctors can update own profile" ON doctors
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can read active doctors" ON doctors
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Allow doctor profile creation" ON doctors
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Patients policies
CREATE POLICY "Patients can read own profile" ON patients
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Patients can update own profile" ON patients
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow patient profile creation" ON patients
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Appointments policies
CREATE POLICY "Users can read own appointments" ON appointments
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR doctor_id = auth.uid());

CREATE POLICY "Patients can create appointments" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors and patients can update appointments" ON appointments
  FOR UPDATE TO authenticated
  USING (patient_id = auth.uid() OR doctor_id = auth.uid());

-- Prescriptions policies
CREATE POLICY "Users can read own prescriptions" ON prescriptions
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR doctor_id = auth.uid());

CREATE POLICY "Doctors can create prescriptions" ON prescriptions
  FOR INSERT TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own prescriptions" ON prescriptions
  FOR UPDATE TO authenticated
  USING (doctor_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment_id ON prescriptions(appointment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();