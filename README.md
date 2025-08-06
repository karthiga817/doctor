# MedBook - Medical Appointment Booking System

A comprehensive medical appointment booking system built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### For Patients
- **User Registration & Authentication** - Secure signup and login
- **Doctor Search** - Find doctors by specialization and availability
- **Appointment Booking** - Schedule appointments with preferred doctors
- **Appointment Management** - View, reschedule, and cancel appointments
- **Prescription Access** - View and download prescriptions as PDF

### For Doctors
- **Dashboard** - Overview of appointments and patient requests
- **Appointment Management** - Confirm, reject, or complete appointments
- **Availability Settings** - Set working hours and leave days
- **Prescription Management** - Create and manage patient prescriptions

### For Administrators
- **System Overview** - Complete dashboard with key metrics
- **User Management** - Manage doctors, patients, and system users
- **Appointment Oversight** - System-wide appointment monitoring
- **Analytics** - Track system usage and performance

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Routing**: React Router v6
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Database Schema

### Tables
- `users` - Base user information for all roles
- `doctors` - Doctor profiles with specialization and availability
- `patients` - Patient profiles with personal information
- `appointments` - Appointment bookings and status tracking
- `prescriptions` - Medical prescriptions from doctors

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure authentication with Supabase Auth

## Setup Instructions

### Demo Credentials

For immediate testing, use these demo accounts:

**Admin Access:**
- Email: `admin@medbook.com`
- Password: `admin123`
- URL: `/admin/login`

**Doctor Access:**
- Email: `doctor@medbook.com`
- Password: `doctor123`
- URL: `/doctor/login`

**Patient Access:**
- Email: `patient@medbook.com`
- Password: `patient123`
- URL: `/login`

### 1. Clone the Repository
```bash
git clone <repository-url>
cd medbook
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up the Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the SQL from `supabase/migrations/create_initial_schema.sql`

This will create all necessary tables, indexes, and security policies.

### 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Disable email confirmations for easier testing (optional)
3. Configure any additional auth providers if needed

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## User Roles and Access

### Patient Access
- Register as a new patient
- Book appointments with available doctors
- View and manage their appointments
- Access their prescriptions

### Doctor Access
- Doctors need to be created by administrators
- Manage appointment requests (confirm/reject)
- Set availability and leave days
- Create prescriptions for patients

### Admin Access
- Full system access
- Manage all users and appointments
- System analytics and oversight
- Create doctor accounts

## Key Features Explained

### Real-time Updates
The system uses Supabase's real-time capabilities to ensure data is always up-to-date across all users.

### Security
- All data access is controlled by Row Level Security policies
- Users can only access their own data
- Doctors can access their patients' data
- Admins have full system access

### Responsive Design
The application is fully responsive and works on all device sizes.

### PDF Generation
Patients can download their prescriptions as PDF files for offline access.

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── lib/               # Utility libraries (Supabase client)
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── main.tsx           # Application entry point
```

### Adding New Features

1. **Database Changes**: Add new migrations in `supabase/migrations/`
2. **Types**: Update TypeScript types in `src/types/`
3. **API Calls**: Add new functions in contexts or create new services
4. **UI**: Create new components and pages as needed

## Deployment

### Frontend Deployment
The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Database
Your Supabase database is already hosted and managed by Supabase.

## Support

For issues and questions:
1. Check the Supabase documentation
2. Review the code comments and README
3. Check the browser console for error messages

## License

This project is licensed under the MIT License.