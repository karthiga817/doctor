import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Doctor, Appointment, Prescription } from '../types';

interface AppContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addPrescription: (prescription: Omit<Prescription, 'id' | 'createdAt'>) => void;
  updateDoctorAvailability: (doctorId: string, availability: any, leaveDays: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockDoctors: Doctor[] = [
  {
    id: 'doc1',
    email: 'dr.smith@hospital.com',
    name: 'Dr. John Smith',
    phone: '+1234567891',
    role: 'doctor',
    specialization: 'Cardiology',
    experience: 10,
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' }
    ],
    leaveDays: [],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'doc2',
    email: 'dr.johnson@hospital.com',
    name: 'Dr. Sarah Johnson',
    phone: '+1234567892',
    role: 'doctor',
    specialization: 'Dermatology',
    experience: 8,
    availability: [
      { day: 'Monday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Friday', startTime: '10:00', endTime: '18:00' }
    ],
    leaveDays: [],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'doc3',
    email: 'dr.williams@hospital.com',
    name: 'Dr. Michael Williams',
    phone: '+1234567894',
    role: 'doctor',
    specialization: 'Neurology',
    experience: 15,
    availability: [
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' }
    ],
    leaveDays: [],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockAppointments: Appointment[] = [
  {
    id: 'app1',
    patientId: 'patient1',
    doctorId: 'doc1',
    patientName: 'Jane Doe',
    doctorName: 'Dr. John Smith',
    doctorSpecialization: 'Cardiology',
    date: '2024-12-25',
    time: '10:00',
    status: 'pending',
    reason: 'Regular checkup',
    createdAt: '2024-12-20T00:00:00Z'
  }
];

const mockPrescriptions: Prescription[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const addPrescription = (prescription: Omit<Prescription, 'id' | 'createdAt'>) => {
    const newPrescription: Prescription = {
      ...prescription,
      id: `presc_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPrescriptions(prev => [...prev, newPrescription]);
  };

  const updateDoctorAvailability = (doctorId: string, availability: any, leaveDays: string[]) => {
    setDoctors(prev => prev.map(doc => 
      doc.id === doctorId ? { ...doc, availability, leaveDays } : doc
    ));
  };

  return (
    <AppContext.Provider value={{
      doctors,
      appointments,
      prescriptions,
      addAppointment,
      updateAppointment,
      addPrescription,
      updateDoctorAvailability
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};