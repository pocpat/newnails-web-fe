import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const WelcomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    // Navigate to the design page only if the user is authenticated
    if (user) {
      navigate('/design');
    } else {
      // This case should ideally not be hit if the button is disabled, but as a fallback
      navigate('/login');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  // Display a loading indicator while Firebase auth state is being determined
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {user ? (
        <button onClick={handleStart} disabled={loading}>
          Start
        </button>
      ) : (
        <button onClick={handleSignIn} disabled={loading}>
          Sign In / Sign Up
        </button>
      )}
    </div>
  );
};

export default WelcomePage;
