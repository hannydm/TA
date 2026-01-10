import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Rocket, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    nisn: "",
    kelas: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, profile } = useAuth();

  useEffect(() => {
    if (profile) {
      navigate("/dashboard");
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = registerSchema.parse(formData);
      const { error } = await signUp(
        validatedData.email,
        validatedData.password,
        validatedData.username,
        validatedData.nisn,
        validatedData.kelas
      );

      if (error) {
        toast({
          title: "Pendaftaran Gagal",
          description: error.message || "Terjadi kesalahan saat membuat akun.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Selamat datang!",
          description: "Akun kamu berhasil dibuat. Silakan masuk untuk memulai petualangan.",
        });
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<RegisterFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/10 via-background to-background"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-8 mission-card">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta animate-pulse">
              <Rocket className="w-10 h-10 text-background" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
              Bergabung dalam Petualangan
            </h1>
            <p className="text-muted-foreground">
              Buat akunmu dan mulai menjelajahi dunia informatika
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Nama pengguna
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Pilih nama pengguna"
                  className="pl-10 bg-background/50 border-border"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email kamu"
                  className="pl-10 bg-background/50 border-border"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="nisn" className="text-sm font-medium text-foreground">
                NISN
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="nisn"
                  type="text"
                  placeholder="Masukkan NISN kamu"
                  className="pl-10 bg-background/50 border-border"
                  value={formData.nisn}
                  onChange={(e) =>
                    setFormData({ ...formData, nisn: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              {errors.nisn && (
                <p className="text-sm text-destructive">{errors.nisn}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="kelas" className="text-sm font-medium text-foreground">
                Kelas
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <select
                  id="kelas"
                  className="pl-10 flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.kelas}
                  onChange={(e) =>
                    setFormData({ ...formData, kelas: e.target.value })
                  }
                  disabled={isLoading}
                >
                  <option value="" disabled>Pilih Kelas</option>
                  {['XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK'].map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
              {errors.kelas && (
                <p className="text-sm text-destructive">{errors.kelas}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Kata sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat kata sandi"
                  className="pl-10 pr-10 bg-background/50 border-border"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password minimal 8 karakter, mengandung huruf besar, angka, dan simbol (misalnya ! @ #)
              </p>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Konfirmasi kata sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi"
                  className="pl-10 pr-10 bg-background/50 border-border"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Membuat akun..." : "Buat Akun"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Sudah punya akun? </span>
              <Link
                to="/login"
                className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
              >
                Masuk di sini
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
