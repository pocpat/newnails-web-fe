import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

// It's good practice to define styles in a separate object or file.
// This keeps the JSX clean and makes the styles easier to manage.
const styles = `
  .welcome-container {
    display: flex;
    width: 100%;
    height: 100%;
    font-family: 'Poppins', 'Inter', 'Helvetica Neue', sans-serif; /* Modern, clean font */
    color: #333;
    overflow: hidden; /* Prevents scrollbars on the main view */
    flex-grow: 1;
  }

  .left-pane {
    flex: 1.2; /* Give it slightly more space than the right pane */
    background-image: url('/bg1.png'); /* Assumes bg1.png is in the /public folder */
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .hero-image {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    /* Optional: Add a subtle drop shadow to make it pop */
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2));
  }

  .right-pane {
    flex: 1;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    position: relative; /* Needed for positioning the menu icon */
    text-align: center;
  }

  .menu-icon {
    position: absolute;
    top: 25px;
    right: 25px;
    font-size: 24px;
    letter-spacing: 3px;
    color: #87CEEB; /* A light sky blue, similar to the image */
    cursor: pointer;
  }

  .subheading-light {
    color: #b0b0b0;
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }

  .main-heading {
    font-size: 4.5rem; /* Large and impactful */
    font-weight: 700;
    margin: 10px 0;
    color: #1a1a1a;
  }
  
  .font-preview {
    font-size: 3rem;
    color: #f0f0f0; /* Very light grey */
    margin: 0 0 2rem 0;
  }

  .subheading-dark {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  .start-button {
    background-color: #5D3A67; /* Eyedropped from your image */
    color: white;
    border: none;
    border-radius: 50px; /* Fully rounded ends */
    padding: 14px 45px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 2rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-transform: uppercase;
  }

  .start-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(93, 58, 103, 0.4);
  }

  .start-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  /* Responsive Design for Mobile */
  @media (max-width: 768px) {
    .welcome-container {
      flex-direction: column; /* Stack the panes vertically */
    }
    .left-pane {
      flex: 1;
      min-height: 40vh; /* Give image some space */
    }
    .right-pane {
      flex: 1;
      justify-content: flex-start; /* Align content to top */
      padding-top: 4rem;
    }
    .main-heading {
      font-size: 3rem;
    }
  }
`;

const WelcomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // This single handler now correctly routes the user based on auth state.
  // If they are logged in, they go to /design. If not, they go to /login.
  const handleStart = () => {
    if (user) {
      navigate('/design');
    } else {
      navigate('/login');
    }
  };

  // The loading state is important to prevent users from clicking before
  // the app knows if they are logged in or not.
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a nice spinner later
  }

  return (
    <>
      {/* This injects our CSS into the page. */}
      <style>{styles}</style>
      
      <div className="welcome-container">
        <div className="left-pane">
          <img src="/hero-img.png" alt="Floral nail art design" className="hero-image" />
        </div>
        
        <div className="right-pane">
        
          
          <p className="subheading-light">Create unique designs</p>
          <h1 className="main-heading">DiPSY</h1>
          <p className="font-preview">abcde</p>
          <p className="subheading-dark">Your creative journey starts here</p>

          {/* The button's text is always "START" to match the design.
              The onClick handler cleverly decides where to go.
              It's disabled during the initial auth check. */}
          <button onClick={handleStart} disabled={loading} className="start-button">
            Start
          </button>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;