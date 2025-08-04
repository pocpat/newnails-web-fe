import React from 'react';
import { Colors } from '../lib/colors';

const ThreeDButton: React.FC<ThreeDButtonProps> = ({ onPress, title, disabled, loading, backgroundColor }) => {
  const buttonColor = backgroundColor || Colors.solidTeal;

  const styles: { [key: string]: React.CSSProperties } = {
    buttonContainer: {
      display: 'block',
      margin: '30px auto 0 auto',
      borderRadius: '30px',
      backgroundColor: buttonColor,
      boxShadow: `6px 6px 10px ${Colors.mediumGray}`,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      border: 'none',
      outline: 'none',
      padding: 0,
    },
    disabledButton: {
      opacity: 0.6,
    },
    buttonInner: {
      padding: '15px 40px',
      borderRadius: '30px',
      backgroundColor: buttonColor,
      boxShadow: `-6px -6px 10px ${Colors.white}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: '18px',
      fontFamily: 'Inter-Bold', // Ensure this font is loaded
      color: Colors.indigo,
    },
    // Simple spinner for loading state
    spinner: {
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderLeftColor: Colors.indigo,
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      animation: 'spin 1s linear infinite',
    },
    // Keyframes for the spin animation (would typically be in a CSS file)
    // This is a simplified representation for inline styles
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      style={{
        ...styles.buttonContainer,
        ...(disabled && styles.disabledButton),
      }}
    >
      <div style={styles.buttonInner}>
        {loading ? (
          <div style={styles.spinner} /> // Simple spinner
        ) : (
          <span style={styles.buttonText}>{title}</span>
        )}
      </div>
    </button>
  );
};

export default ThreeDButton;