import { useEffect } from 'react';
import { Zap } from 'lucide-react';

interface XPToastProps {
  amount: number;
  onComplete: () => void;
}

const XPToast = ({ amount, onComplete }: XPToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-500">
      <div className="flex items-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/50 backdrop-blur-md glow-cyan">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center animate-pulse">
          <Zap className="w-5 h-5 text-background" />
        </div>
        <div>
          <p className="font-bold text-neon-cyan">+{amount} XP Gained!</p>
          <p className="text-sm text-muted-foreground">Keep exploring, space cadet!</p>
        </div>
      </div>
    </div>
  );
};

export default XPToast;