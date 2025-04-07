
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { users, students, teachers } from '../lib/mockedData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  userId: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const login = (email: string, password: string): boolean => {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      setCurrentUser(user);
      setUserRole(user.role);
      
      if (user.role === 'student') {
        const student = students.find(s => s.userId === user.id);
        setUserId(student?.id || null);
      } else if (user.role === 'teacher') {
        const teacher = teachers.find(t => t.userId === user.id);
        setUserId(teacher?.id || null);
      } else {
        setUserId(user.id);
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.email}!`,
      });
      return true;
    }

    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Invalid credentials. Please try again.",
    });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setUserId(null);
    toast({
      title: "Logout successful",
      description: "You have been logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, userId, login, logout }}>
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
