import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const WelcomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleStart = () => {
    navigate('/design');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div>
      {user ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <button onClick={handleSignIn}>Sign In / Sign Up</button>
      )}
    </div>
  );
};

export default WelcomePage;
