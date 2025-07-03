
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Logo from '@/components/Logo';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LoginProps {
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'wholesaler' | 'retailer' | 'admin'>('wholesaler');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ username, password, role: selectedRole });
      toast({
        title: "Login successful!",
        description: "Welcome back to Big Game Logistics"
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials. Please check your username and password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (role: 'wholesaler' | 'retailer' | 'admin') => {
    setSelectedRole(role);
    setUsername(`${role}_demo`);
    setPassword('biggame123');
  };

  return (
    <div className="min-h-screen gradient-blue flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back Button */}
        <Button 
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-bgl-yellow-400 mb-2">
            Hi !<br />
            Welcome Back,
          </h1>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-4">
            <Logo className="mx-auto mb-4" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Select Your Role:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['wholesaler', 'retailer', 'admin'] as const).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={selectedRole === role ? "default" : "outline"}
                    className={`text-xs py-2 capitalize ${
                      selectedRole === role 
                        ? 'bg-bgl-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setDemoCredentials(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Input */}
              <div>
                <Input
                  type="text"
                  placeholder="Username, Email or Phone Number"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none px-0 py-3 placeholder:text-gray-400 focus:border-bgl-blue-600"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none px-0 py-3 pr-10 placeholder:text-gray-400 focus:border-bgl-blue-600"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember Me
                  </label>
                </div>
                <Button variant="link" className="text-sm text-gray-600 p-0 h-auto">
                  Forgot Password?
                </Button>
              </div>

              {/* Login Button */}
              <Button 
                type="submit"
                className="w-full bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900 font-bold py-3 text-lg rounded-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting to WordPress...' : 'LOGIN'}
              </Button>
            </form>

            {/* Social Login */}
            <div className="space-y-3">
              <Button 
                type="button"
                variant="outline"
                className="w-full py-2 text-sm"
                onClick={() => toast({ title: "Google login coming soon!" })}
              >
                Continue with Google
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="w-full py-2 text-sm"
                onClick={() => toast({ title: "Facebook login coming soon!" })}
              >
                Continue with Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="text-bgl-yellow-600 font-semibold p-0 h-auto"
                  onClick={() => toast({ title: "Registration coming soon!" })}
                >
                  Sign up
                </Button>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-white/10 rounded-lg text-white text-sm">
          <p className="font-semibold mb-2">WordPress Integration Active:</p>
          <div className="space-y-1 text-xs">
            <p>• Backend: school.nhaka.online/connect/</p>
            <p>• API: WordPress REST API + Custom BGL endpoints</p>
            <p>• Authentication: JWT tokens</p>
            <p>• Use your WordPress user credentials to login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
