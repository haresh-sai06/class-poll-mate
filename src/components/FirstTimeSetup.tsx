import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { completeUserSetup, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface FirstTimeSetupProps {
  user: User;
  onSetupComplete: (updatedUser: User) => void;
}

export const FirstTimeSetup = ({ user, onSetupComplete }: FirstTimeSetupProps) => {
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetup = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const success = completeUserSetup(user.rollNumber, name.trim(), newPassword);
      
      if (success) {
        const updatedUser: User = {
          ...user,
          name: name.trim(),
          password: newPassword,
          hasCompletedSetup: true,
        };
        
        onSetupComplete(updatedUser);
        toast({
          title: "Setup Complete",
          description: "Your account has been set up successfully!",
        });
      } else {
        toast({
          title: "Setup Failed",
          description: "Failed to complete setup. Please try again.",
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
            <span className="text-2xl font-bold text-primary-foreground">👋</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to SKCT Poll System
          </CardTitle>
          <p className="text-muted-foreground">
            Please complete your profile setup
          </p>
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p><strong>Roll Number:</strong> {user.rollNumber}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Create a new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
              />
            </div>
          </div>

          <Button
            onClick={handleSetup}
            disabled={isLoading}
            className="w-full"
            variant="mobile"
          >
            {isLoading ? 'Setting up...' : 'Complete Setup'}
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            This is a one-time setup. You can change your password later in the dashboard.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};