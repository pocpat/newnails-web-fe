import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Colors } from '../lib/colors';
import React, { useState } from 'react';
import FixedSizePageLayout from '../../src/components/FixedSizePageLayout';

  import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useLoginModal } from '../lib/LoginModalContext'; 
// It's good practice to define styles in a separate object or file.
// This keeps the JSX clean and makes the styles easier to manage.
const styles = `
  .welcome-container {
    display: flex;
    width: 100%;
    height: 100%;
    font-family: 'Inter', 'Helvetica Neue', sans-serif; /* Modern, clean font */
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
    color: ${Colors.solidTeal}; /* A light sky blue, similar to the image */
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
    font-family: 'PottaOne', sans-serif;
    font-size: 4.5rem; /* Large and impactful */
    font-weight: 700;
    margin: 10px 0 20rem 0;
    color: #1a1a1a;
    position: relative;
    line-height: 0.9;
    color: ${Colors.darkCherry}; 
  }
  
  .main-heading::after {
  /* This grabs the text from the 'data-content' attribute we added in the HTML */
  content: attr(data-content); 

  /* Positioning */
  position: absolute;
  left: 0;
  right: 0;
  top: 100%; /* Place it right below the original text */
  
  /* The upside-down transformation */
  transform: scaleY(-1);
  
  /* The visual styling for the reflection */
  background: linear-gradient(
    to bottom,
    rgba(30, 30, 30, 0) 0%,  /* Starts semi-transparent dark grey */
     rgba(30, 30, 30, 0.15) 90%     /* Fades to fully transparent */
  );
  -webkit-background-clip: text; /* Clips the background to the text shape */
  background-clip: text;
  color: transparent; /* Makes the original text color transparent to show the background */
  
  /* Prevents user from selecting the reflection text */
  user-select: none; 
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

  .button-container {
    display: flex;
    justify-content: center;
    gap: 1rem; /* Creates space between the buttons */
    margin-top: 2rem;
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
    margin-top: 0;
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
      font-size: 4.5rem;
      color:#5f2461; 
    }
  }
`;

const WelcomePage = () => {
  const { user, loading } = useAuth();
  const { setIsLoginModalOpen } = useLoginModal();
  const navigate = useNavigate();




const handleLogout = async () => {
  try {
    await signOut(auth);
   // navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};



  // This single handler now correctly routes the user based on auth state.
  // If they are logged in, they go to /design. If not, they go to /login.
  const handleStart = () => {
   
      navigate('/design');
   
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
      <FixedSizePageLayout>
      <div className={`welcome-container `}>
        <div className="left-pane">
          <img src="/hero-img.png" alt="Floral nail art design" className="hero-image" />
        </div>
        
        <div className="right-pane">
        
          
          <p className="subheading-light">Create unique designs</p>
          <h1 className="main-heading" data-content="DiPSY">DiPSY</h1>
 

          <p className="subheading-dark">Your creative journey starts here</p>

         

{/* START button: Disabled if not logged in, otherwise navigates to design or opens modal */}
<div className="button-container">
  {/* START button: Now disabled if no user OR loading */}
  <button
    onClick={handleStart}
    disabled={!user || loading}
    className="start-button"
  >
    Start
  </button>

  {/* LOGIN/LOGOUT Button */}
  {user ? (
    <button
      onClick={handleLogout}
      className="start-button" // You can create a different class for this if you want
    >
      Logout
    </button>
  ) : (
    <button
      onClick={() => setIsLoginModalOpen(true)}
      disabled={loading}
      className="start-button"
    >
      Login
    </button>
  )}
</div>



  </div>
  </div>
  </FixedSizePageLayout>
    </>
  );
};

export default WelcomePage;