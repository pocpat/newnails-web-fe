import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  const styles = {
    container: {
      width: '80%',
      maxWidth: '400px',
      marginBottom: '20px',
    },
    barBackground: {
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      backgroundColor: '#D8BFD8',
      borderRadius: '4px',
    },
    text: {
      color: '#F5F5DC',
      textAlign: 'center' as 'center',
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
      <p style={styles.text}>{`Step ${currentStep} of ${totalSteps}`}</p>
    </div>
  );
};

export default ProgressBar;