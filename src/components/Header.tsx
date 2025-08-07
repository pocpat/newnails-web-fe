import React, { useState, useRef, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion'; 
import './Header.css';
import { Colors } from '../lib/colors';
import { useLoginModal } from '../lib/LoginModalContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { setIsLoginModalOpen } = useLoginModal();
  const navigate = useNavigate();

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
      await signOut(auth);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

   const handleLoginClick = () => {
    setIsLoginModalOpen(true); // <--- OPEN THE MODAL
    setIsMenuOpen(false);     // Close the dropdown menu
  };


  return (
   
    <header className="header">
      <Link to="/" className="header-logo" style={{ color: Colors.teal }}>DiPSY</Link>
      
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
      </div>
    </header>
  );
};

export default Header;


