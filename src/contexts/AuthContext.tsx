import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Doctor, Patient } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data - in a real app, this would come from a backend
const mockUsers: (Doctor | Patient | User)[] = [
  {
    id: 'admin1',
    email: 'admin@hospital.com',
    password: 'admin123',
    name: 'System Administrator',
    phone: '+1234567890',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'doc1',
    email: 'dr.smith@hospital.com',
    password: 'doctor123',
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
    password: 'doctor123',
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
    id: 'patient1',
    email: 'patient@email.com',
    password: 'patient123',
    name: 'Jane Doe',
    phone: '+1234567893',
    role: 'patient',
    dateOfBirth: '1990-05-15',
    address: '123 Main St, City, State',
    createdAt: '2024-01-01T00:00:00Z'
  }
] as any[];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      delete userData.password;
      setUser(userData);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && (u as any).password === password);
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete (userWithoutPassword as any).password;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: any): Promise<boolean> => {
    // In a real app, this would send data to backend
    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // In a real app, this would send reset email
    const foundUser = mockUsers.find(u => u.email === email);
    return !!foundUser;
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // In a real app, this would validate token and update password
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};