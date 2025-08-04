
import React, { useRef, useEffect } from 'react';
import iro from '@jaames/iro';

interface IroColorPickerProps {
  color: string;
  onColorChange: (color: iro.Color) => void;
}

const IroColorPicker: React.FC<IroColorPickerProps> = ({ color, onColorChange }) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorPickerInstance = useRef<iro.ColorPicker | null>(null);

  useEffect(() => {
    if (pickerRef.current && !colorPickerInstance.current) {
      const newColorPicker = new (iro.ColorPicker as any)(pickerRef.current as HTMLElement, {
        width: 280,
        color: color,
        borderWidth: 1,
        borderColor: '#fff',
        layout: [
          {
            component: iro.ui.Wheel,
          },
        ],
      });

      newColorPicker.on('color:change', onColorChange);
      colorPickerInstance.current = newColorPicker;

      // Return a cleanup function to remove the event listener when the component unmounts.
      return () => {
        newColorPicker.off('color:change', onColorChange);
      };
    }
  }, [onColorChange, color]); // Keeping `color` in case the initial color prop can change.

  useEffect(() => {
    if (colorPickerInstance.current) {
      colorPickerInstance.current.color.hexString = color;
    }
  }, [color]);

  return <div ref={pickerRef} />;
};

export default IroColorPicker;
