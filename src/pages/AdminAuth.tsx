import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Shield, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in localStorage temporarily (in production, use more secure method)
    localStorage.setItem('adminOtp', generatedOtp);
    localStorage.setItem('adminOtpExpiry', (Date.now() + 300000).toString()); // 5 minutes
    
    try {
      // Send OTP via edge function
      const { error } = await supabase.functions.invoke('send-admin-otp', {
        body: { 
          email: 'sohamlkulk@gmail.com',
          otp: generatedOtp
        }
      });

      if (error) throw error;
      
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code."
      });
      
      setOtpSent(true);
      setShowOtpField(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username !== 'admin') {
      toast({
        title: "Invalid Credentials",
        description: "Invalid username",
        variant: "destructive"
      });
      return;
    }

    if (password !== 'Admin@1212') {
      toast({
        title: "Invalid Credentials", 
        description: "Invalid password",
        variant: "destructive"
      });
      return;
    }

    if (!showOtpField) {
      setLoading(true);
      await sendOtp();
      setLoading(false);
      return;
    }

    // Verify OTP
    const storedOtp = localStorage.getItem('adminOtp');
    const otpExpiry = localStorage.getItem('adminOtpExpiry');
    
    if (!storedOtp || !otpExpiry || Date.now() > parseInt(otpExpiry)) {
      toast({
        title: "OTP Expired",
        description: "Please request a new OTP",
        variant: "destructive"
      });
      setShowOtpField(false);
      setOtpSent(false);
      localStorage.removeItem('adminOtp');
      localStorage.removeItem('adminOtpExpiry');
      return;
    }

    if (otp !== storedOtp) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive"
      });
      return;
    }

    // Clear OTP from storage
    localStorage.removeItem('adminOtp');
    localStorage.removeItem('adminOtpExpiry');
    
    // Set admin session
    localStorage.setItem('adminSession', 'true');
    localStorage.setItem('adminSessionExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString()); // 24 hours
    
    toast({
      title: "Admin Login Successful",
      description: "Welcome to the admin portal"
    });
    
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      <Card className="w-full max-w-md gradient-card border-border/20 shadow-card relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent font-bold">
              Admin Portal
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Secure admin access to user management
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background/50 border-border transition-smooth focus:shadow-glow"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-border transition-smooth focus:shadow-glow"
              />
            </div>
            
            {showOtpField && (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="bg-background/50 border-border transition-smooth focus:shadow-glow"
                />
                <p className="text-xs text-muted-foreground">
                  OTP sent to sohamlkulk@gmail.com
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full gradient-primary transition-smooth hover:shadow-glow" 
              disabled={loading}
            >
              {loading ? "Sending OTP..." : showOtpField ? "Verify & Login" : "Send OTP"}
            </Button>
            
            {otpSent && !showOtpField && (
              <p className="text-sm text-center text-muted-foreground">
                OTP has been sent to your email
              </p>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-muted-foreground hover:text-foreground"
            >
              Back to User Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}