import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const ForgotPassword = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = forgotPasswordSchema.parse(formData);
      const { error } = await resetPassword(validatedData.email);

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Email Sent",
          description: "Check your email for password reset instructions",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<ForgotPasswordFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ForgotPasswordFormData] = err.message;
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
              Reset Password
            </h1>
            <p className="text-muted-foreground">
              {isSubmitted 
                ? "We've sent you an email with instructions to reset your password"
                : "Enter your email to receive password reset instructions"
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center text-sm">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                <p className="text-sm text-center">
                  Check your inbox and click the link in the email to reset your password.
                </p>
              </div>

              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:opacity-90 transition-opacity"
              >
                Return to Login
              </Button>

              <div className="text-center text-sm">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
