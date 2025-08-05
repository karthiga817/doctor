import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import PatientAppointments from './pages/PatientAppointments';
import PatientPrescriptions from './pages/PatientPrescriptions';

// Doctor Pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const getDefaultRoute = () => {
    switch (user.role) {
      case 'admin': return '/admin';
      case 'doctor': return '/doctor';
      case 'patient': return '/patient';
      default: return '/login';
    }
  };

  return (
    <Layout>
      <Routes>
        {/* Redirect to appropriate dashboard */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Patient Routes */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/book" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/patient/appointments" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientAppointments />
          </ProtectedRoute>
        } />
        <Route path="/patient/prescriptions" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientPrescriptions />
          </ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorAppointments />
          </ProtectedRoute>
        } />
        <Route path="/doctor/prescriptions" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Prescriptions Management</h2>
              <p className="text-gray-600 mt-2">Coming soon - Create and manage prescriptions</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/doctor/availability" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Availability Management</h2>
              <p className="text-gray-600 mt-2">Coming soon - Set your working hours and leave days</p>
            </div>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
              <p className="text-gray-600 mt-2">Coming soon - Manage doctor profiles and settings</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/admin/appointments" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
              <p className="text-gray-600 mt-2">Coming soon - System-wide appointment overview</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/admin/patients" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
              <p className="text-gray-600 mt-2">Coming soon - View and manage patient records</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/admin/prescriptions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">All Prescriptions</h2>
              <p className="text-gray-600 mt-2">Coming soon - System-wide prescription overview</p>
            </div>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;