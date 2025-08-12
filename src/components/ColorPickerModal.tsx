import React from 'react';
import IroColorPicker from './IroColorPicker';
import StyledButton from './StyledButton';

interface ColorPickerModalProps {
  isVisible: boolean;
  //onSelectColor: (hex: string) => void;
 onSelectColor: () => void;
  onClose: () => void;
  currentColor: string;
  onColorChange: (color: any) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ isVisible, onSelectColor, onClose, currentColor, onColorChange }) => {
  //const [color, setColor] = useState('#b3e5fc');



  const handleOkClick = () => {
    onSelectColor();
  
  };

  if (!isVisible) {
    return null;
  }

  const styles = {
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      gap: '20px',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
 <IroColorPicker 
          color={currentColor} 
          onColorChange={onColorChange} // Pass the raw function down
        /> 
        <StyledButton title="OK" onPress={handleOkClick} />
      </div>
    </div>
  );
};

export default ColorPickerModal;
