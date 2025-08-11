import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  // This outer container centers the scaled page in the viewport
  outerContainer: {
    width: '100%',
    minHeight: 'calc(100vh - 120px)', // Adjust height based on your Header/Footer
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align to the top
    padding: ' 0', // Give some breathing room at the top and bottom
    backgroundColor: '#f4f4f4', // A neutral background for the viewport
  },
  // This is the "canvas" that gets scaled down
  pageContainer: {
    width: '1920px', // Explicitly set the width
    height: '1080px', // Explicitly set the height
    fontFamily: 'sans-serif',
    backgroundColor: '#FFFFFF', // Default background color for pages
    boxShadow: '0 0 20px rgba(95, 36, 97, 0.5)', // Adjusted shadow for more pop
    transform: 'scale(calc(min(85vh / 1080, 95vw / 1920)))', // Slightly smaller scale for padding
    transformOrigin: 'top center',
    overflow: 'hidden',
    display: 'flex', // Use flexbox for the children
    flexDirection: 'column',
  },
};

const FixedSizePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={styles.outerContainer}>
      <div style={styles.pageContainer}>
        {children}
      </div>
    </div>
  );
};

export default FixedSizePageLayout;