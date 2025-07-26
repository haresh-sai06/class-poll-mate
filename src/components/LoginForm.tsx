import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { authenticateUser, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!rollNumber || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both roll number and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const user = authenticateUser(rollNumber, password);
      
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
          description: "Invalid roll number or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl font-bold text-primary-foreground">📊</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Class Poll System
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your credentials to access polls
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="text-sm font-medium">
                Roll Number / Username
              </Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="Enter roll number (1-60) or 'tutor'"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
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
            <p>Student: Roll number 1-60, Password: pass123</p>
            <p>Tutor: Username: tutor, Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};