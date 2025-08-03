import React, { useRef, useEffect } from 'react';
import iro from '@jaames/iro';
import type { ColorPicker } from '@jaames/iro';

interface IroColorPickerProps {
  color: string;
  onColorChange: (color: any) => void;
}

const IroColorPicker: React.FC<IroColorPickerProps> = ({ color, onColorChange }) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorPickerInstance = useRef<ColorPicker | null>(null);

  useEffect(() => {
    if (pickerRef.current && !colorPickerInstance.current) {
      colorPickerInstance.current = new iro.ColorPicker(pickerRef.current, {
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

      colorPickerInstance.current.on('color:change', onColorChange);
    }
  }, [color, onColorChange]);

  useEffect(() => {
    if (colorPickerInstance.current) {
      colorPickerInstance.current.color.hexString = color;
    }
  }, [color]);

  return <div ref={pickerRef} />;
};

export default IroColorPicker;
