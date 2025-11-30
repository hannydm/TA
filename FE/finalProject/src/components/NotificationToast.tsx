import { useEffect, useState } from 'react';
import { Trophy, Award, X } from 'lucide-react';

interface NotificationToastProps {
    type: 'levelup' | 'badge';
    title: string;
    message: string;
    onClose: () => void;
    duration?: number; // durasi tampil
}

const NotificationToast = ({
    type,
    title,
    message,
    onClose,
    duration = 5000
}: NotificationToastProps) => {

    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        // Play audio
        const audio = new Audio(
            'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=success-fanfare-trumpets-6185.mp3'
        );
        audio.volume = 0.5;
        audio.play().catch(() => { });

        // Start fade-out 400ms sebelum close
        const fadeTimer = setTimeout(() => {
            setExiting(true);
        }, duration - 400);

        // Close setelah durasi lengkap
        const closeTimer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(closeTimer);
        };
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-24 right-6 z-50 transition-all duration-500 
            ${exiting ? 'opacity-0 translate-x-3' : 'opacity-100 translate-x-0'}
            `}
        >
            <div
                className={`flex items-start space-x-4 px-6 py-4 rounded-xl border 
                backdrop-blur-md shadow-2xl max-w-sm
                ${type === 'levelup'
                        ? 'bg-gradient-to-br from-neon-cyan/20 to-blue-600/20 border-neon-cyan/50 glow-cyan'
                        : 'bg-gradient-to-br from-neon-magenta/20 to-purple-600/20 border-neon-magenta/50 glow-purple'
                    }`}
            >
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
                    ${type === 'levelup'
                            ? 'bg-gradient-to-br from-neon-cyan to-blue-500'
                            : 'bg-gradient-to-br from-neon-magenta to-purple-500'
                        }`}
                >
                    {type === 'levelup' ? (
                        <Trophy className="w-6 h-6 text-white animate-bounce" />
                    ) : (
                        <Award className="w-6 h-6 text-white animate-pulse" />
                    )}
                </div>

                <div className="flex-1">
                    <h4
                        className={`font-bold text-lg mb-1 
                        ${type === 'levelup' ? 'text-neon-cyan' : 'text-neon-magenta'}`}
                    >
                        {title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {message}
                    </p>
                </div>

                <button
                    onClick={() => {
                        setExiting(true);
                        setTimeout(onClose, 400);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
