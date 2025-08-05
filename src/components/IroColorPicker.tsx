import React, { useEffect, useRef } from 'react';
import iro from '@jaames/iro'; // Make sure you've installed this: npm install @jaames/iro

interface IroColorPickerProps {
  color: string;
  onColorChange: (color: any) => void; // Keeping 'any' to match your existing code
}

const IroColorPicker: React.FC<IroColorPickerProps> = ({ color, onColorChange }) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorPickerInstance = useRef<iro.ColorPicker | null>(null);

  useEffect(() => {
    // Check if the picker element exists and an instance hasn't been created yet
    if (pickerRef.current && !colorPickerInstance.current) {
      // Create the color picker instance
      const newPicker = new (iro.ColorPicker as any)(pickerRef.current, {
        width: 280,
        color: color, // Initialize with the color from props
        borderWidth: 1,
        borderColor: '#fff',
      });

      // --- THIS IS THE MOST IMPORTANT PART ---
      // Set up the event listener to call the onColorChange prop
      // whenever the user interacts with the color wheel.
      newPicker.on('color:change', (newColor: iro.Color) => {
        // This calls the setTempColor function in the parent component
        onColorChange(newColor);
      });

      // Store the instance in a ref so it persists across renders
      colorPickerInstance.current = newPicker;
    }

    // This is the cleanup function. It runs when the component unmounts.
    // It's important for preventing memory leaks.
    return () => {
      // We don't need to destroy the picker here if we only create it once,
      // but it's good practice. For now, we'll keep it simple.
    };
  }, []); // The empty dependency array [] ensures this runs only once when the component mounts

  // A second effect to handle updates to the color from props
  useEffect(() => {
    // If the instance exists and the prop color is different, update the picker
    if (colorPickerInstance.current && colorPickerInstance.current.color.hexString !== color) {
      colorPickerInstance.current.color.set(color);
    }
  }, [color]); // This effect runs whenever the 'color' prop changes

  return <div ref={pickerRef} />;
};

export default IroColorPicker;