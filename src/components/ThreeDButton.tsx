import React from 'react';
import { Colors } from '../lib/colors';


interface ThreeDButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  icon?: string;
}
const ThreeDButton: React.FC<ThreeDButtonProps> = ({ onPress, title, disabled, loading, backgroundColor, icon }) => {
  const buttonColor = backgroundColor || Colors.solidTeal;

  const styles: { [key: string]: React.CSSProperties } = {
    buttonContainer: {
      display: 'block',
      margin: '20px auto 0 auto',
      borderRadius: '30px',
      backgroundColor: buttonColor,
      boxShadow: `6px 6px 10px ${Colors.mediumGray}`,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      border: 'none',
      outline: 'none',
      padding: 0,
      width: '120px',
    },
    disabledButton: {
      opacity: 0.6,
    },
    buttonInner: {
      padding: '20px 15px',
      borderRadius: '30px',
      backgroundColor: buttonColor,
      boxShadow: `-6px -6px 10px ${Colors.white}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    buttonText: {
      fontSize: '16px',
      fontFamily: 'Inter-Bold', // Ensure this font is loaded
      color: Colors.indigo,
      marginTop: '5px',
    },
    icon: {
        width: '80px',
        height: '80px',
        objectFit: 'contain',
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
            <>
            {icon && <img src={icon} alt="" style={styles.icon} />}
            <span style={styles.buttonText}>{title}</span>
          </>
        )}
      </div>
    </button>
  );
};

export default ThreeDButton;