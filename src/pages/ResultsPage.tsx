import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { saveDesign } from '../lib/api';
import FullScreenImageModal from '../components/FullScreenImageModal';
import { ImEnlarge } from "react-icons/im";
import { GrSave } from "react-icons/gr";
import { BsFillSave2Fill } from "react-icons/bs";
import { Colors } from '../lib/colors';


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

{/* generated IMG */}
            <img src={url} alt={`Generated design ${index + 1}`} style={styles.image} />
 

 {/* card body */}              
              <div style={styles.cardBody}>
                <div style={styles.cardBodyOverlay} />
                <div style={styles.buttonWrapper}>


 {/* full screen button */}           
            <div style={styles.buttonWrapper}>
              <button onClick={() => handleFullScreen(url)} style={styles.iconButton}>
               <ImEnlarge />
              </button>
{/* Save button */}
              <button
                onClick={() => handleSave(url)}
                disabled={savedImages.includes(url) || saving === url}
                style={styles.iconButton}
              >
                {savedImages.includes(url) ? <BsFillSave2Fill /> : saving === url ? 'Saving...' : <GrSave />}
              </button>

            </div>
          </div>

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
const styles: { [key: string]: React.CSSProperties } = {
container: { padding: "2rem", fontFamily: "sans-serif" },
  centered: { textAlign: "center", marginTop: "2rem" },  title: {
        fontFamily: 'PottaOne, sans-serif',
        fontSize: '3rem',
        color: Colors.darkCherry,
        textAlign: 'center' as 'center', // Center the title
        width: '100%',
        marginBottom: '20px',
      },

    grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },
  // card: {
  //   border: '1px solid #ccc',
  //   borderRadius: '8px',
  //   overflow: 'hidden',
  //   position: 'relative',
  // },
  // image: {
  //   width: '100%',
  //   height: 'auto',
  //   display: 'block',
  // },
  
   card: {
    border: "1px solid #eee",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  },
  image: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    display: "block",
    background: "#f0f0f0",
  },
  cardBody: {
    position: "relative", // Needed to position the overlay and wrapper inside
    padding: "1rem",
    display: "flex",
    justifyContent: "center", // Center the content wrapper
    alignItems: "center",
    background: Colors.lightDustyBroun,
    overflow: "hidden", // Ensures the overlay's rounded corners are clipped
  },
  cardBodyOverlay: {
    position: "absolute",
    top: "0%",
    left: "50%",
    transform: "translate(-50%, -0%)",
    width: "90%", // 30% smaller
    height: "90%", // 30% smaller
    backgroundColor: "rgba(255, 255, 255, 0.2)", // White with 50% transparency
    borderRadius: "0 0 16px 16px ",
    zIndex: 1, // Place it behind the buttons
  },
  buttonWrapper: {
    position: "relative",
    zIndex: 2, // Place buttons on top of the overlay
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
 
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    outline: "none",
    color:Colors.solidTeal,
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
