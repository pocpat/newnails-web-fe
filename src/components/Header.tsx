import React, { useState, useRef, useEffect  } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion'; 
import './Header.css';
import { Colors } from '../lib/colors';
import { useLoginModal } from '../lib/LoginModalContext';
import LogoSvg from '../assets/images/logo02.svg?react';



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { setIsLoginModalOpen } = useLoginModal();
  const navigate = useNavigate();

  // --- GET THE CURRENT LOCATION ---
  const location = useLocation();
  const { pathname } = location;

  // ---  CREATE A CONDITION VARIABLE FOR CLARITY ---
  // This will be true for the pages that need the "Start Over" button.
  const showStartOverButton = pathname === '/results' || pathname === '/my-designs';


  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  if (isMenuOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isMenuOpen]);


  const handleLogout = async () => {
    try {
       navigate('/');
       setIsMenuOpen(false);
      await signOut(auth);
      
     
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

   const handleLoginClick = () => {
    setIsLoginModalOpen(true); // <--- OPEN THE MODAL
    setIsMenuOpen(false);     // Close the dropdown menu
  };

 // --- CREATE A HANDLER FOR THE "START OVER" BUTTON ---
  const handleStartOver = () => {
    navigate('/design');
  };


  return (
   
    <header className="header">

{/* LEFT (LOGO) */}
<div className="header-left">
        <Link to="/">
        <LogoSvg className="header-logo-svg" />
        </Link>
      </div>      

{/*  MIDDLE (CONDITIONAL CONTENT) */}

<div className="header-middle">
        {showStartOverButton ? (
          <button onClick={handleStartOver} className="header-action-button">
            Start Over
          </button>
        ) : (
          <h1 className="header-title">DiPSY</h1>
        )}
      </div>

      {/* RIGHT (3-DOT MENU) */}

<div className="header-right">



       {/* Apply ref here to detect clicks outside the menu container */}
      <div className="header-menu-container" ref={menuRef}>
        <button 
          aria-label="header-menu" 
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="header-menu-toggle"
         
        >
          <div className="header-menu-icon">
            <div className="header-menu-dot" style={{ backgroundColor: Colors.teal }}></div>
            <div className="header-menu-dot" style={{ backgroundColor: Colors.teal }}></div>
            <div className="header-menu-dot" style={{ backgroundColor: Colors.teal }}></div>
          </div>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
            
              className="header-menu-dropdown" 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {user ? (
                <>
                  <Link to="/my-designs" className="header-menu-link" onClick={() => setIsMenuOpen(false)}>My Designs</Link>
                  <Link to="/design" className="header-menu-link" onClick={() => setIsMenuOpen(false)}>Start Over</Link>
                  <button onClick={handleLogout} className="header-menu-button">Logout</button>
                </>
              ) : (
<button className="header-menu-link header-menu-button" onClick={handleLoginClick}>Login</button> 
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div></div>
    </header>
  );
};

export default Header;
