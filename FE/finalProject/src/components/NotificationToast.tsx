import { useEffect } from 'react';
import { Trophy, Award, X } from 'lucide-react';

interface NotificationToastProps {
    type: 'levelup' | 'badge';
    title: string;
    message: string;
    onClose: () => void;
}

const NotificationToast = ({ type, title, message, onClose }: NotificationToastProps) => {
    useEffect(() => {
        // Play different sounds for level up vs badge
        try {
            if (typeof window !== 'undefined' && 'AudioContext' in window) {
                const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type === 'levelup' ? 'sawtooth' : 'square';
                const baseFreq = type === 'levelup' ? 660 : 520;
                osc.frequency.value = baseFreq;
                osc.connect(gain);
                gain.connect(ctx.destination);

                const now = ctx.currentTime;
                gain.gain.setValueAtTime(0.25, now);
                // small upward sweep
                osc.frequency.linearRampToValueAtTime(baseFreq + 200, now + 0.25);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch {
            // ignore audio errors
        }

        const timer = setTimeout(onClose, 5000); // Auto close after 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-500">
            <div className={`flex items-start space-x-4 px-6 py-4 rounded-xl border backdrop-blur-md shadow-2xl max-w-sm ${type === 'levelup'
                    ? 'bg-gradient-to-br from-neon-cyan/20 to-blue-600/20 border-neon-cyan/50 glow-cyan'
                    : 'bg-gradient-to-br from-neon-magenta/20 to-purple-600/20 border-neon-magenta/50 glow-purple'
                }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${type === 'levelup'
                        ? 'bg-gradient-to-br from-neon-cyan to-blue-500'
                        : 'bg-gradient-to-br from-neon-magenta to-purple-500'
                    }`}>
                    {type === 'levelup' ? (
                        <Trophy className="w-6 h-6 text-white animate-bounce" />
                    ) : (
                        <Award className="w-6 h-6 text-white animate-pulse" />
                    )}
                </div>

                <div className="flex-1">
                    <h4 className={`font-bold text-lg mb-1 ${type === 'levelup' ? 'text-neon-cyan' : 'text-neon-magenta'
                        }`}>
                        {title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {message}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
