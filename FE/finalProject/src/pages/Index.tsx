import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page on app start
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="starfield"></div>
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-4">
          Petualangan Informatika
        </h1>
        <p className="text-xl text-muted-foreground">Redirecting to your cosmic adventure...</p>
      </div>
    </div>
  );
};

export default Index;
