import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { authenticateUser, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [emailOrRollNumber, setEmailOrRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!emailOrRollNumber || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email/roll number and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const user = authenticateUser(emailOrRollNumber, password);
      
      if (user) {
        localStorage.setItem('pollApp_currentUser', JSON.stringify(user));
        onLogin(user);
        toast({
          title: "Login Successful",
          description: `Welcome ${user.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email/roll number or password. Please use your college email or roll number.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl font-bold text-primary-foreground">📊</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SKCT Poll System
          </CardTitle>
          <p className="text-muted-foreground">
            Use your college email to access polls
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrRollNumber" className="text-sm font-medium">
                College Email / Roll Number
              </Label>
              <Input
                id="emailOrRollNumber"
                type="text"
                placeholder="727824TUAM001@skct.edu.in or tutor"
                value={emailOrRollNumber}
                onChange={(e) => setEmailOrRollNumber(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            variant="mobile"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-sm text-center text-muted-foreground space-y-2">
            <p><strong>Demo Credentials:</strong></p>
            <p>Student: 727824TUAM001@skct.edu.in, Password: student123</p>
            <p>Tutor: tutor@skct.edu.in, Password: admin123</p>
            <p className="text-xs mt-2">
              Note: Google OAuth integration requires backend setup. 
              For demo purposes, use email/password authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};