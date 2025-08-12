import { useState, useEffect } from "react";
import { fetchRandomFunFact } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Colors } from "../lib/colors";
import FloatingIcons from "../components/FloatingIcons";

const LoadingPage = () => {
  const [funFact, setFunFact] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getFact = async () => {
      try {
        const data = await fetchRandomFunFact();
        if (isMounted) {
          setFunFact(data.text);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            "Could not fetch a fun fact. Waiting for the magic to happen..."
          );
          console.error(err);
        }
      }
    };

    getFact(); // Initial fetch
    const intervalId = setInterval(getFact, 15000); // Fetch every 15 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const gradientAnimation = `
    @keyframes gradient-animation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <>
      <style>{gradientAnimation}</style>
    
        <div style={styles.pageContainer}>
      <FloatingIcons isVisible={true} />
      {/* The decorative circle is now absolutely positioned */}
      <div style={styles.headerCircle}></div>
      
      <div style={styles.centeredContent}>
        <h1 style={styles.title}>Generating your designs...</h1>
        <div style={styles.subtitleContainer}>
          <p style={styles.subtitle}>
            Please wait, this can take a moment.
          </p>
        </div>
        <div style={styles.funFactWrapper}>
          <div style={styles.funFactContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={funFact || error}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={styles.funFact}
              >
                {error || funFact}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoadingPage;

const styles: { [key: string]: React.CSSProperties } = {
  outerContainer: {
    width: "100%",
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pageContainer: {
  flexGrow: 1, // Make pageContainer fill the mainContent area
    display: "flex",
    fontFamily: "sans-serif",
    position: "relative", // Needed for the absolute positioned circle
    overflow: "hidden", // Hide parts of the circle that go off-screen
    backgroundColor: Colors.white,
    width: "100%",  },

 centeredContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    zIndex: 1, // Ensure content is above the circle
    padding: '2rem', // Add some padding
    justifyContent: 'space-between', // Distribute space
  },
  
  headerCircle: {
   // 1. Use a large, fixed width. 2000px is big enough for almost any screen.
    width: "2000px",
    // 2. The height must be the same as the width to maintain a circle.
    height: "2000px",
    // 3. Use a fixed negative value for 'top' to control how much is visible.
    // Logic: -(height - desiredVisibleHeight). e.g., -(2000px - 300px) = -1700px.
    top: "-1700px",
background: `linear-gradient(to bottom, ${Colors.darkCherry} 70%, ${Colors.darkCherry} 60%, transparent 100%)`,    borderRadius: "50%",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 0,
    filter: "blur(20px)",
  },
 title: {
    fontFamily: "PottaOne, sans-serif",
    fontSize: "clamp(2rem, 5vw, 3rem)", // Responsive font size
    color: Colors.darkCherry, // Changed to white to be visible on the circle
    textAlign: "center",
    marginTop: '2%', // Push title down a bit
    marginBottom: '10%',
  },
  subtitleContainer: {
    textAlign: "center",
    // Removed negative margin
  },
  subtitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: "clamp(1rem, 3vw, 1.5rem)", // Responsive font size
    fontWeight: "500",
    color: Colors.greyAzure,
    margin: 0,
    marginTop: '1rem',
  },
  
 funFactWrapper: {
    flex: 1, // Let this take up remaining space, pushing it down
    width: "100%",
    display: "flex",
    alignItems: "center", // Center vertically in its available space
    justifyContent: "center",
    paddingBottom: '5%', // Add some space from the bottom
  },
  funFactContainer: {
    height: "120px",
    width: "100%",
    maxWidth: "800px",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  funFact: {
    fontFamily: "PottaOne, sans-serif",
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)", // Responsive font size
    color: Colors.greyAzure,
    textAlign: "center" as "center",
  },};
