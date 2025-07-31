import React, { useState } from 'react';

interface ColorPickerModalProps {
  isVisible: boolean;
  onSelectColor: (hex: string) => void;
  onClose: () => void;
}

const Colors = {
  white: '#FFFFFF',
  black: '#000000',
  blue: '#007BFF',
  red: '#DC3545',
};

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ isVisible, onSelectColor, onClose }) => {
  const [currentColor, setCurrentColor] = useState(Colors.white);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
  };

  const handleSelect = () => {
    onSelectColor(currentColor);
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  const styles: { [key: string]: React.CSSProperties } = {
    centeredView: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
    },
    modalView: {
      margin: '20px',
      borderRadius: '20px',
      padding: '35px',
      alignItems: 'center',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
      elevation: 5, // For Android shadow equivalent
      width: '80%',
      maxWidth: '400px', // Added max-width for better desktop experience
      backgroundColor: currentColor, // Background color changes with selected color
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: Colors.black, // Ensure text is visible on changing background
    },
    colorInput: {
      width: '100px',
      height: '100px',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      marginBottom: '20px',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '20px',
    },
    button: {
      borderRadius: '20px',
      padding: '10px',
      elevation: 2, // For Android shadow equivalent
      backgroundColor: Colors.blue,
      margin: '0 10px',
      border: 'none',
      cursor: 'pointer',
      color: Colors.white,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: Colors.red,
    },
  };

  return (
    <div style={styles.centeredView}>
      <div style={styles.modalView}>
        <h2 style={styles.modalTitle}>Pick a Base Color</h2>
        <input
          type="color"
          value={currentColor}
          onChange={handleColorChange}
          style={styles.colorInput}
        />
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleSelect}>
            Select Color
          </button>
          <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal;