import React from 'react';

interface FullScreenImageModalProps {
  isVisible: boolean;
  imageUrl: string;
  onClose: () => void;
}

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({ isVisible, imageUrl, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div style={styles.overlay} onClick={onClose} role="dialog">
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose} aria-label="close">
          &times;
        </button>
        <img src={imageUrl} alt="Full screen view" style={styles.image} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    position: 'relative',
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    width: '75vw',
    height: '75vh',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
};

export default FullScreenImageModal;
