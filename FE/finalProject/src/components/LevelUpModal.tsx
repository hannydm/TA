import { useEffect } from 'react';
import { Trophy, Sparkles } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

const LevelUpModal = ({ newLevel, onClose }: LevelUpModalProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="relative">
        {/* Cosmic burst effect */}
        <div className="absolute inset-0 animate-ping">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta opacity-75"></div>
        </div>
        
        {/* Main modal */}
        <div className="relative mission-card level-up max-w-md mx-auto text-center p-8 glow-purple">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-background" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
              LEVEL UP!
            </h2>
            <p className="text-xl text-foreground">
              Welcome to Level <span className="font-bold text-neon-cyan">{newLevel}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-6">
            <Sparkles className="w-4 h-4 text-neon-magenta" />
            <span className="text-sm">New challenges await, space explorer!</span>
            <Sparkles className="w-4 h-4 text-neon-cyan" />
          </div>
          
          <button
            onClick={onClose}
            className="btn-neon px-8 py-3"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;