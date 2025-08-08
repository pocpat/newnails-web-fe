import { useState, useEffect } from "react";
import { fetchRandomFunFact } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Colors } from "../lib/colors";
import FloatingIcons from "../components/FloatingIcons";
import { FaSnowflake } from "react-icons/fa";

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
      <div>
        <div style={styles.pageContainer}>
          <FloatingIcons isVisible={true}  />
          <div style={styles.centeredContent}>
            <div style={styles.headerCircle}>
              <h1 style={styles.title}>Generating your designs...</h1>
            </div>

            <div style={styles.subtitleContainer}>
              <p style={styles.subtitle}>
                Please wait, this can take a moment.
              </p>
            </div>

            <div style={styles.funFactWrapper}>
              <div style={styles.funFactContainer}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={funFact}
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
    display: "flex",
    width: "100%",
    height: "1080px",
    fontFamily: "sans-serif",
    boxShadow: "0 0px 20px #5f2461",
    transform: "scale(calc(min(100vh / 1080, 100vw / 1920)))",
    transformOrigin: "top center",
    overflow: "hidden",
    position: "relative",
    backgroundColor: Colors.white, 
  },
  centeredContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  headerCircle: {
    width: "110%",
    height: "50%",
background: `linear-gradient(to bottom, ${Colors.darkCherry} 0%, ${Colors.darkCherry} 10%, transparent 100%)`,
    borderRadius: "0 0 900px 900px ", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10%",
    position: "relative",
    
    top: "-30%",
   boxShadow: "2 0 20px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
  title: {
    fontFamily: "PottaOne, sans-serif",
    fontSize: "3rem",
    color: Colors.darkCherry,
    textAlign: "center",
    position: "relative",
    top: "30px",
  },
  subtitleContainer: {
    marginTop: "-20%",
    textAlign: "center" as "center",
  },
  subtitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: "1.5rem",
    fontWeight: "500",
    color: Colors.greyAzure,
    margin: 0,
  },
  funFactWrapper: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: "2.5rem",
    color: Colors.greyAzure,
    textAlign: "center" as "center",
  },
};
