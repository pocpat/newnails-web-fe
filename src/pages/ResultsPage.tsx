import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { saveDesign } from '../lib/api';
import FullScreenImageModal from '../components/FullScreenImageModal';

const ResultsPage = () => {
  const location = useLocation();
  // Destructure both generatedImages and the prompt from the state
  const { generatedImages, prompt } = location.state || { generatedImages: [], prompt: '' };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (imageUrl: string) => {
    setSaving(imageUrl);
    try {
      // Use the received prompt when saving the design
      await saveDesign({
        temporaryImageUrl: imageUrl,
        prompt: prompt, // Pass the correct prompt
      });
      setSavedImages([...savedImages, imageUrl]);
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Error saving design. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  const handleFullScreen = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsModalVisible(true);
  };

  if (!generatedImages || generatedImages.length === 0) {
    return <div>No images generated. Please go back and try again.</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Generated Designs</h1>
      <div style={styles.grid}>
        {generatedImages.map((url: string, index: number) => (
          <div key={index} style={styles.card}>
            <img src={url} alt={`Generated design ${index + 1}`} style={styles.image} />
            <div style={styles.buttonContainer}>
              <button onClick={() => handleFullScreen(url)} style={styles.button}>
                Full Screen
              </button>
              <button
                onClick={() => handleSave(url)}
                disabled={savedImages.includes(url) || saving === url}
                style={styles.button}
              >
                {savedImages.includes(url) ? 'Saved' : saving === url ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <FullScreenImageModal
        isVisible={isModalVisible}
        imageUrl={selectedImageUrl}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

// Basic styling
const styles = {
  container: { padding: '2rem' },
  title: { textAlign: 'center', marginBottom: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.5rem',
  },
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ResultsPage;
