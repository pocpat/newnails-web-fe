import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { saveDesign } from "../lib/api";
import FullScreenImageModal from "../components/FullScreenImageModal";
import { ImEnlarge } from "react-icons/im";
import { GrSave } from "react-icons/gr";
import { BsFillSave2Fill } from "react-icons/bs";
import { Colors } from "../lib/colors";

const ResultsPage = () => {
  const location = useLocation();
  const { generatedImages, prompt } = location.state || {
    generatedImages: [],
    prompt: "",
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (imageUrl: string) => {
    setSaving(imageUrl);
    try {
      await saveDesign({
        temporaryImageUrl: imageUrl,
        prompt: prompt,
      });
      setSavedImages([...savedImages, imageUrl]);
    } catch (error) {
      console.error("Failed to save design:", error);
      alert("Error saving design. Please try again.");
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
    <div style={styles.outerContainer}>
      <div style={styles.pageContainer}>
        <div style={styles.centeredContent}>
          <div style={styles.headerCircle}>
            <h1 style={styles.title}>Generated Designs</h1>
          </div>

          <div style={styles.bottomContent}>
            <div style={styles.grid}>
              {generatedImages.map((url: string, index: number) => (
                <div key={index} style={styles.card}>
                  <img
                    src={url}
                    alt={`Generated design ${index + 1}`}
                    style={styles.image}
                  />
                  <div style={styles.cardBody}>
                    <div style={styles.cardBodyOverlay} />
                    <div style={styles.buttonWrapper}>
                      <button
                        onClick={() => handleFullScreen(url)}
                        style={styles.iconButton}
                      >
                        <ImEnlarge />
                      </button>
                      <button
                        onClick={() => handleSave(url)}
                        disabled={savedImages.includes(url) || saving === url}
                        style={styles.iconButton}
                      >
                        {savedImages.includes(url) ? (
                          <BsFillSave2Fill />
                        ) : saving === url ? (
                          "Saving..."
                        ) : (
                          <GrSave />
                        )}
                      </button>
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
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  outerContainer: {
    width: "100%",
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pageContainer: {
    display: "flex",
    width: "100%",
    height: "1080px",
    fontFamily: "sans-serif",
    boxShadow: "0 0px 20px #5f2461",
    transform: "scale(calc(min(100vh / 1080, 100vw / 1920)))",
    transformOrigin: "top center",
    overflow: "hidden",
  },
  centeredContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "0 2rem",
  },
  headerCircle: {
    width: "120%",
    height: "300px",
    backgroundColor: Colors.lightDustyBroun,
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "50px",
    position: "relative",
    top: -100,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontFamily: "PottaOne, sans-serif",
    fontSize: "3rem",
    color: Colors.darkCherry,
    textAlign: "center",
    position: "relative",
    top: "30px",
  },
  bottomContent: {
    textAlign: "center",
    marginTop: "-100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingTop: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: "1200px",
    paddingTop: "2rem",
  },
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
    position: "relative",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: Colors.lightDustyBroun,
    overflow: "hidden",
  },
  cardBodyOverlay: {
    position: "absolute",
    top: "0%",
    left: "50%",
    transform: "translate(-50%, -0%)",
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "0 0 16px 16px ",
    zIndex: 1,
  },
  buttonWrapper: {
    position: "relative",
    zIndex: 2,
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
    color: Colors.solidTeal,
  },
};

export default ResultsPage;
