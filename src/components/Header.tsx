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
        <button aria-label="menu" onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuButton}>
          {/* Using a simple icon for now */}
          &#x22EE;
        </button>
        {isMenuOpen && (
          <div style={styles.menu}>
            {user ? (
              <>
                <Link to="/my-designs" style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>My Designs</Link>
                <Link to="/design" style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Start Over</Link>
                <button onClick={handleLogout} style={styles.menuItem}>Logout</button>
              </>
            ) : (
              <Link to="/login" style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>Login</Link>
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
  menuButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
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
  menuItem: {
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    color: 'black',
    display: 'block',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
  },
};

export default Header;
