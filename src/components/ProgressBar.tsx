import React from 'react';
import { motion } from 'framer-motion';
import { Colors } from '../lib/colors';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  const styles = {
    container: {
      width: '100%', // Take full width to align with the title
      maxWidth: '600px', // Set a max-width for larger screens
      marginBottom: '20px',
    },
    barBackground: {
      height: '8px',
      backgroundColor: Colors.lightGrayPurple,
      borderRadius: '4px',
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      backgroundColor: Colors.solidTeal,
      borderRadius: '4px',
    },
    text: {
      color: Colors.mediumGray, // Changed to a darker color for better readability
      textAlign: 'left' as 'left', // Align text to the left
      marginTop: '8px',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.barBackground}>
        <motion.div
          style={styles.barFill}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      {/* <p style={styles.text}>{`Step ${currentStep} of ${totalSteps}`}</p> */}
    </div>
  );
};

export default ProgressBar;