import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../../src/components/ProgressBar";
import SelectionStep from "../../src/components/SelectionStep";
import ColorPickerModal from "../../src/components/ColorPickerModal";
import { generateDesigns } from "../../src/lib/api";
import { Colors } from "../../src/lib/colors";
import short from "../../src/assets/images/length_short.svg";
import medium from "../../src/assets/images/length_medium.svg";
import long from "../../src/assets/images/length_long.svg";
import square from "../../src/assets/images/shape_square.svg";
import round from "../../src/assets/images/shape_round.svg";
import almond from "../../src/assets/images/shape_almond.svg";
import squoval from "../../src/assets/images/shape_squoval.svg";
import pointed from "../../src/assets/images/shape_pointed.svg";
import ballerina from "../../src/assets/images/shape_ballerina.svg";
import french from "../../src/assets/images/style_french.svg";
import floral from "../../src/assets/images/style_floral.svg";
import line from "../../src/assets/images/style_line.svg";
import geometric from "../../src/assets/images/style_geometric.svg";
import ombre from "../../src/assets/images/style_ombre.svg";
import abstract from "../../src/assets/images/style_abstract.svg";
import dots from "../../src/assets/images/style_dots.svg";
import glitter from "../../src/assets/images/style_glitter.png";
import LoadingPage from "../../src/pages/LoadingPage";

// --- Constants ---
const IMAGE_GENERATION_MODELS = [
  "stabilityai/sdxl-turbo:free",
  "google/gemini-2.0-flash-exp:free",
  "black-forest-labs/FLUX-1-schnell:free",
  "HiDream-ai/HiDream-I1-Full:free",
];

const lengthOptions = [
  { value: "short", icon: short },
  { value: "medium", icon: medium },
  { value: "long", icon: long },
];
const shapeOptions = [
  { value: "square", icon: square },
  { value: "round", icon: round },
  { value: "almond", icon: almond },
  { value: "squoval", icon: squoval },
  { value: "pointed", icon: pointed },
  { value: "ballerina", icon: ballerina },
];
const styleOptions = [
  { value: "french", icon: french },
  { value: "floral", icon: floral },
  { value: "line art", icon: line },
  { value: "geometric", icon: geometric },
  { value: "ombre", icon: ombre },
  { value: "abstract", icon: abstract },
  { value: "dot nails", icon: dots },
  { value: "glitter", icon: glitter },
];
const colorConfigOptions = [
  {
    value: "Pick a Base Color",
    icon: "../../src/assets/images/color_select.svg",
  },
  { value: "unified", icon: "../../src/assets/images/color_mono.svg" },
  { value: "harmonious", icon: "../../src/assets/images/color_analog.svg" },
  { value: "contrast", icon: "../../src/assets/images/color_complim.svg" },
  { value: "balanced", icon: "../../src/assets/images/color_triad.svg" },
  { value: "rich", icon: "../../src/assets/images/color_tetra.svg" },
];

const steps = [
  { id: "length", title: "Nail Length", options: lengthOptions },
  { id: "shape", title: "Nail Shape", options: shapeOptions },
  { id: "style", title: "Nail Style", options: styleOptions },
  { id: "color", title: "Color Palette", options: colorConfigOptions },
];

// --- Component ---
const DesignFormPage = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempColor, setTempColor] = useState("#b3e5fc");

  const handleImpressMe = async (finalSelections: Record<string, string>) => {
    setLoading(true);
    try {
      // 1. We have all the raw selections: length, shape, style, color, baseColor
      console.log("Sending raw selections to backend:", finalSelections);

      // 2. Pass all selections directly to the backend API call.
      // The `generateDesigns` function will stringify this object.
      const results = await Promise.all(
        IMAGE_GENERATION_MODELS.map((model) =>
          generateDesigns({
            ...finalSelections, // Pass all selections
            model: model,
            num_images: 1,
            width: 1024,
            height: 1024,
          })
        )
      );

      const imageUrls = results.flatMap((result) => result.imageUrls);

      // 3. Navigate to the results page.
      // The prompt is no longer needed here as it's built on the backend.
      navigate("/results", {
        state: { generatedImages: imageUrls },
      });

      return true;
    } catch (error: any) {
      setLoading(false);
      console.error("Fatal error in handleImpressMe:", error);
      alert(`Generation Failed: ${error.message}`);
      return false;
    }
  };

  const handleTempColorChange = (color: any) => {
    setTempColor(color.hexString);
  };

  const handleSelect = async (value: string) => {
    const currentStep = steps[currentStepIndex];

    if (currentStep.id === "color" && value === "Pick a Base Color") {
      setTempColor(selections.baseColor || "#b3e5fc");
      setColorPickerVisible(true);
      return;
    }
    const newSelections = { ...selections, [currentStep.id]: value };

    setSelections(newSelections);

    if (currentStepIndex >= steps.length - 1) {
      const success = await handleImpressMe(newSelections);
      if (!success) {
        // Do not advance if there was an error
        return;
      }
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };


  const handleColorConfirm = () => {
    // Add this log to see what you are trying to set
    console.log(
      `[DesignFormPage] Confirming color. Setting baseColor to: ${tempColor}`
    );

    setSelections((prevSelections) => ({
      ...prevSelections,
      baseColor: tempColor,
    }));
    setColorPickerVisible(false);
  };

  const currentStep = steps[currentStepIndex];

  const styles: { [key: string]: React.CSSProperties } = {
    outerContainer: {
      width: "100%",
      minHeight: "calc(95vh - 70px)", // Adjust height to account for header
      backgroundColor: "#FFFFFF", // Changed to white to remove the gray background
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "space-between", //new
    },
    pageContainer: {
      display: "flex",

      width: "100%",
      height: "1080px",

      fontFamily: "sans-serif",
      boxShadow: "0 0px 20px #5f2461",
      transform: "scale(calc(min(100vh / 1080, 100vw / 1920)))",
      transformOrigin: "center center",
      overflow: "hidden", // Hide anything that might stick out
      flex: 1,
    },
    leftPanel: {
      width: "540px",
      backgroundColor: Colors.lightDustyBroun,
      display: "flex",
      justifyContent: "start",

      alignItems: "center",
      borderRadius: "0 540px 540px 0", // Creates a semi-circle on the right
    },
    heroImage: {
      width: "80%",
      maxWidth: "400px",
      height: "auto",
      marginLeft: "20px",
    },
    rightPanel: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "40px",

      paddingBottom: "3.33%",
    },
    title: {
      fontFamily: "PottaOne, sans-serif",
      fontSize: "3rem",
      color: Colors.darkCherry,
      textAlign: "center" as "center", // Center the title
      width: "100%",
      marginBottom: "20px",
    },
    subtitleContainer: {
      textAlign: "center" as "center",
      marginBottom: "20px",
    },
    subtitle: {
      fontFamily: "Inter, sans-serif",
      fontSize: "1.69rem",
      fontWeight: "600",
      color: Colors.greyAzure,
      textTransform: "uppercase",
      margin: 0,
    },
    subtitleDetail: {
      fontFamily: "Inter, sans-serif",
      fontSize: "2.25rem",
      fontWeight: "400",
      color: Colors.greyAzure,
      textTransform: "uppercase",
      margin: 0,
      letterSpacing: "1.6px",
    },
    topContent: {
      width: "100%",
      textAlign: "center" as "center",
    },
    bottomContent: {
      width: "100%",
      paddingBottom: "20px",
    },
    progressBarContainer: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      marginBottom: "20px",
    },
  };

  if (loading) {
    return <LoadingPage />;
  }
  console.log(
    `[DesignFormPage] Rendering with selections.baseColor:`,
    selections.baseColor
  );
  return (
    <div style={styles.outerContainer}>
      <div style={styles.pageContainer}>
        <div style={styles.leftPanel}>
          <img
            src="../../src/assets/images/hero-img.png"
            alt="Nail Art"
            style={styles.heroImage}
          />
        </div>
        <div style={styles.rightPanel}>
          <div style={styles.topContent}>
            <h1 style={styles.title}>Create Your Masterpiece</h1>
            <div style={styles.progressBarContainer}>
              <ProgressBar
                currentStep={currentStepIndex + 1}
                totalSteps={steps.length}
              />
            </div>
            <div style={styles.subtitleContainer}>
              <p style={styles.subtitle}>Select</p>
              <p style={styles.subtitleDetail}>{currentStep.title}</p>
            </div>
          </div>

          <div style={styles.bottomContent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              >
                <SelectionStep
                  options={currentStep.options}
                  onSelect={handleSelect}
                  baseColor={selections.baseColor}
                  stepId={currentStep.id}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ColorPickerModal
          isVisible={isColorPickerVisible}
          currentColor={tempColor}
          onColorChange={handleTempColorChange}
          onSelectColor={handleColorConfirm}
          onClose={() => setColorPickerVisible(false)}
        />
      </div>
    </div>
  );
};

export default DesignFormPage;
