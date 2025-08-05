import React from 'react';
import { Colors } from '../lib/colors';

// Helper to determine if a color is light or dark for text contrast
const isColorLight = (hex: string) => {
  const color = hex.charAt(0) === '#' ? hex.substring(1, 7) : hex;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

interface StyledButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  icon?: string;
}

const StyledButton: React.FC<StyledButtonProps> = ({ onPress, title, disabled, loading, backgroundColor, icon }) => {
  const buttonColor = backgroundColor || Colors.solidTeal;
  const textColor = backgroundColor && !isColorLight(backgroundColor) ? Colors.white : Colors.darkCherry;

  // Base styles that don't depend on props
  const baseStyles: { [key: string]: React.CSSProperties } = {
    button: {
      width: '120px',
      height: '140px',
      padding: '15px',
      border: `1px solid ${Colors.lightGray2}`,
      borderRadius: '20px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'Inter, sans-serif',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    buttonText: {
      fontSize: '1rem',
      fontWeight: '600',
      marginTop: '5px',
      textAlign: 'center',
    },
    icon: {
      width: '60px',
      height: '60px',
      objectFit: 'contain',
    },
    spinner: {
      border: `4px solid ${Colors.lightGray}`,
      borderLeftColor: Colors.indigo,
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      animation: 'spin 1s linear infinite',
    },
  };

  // Dynamic styles that depend on props
  const buttonDynamicStyle = {
    ...baseStyles.button,
    backgroundColor: buttonColor,
    ...(disabled && baseStyles.disabledButton),
  };

  const textDynamicStyle = {
    ...baseStyles.buttonText,
    color: textColor,
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      style={buttonDynamicStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      {loading ? (
        <div style={baseStyles.spinner} />
      ) : (
        <>
          {icon && <img src={icon} alt={`${title} icon`} style={baseStyles.icon} />}
          <span style={textDynamicStyle}>{title}</span>
        </>
      )}
    </button>
  );
};

export default StyledButton;
