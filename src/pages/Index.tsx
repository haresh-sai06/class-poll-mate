import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { TutorDashboard } from '@/components/TutorDashboard';
import { StudentDashboard } from '@/components/StudentDashboard';
import { FirstTimeSetup } from '@/components/FirstTimeSetup';
import { initializeData, User } from '@/lib/storage';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize data on first load
    initializeData();
    
    // Check for existing session
    const savedUser = localStorage.getItem('pollApp_currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('pollApp_currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleSetupComplete = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('pollApp_currentUser');
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-2xl font-bold text-primary-foreground">📊</span>
          </div>
          <p className="text-muted-foreground">Loading Poll System...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Check if student needs first-time setup
  if (!currentUser.isAdmin && !currentUser.hasCompletedSetup) {
    return <FirstTimeSetup user={currentUser} onSetupComplete={handleSetupComplete} />;
  }

  if (currentUser.isAdmin) {
    return <TutorDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
};

export default Index;
