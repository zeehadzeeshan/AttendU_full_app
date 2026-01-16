
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle2 } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setSelectedRole, isAuthenticated, role: userRole } = useAuth();
  const [role, setRole] = useState<string>("");

  // Effect: Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (userRole === 'teacher') navigate('/teacher/dashboard', { replace: true });
      else if (userRole === 'student') navigate('/student/attendance', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleContinue = () => {
    if (!role) return;

    if (role === 'admin') {
      setSelectedRole('admin');
      navigate('/admin/login');
    } else {
      setSelectedRole(role as 'student' | 'teacher');
      navigate('/auth');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col">
      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 100, 100, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 100, 100, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border border-white/10 bg-black/40 shadow-xl backdrop-blur-xl ring-1 ring-white/5">
            <CardHeader className="text-center space-y-2 pb-6 pt-8">

              <div className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base text-gray-400">
                  Please select your role to continue
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-300">
                  I am a...
                </label>
                <Select onValueChange={(value) => setRole(value)}>
                  <SelectTrigger className="h-12 border-white/10 bg-white/5 text-white text-base transition-all duration-200 hover:bg-white/10 focus:ring-2 focus:ring-indigo-500/50">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/95 backdrop-blur-xl">
                    <SelectItem value="student" className="h-10 cursor-pointer text-white hover:bg-white/10 focus:bg-white/10">
                      Student
                    </SelectItem>
                    <SelectItem value="teacher" className="h-10 cursor-pointer text-white hover:bg-white/10 focus:bg-white/10">
                      Teacher
                    </SelectItem>
                    <SelectItem value="admin" className="h-10 cursor-pointer text-white hover:bg-white/10 focus:bg-white/10">
                      Administrator
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full h-11 text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                size="lg"
                onClick={handleContinue}
                disabled={!role}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoleSelection;
