import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      navigate('/'); // Redirect to welcome page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>Tipsy</Link>
      <div style={styles.menuContainer}>
        <button aria-label="menu" onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuToggle}>
          <div style={styles.menuIcon}>
            <div style={styles.menuDot}></div>
            <div style={styles.menuDot}></div>
            <div style={styles.menuDot}></div>
          </div>
        </button>
        {isMenuOpen && (
          <div style={styles.menu}>
            {user ? (
              <>
                <Link to="/my-designs" style={styles.menuLink} onClick={() => setIsMenuOpen(false)}>My Designs</Link>
                <Link to="/design" style={styles.menuLink} onClick={() => setIsMenuOpen(false)}>Start Over</Link>
                <button onClick={handleLogout} style={styles.menuButton as React.CSSProperties}>Logout</button>
              </>
            ) : (
              <Link to="/login" style={styles.menuLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// Basic styling to make the component functional
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#333',
    color: 'white',
  },
  logo: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '1.5rem',
  },
  menuContainer: {
    position: 'relative',
  },
  menuToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  menuIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '20px', // Height of the icon container
  },
  menuDot: {
    width: '4px',
    height: '4px',
    backgroundColor: 'white',
    borderRadius: '50%',
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
  },
  menuLink: {
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    color: 'black',
    display: 'block',
  },
  menuButton: {
    padding: '0.5rem 1rem',
    color: 'black',
    display: 'block',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '1rem', // Ensure font size is consistent
  },
};

export default Header;
