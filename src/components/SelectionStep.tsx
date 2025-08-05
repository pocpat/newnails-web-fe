import React from 'react';
import { motion } from 'framer-motion';
import StyledButton from './StyledButton';

interface SelectorOption {
  value: string;
  icon: string;
}

interface SelectionStepProps {
  options: SelectorOption[];
  onSelect: (value: string) => void;
  baseColor?: string | null;
  stepId?: string;
}

const SelectionStep: React.FC<SelectionStepProps> = ({ options, onSelect, baseColor, stepId }) => {
  // --- DEBUG LOG ---
  console.log('SelectionStep received baseColor:', baseColor);

  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap' as 'wrap',
      justifyContent: 'center',
      gap: '20px',
      maxWidth: '620px',
      margin: '0 auto',
    },
    disabledWrapper: {
        opacity: 0.5,
        cursor: 'not-allowed',
    }
  };

  return (
    <div style={styles.container}>
      {options.map((option, index) => {
        const isPickerButton = option.value === 'Pick a Base Color';
        const isPaletteButton = stepId === 'color' && !isPickerButton;
        const isPaletteDisabled = isPaletteButton && !baseColor;

        const button = (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StyledButton
              title={option.value}
              onPress={() => onSelect(option.value)}
              disabled={isPaletteDisabled}
              backgroundColor={isPickerButton && baseColor ? baseColor : undefined}
              icon={option.icon}
            />
          </motion.div>
        );

        if (isPaletteDisabled) {
            return <div key={option.value} style={styles.disabledWrapper} title="Please pick a base color first">{button}</div>
        }

        return <div key={option.value}>{button}</div>;
      })}
    </div>
  );
};

export default SelectionStep;