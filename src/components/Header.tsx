import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import './Header.css';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    // 2. USE `className` ATTRIBUTES IN YOUR JSX
    <header className="header">
      <Link to="/" className="header-logo">DiPSY</Link>
      
      <div className="header-menu-container">
        <button 
          aria-label="header-menu" 
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="header-menu-toggle"
        >
          <div className="header-menu-icon">
            <div className="header-menu-dot"></div>
            <div className="header-menu-dot"></div>
            <div className="header-menu-dot"></div>
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
                <Link to="/login" className="header-menu-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;


