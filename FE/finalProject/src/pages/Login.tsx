import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Rocket, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import cosmicHero from '@/assets/cosmic-hero.jpg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse(formData);
      const { error } = await signIn(validatedData.email, validatedData.password);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message === "Invalid login credentials" 
            ? "Invalid email or password" 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Starfield Background */}
      <div className="starfield"></div>
      
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${cosmicHero})` }}
      />
      
      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="mission-card glow-purple p-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center mb-4">
              <Rocket className="w-8 h-8 text-background" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
              Petualangan Informatika
            </h1>
            <p className="text-muted-foreground">
              Welcome to Informatics Adventure
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1 text-left">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input-cosmic pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive pl-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1 text-left">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="input-cosmic pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground hover:text-neon-cyan transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground hover:text-neon-cyan transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive pl-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-neon w-full py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Start Adventure"}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 space-y-3">
            <Link 
              to="/register"
              className="block text-neon-cyan hover:text-neon-cyan-glow transition-colors text-sm"
            >
              Create New Account
            </Link>
            <div className="text-muted-foreground text-sm">
              <Link 
                to="/forgot-password"
                className="hover:text-neon-magenta transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
