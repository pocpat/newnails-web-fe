import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../../src/components/ProgressBar";
import SelectionStep from "../../src/components/SelectionStep";
import ColorPickerModal from "../../src/components/ColorPickerModal";
import { generateDesigns, fetchAvailableModels } from "../../src/lib/api";
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
import colorSelect from "../../src/assets/images/color_select.svg";
import colorMono from "../../src/assets/images/color_mono.svg";
import colorAnalog from "../../src/assets/images/color_analog.svg";
import colorComplim from "../../src/assets/images/color_complim.svg";
import colorTriad from "../../src/assets/images/color_triad.svg";
import colorTetra from "../../src/assets/images/color_tetra.svg";
import LoadingPage from "../../src/pages/LoadingPage";

// --- Constants ---
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
    icon: colorSelect,
  },
  { value: "unified", icon: colorMono },
  { value: "harmonious", icon: colorAnalog },
  { value: "contrast", icon: colorComplim },
  { value: "balanced", icon: colorTriad },
  { value: "rich", icon: colorTetra },
];

// --- Component ---
const DesignFormPage = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isColorPickerVisible, setColorPickerVisible] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [tempColor, setTempColor] = useState("#b3e5fc");

  // Dynamic model list fetched from backend
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");

  // Fetch available free models on mount
  useEffect(() => {
    fetchAvailableModels()
      .then((data: { models: string[] }) => {
        setAvailableModels(data.models || []);
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
        setModelsLoading(false);
      })
      .catch((err: Error) => {
        console.error("Failed to fetch available models:", err);
        setModelsError(err.message);
        setModelsLoading(false);
      });
  }, []);

  const handleImpressMe = async (finalSelections: Record<string, string>) => {
    setLoading(true);
    try {
      // Use all available models (user picks which ones to try)
      const modelsToUse =
        availableModels.length > 0
          ? [selectedModel] // Use the user-selected model
          : [];

      if (modelsToUse.length === 0) {
        throw new Error(
          "No image generation models are currently available. Please try again later."
        );
      }

      console.log("Sending raw selections to backend:", finalSelections);
      console.log("Using model:", selectedModel);

      const results = await Promise.all(
        modelsToUse.map((model) =>
          generateDesigns({
            ...finalSelections, // Pass all selections
            model: model,
            num_images: 1,
            width: 1024,
            height: 1024,
          }).catch((error: { response?: { data?: { limitReached?: boolean; message?: string; imageUrls?: string[] } } }) => {
            console.error(`Error generating with model ${model}:`, error);
            if (error.response && error.response.data && error.response.data.limitReached) {
              return error.response.data;
            }
            return null;
          })
        )
      );

      // Check if the rate limit was hit
      const limitHitResult = results.find(
        (r) => r && r.limitReached
      );

      if (limitHitResult) {
        alert(limitHitResult.message);
        navigate("/results", {
          state: {
            generatedImages: limitHitResult.imageUrls,
            limitReached: true,
          },
        });
        return true;
      }

      const validResults = results.filter((r) => r && r.imageUrls && r.prompt);

      if (validResults.length === 0) {
        throw new Error(
          "Image generation failed. The selected model may be temporarily unavailable. Try selecting a different model or try again later."
        );
      }

      const imageUrls = validResults.flatMap((result) => result.imageUrls);
      const prompt = validResults[0].prompt;

      navigate("/results", {
        state: {
          generatedImages: imageUrls,
          prompt: prompt,
        },
      });

      return true;
    } catch (error: unknown) {
      setLoading(false);
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("Fatal error in handleImpressMe:", error);
      alert(`Generation Failed: ${msg}`);
      return false;
    }
  };

  const handleTempColorChange = (color: { hexString: string }) => {
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
        return;
      }
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleColorConfirm = () => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      baseColor: tempColor,
    }));
    setColorPickerVisible(false);
  };

  // Build steps array dynamically — model step is added after color
  const baseSteps = [
    { id: "length", title: "Nail Length", options: lengthOptions },
    { id: "shape", title: "Nail Shape", options: shapeOptions },
    { id: "style", title: "Nail Style", options: styleOptions },
    { id: "color", title: "Color Palette", options: colorConfigOptions },
  ];

  // The model step shows available free models as interactive text buttons
  const modelStep = {
    id: "model",
    title: "Choose an AI Model",
    options: availableModels.map((m) => ({ value: m, icon: "" })),
  };

  const steps =
    availableModels.length > 0 ? [...baseSteps, modelStep] : baseSteps;

  const currentStep = steps[currentStepIndex];

  const handleModelSelect = (value: string) => {
    setSelectedModel(value);
    // Advance to next step or trigger generation
    if (currentStepIndex >= steps.length - 1) {
      // This is the last step — trigger generation
      handleImpressMe(selections);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    outerContainer: {
      width: "100%",
      minHeight: "calc(95vh - 70px)",
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "space-between",
    },
    pageContainer: {
      display: "flex",
      width: "100%",
      height: "1080px",
      fontFamily: "sans-serif",
      boxShadow: "0 0px 20px #5f2461",
      transform: "scale(calc(min(100vh / 1080, 100vw / 1920)))",
      transformOrigin: "center center",
      overflow: "hidden",
      flex: 1,
    },
    leftPanel: {
      width: "540px",
      backgroundColor: Colors.lightDustyBroun,
      display: "flex",
      justifyContent: "start",
      alignItems: "center",
      borderRadius: "0 540px 540px 0",
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
      flexDirection: "column",
      padding: "40px",
    },
    rightTop: {
      flex: "0 0 33%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    rightBottom: {
      flex: "1 0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontFamily: "PottaOne, sans-serif",
      fontSize: "3rem",
      color: Colors.darkCherry,
      textAlign: "center" as "center",
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
    modelListContainer: {
      display: "flex",
      flexWrap: "wrap" as "wrap",
      justifyContent: "center",
      gap: "12px",
      maxWidth: "620px",
      margin: "0 auto",
    },
    modelChip: {
      padding: "10px 20px",
      borderRadius: "25px",
      border: "2px solid #e0e0e0",
      backgroundColor: "#f9f9f9",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontFamily: "Inter, sans-serif",
      color: "#555",
      transition: "all 0.2s ease",
    },
    modelChipSelected: {
      padding: "10px 20px",
      borderRadius: "25px",
      border: "2px solid " + Colors.darkCherry,
      backgroundColor: Colors.darkCherry,
      cursor: "pointer",
      fontSize: "0.85rem",
      fontFamily: "Inter, sans-serif",
      color: "#fff",
      transition: "all 0.2s ease",
    },
    modelsLoading: {
      textAlign: "center" as "center",
      padding: "40px",
      fontFamily: "Inter, sans-serif",
      color: "#999",
    },
    modelsError: {
      textAlign: "center" as "center",
      padding: "40px",
      fontFamily: "Inter, sans-serif",
      color: "#cc4444",
    },
    generateButton: {
      marginTop: "30px",
      padding: "15px 50px",
      borderRadius: "30px",
      border: "none",
      backgroundColor: Colors.darkCherry,
      color: "#fff",
      fontSize: "1.2rem",
      fontFamily: "PottaOne, sans-serif",
      cursor: "pointer",
      display: "block",
      margin: "30px auto 0",
    },
    noModelsInfo: {
      textAlign: "center" as "center",
      padding: "20px",
      fontFamily: "Inter, sans-serif",
      color: "#666",
      fontSize: "0.9rem",
      maxWidth: "500px",
      margin: "0 auto",
    },
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.leftPanel}>
        <img
          src="/hero-img.png"
          alt="Nail Art"
          style={styles.heroImage}
        />
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.rightTop}>
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
        </div>

        <div style={styles.rightBottom}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              {currentStep.id === "model" ? (
                <div>
                  {modelsLoading ? (
                    <div style={styles.modelsLoading}>
                      Loading available models...
                    </div>
                  ) : modelsError ? (
                    <div style={styles.modelsError}>
                      Could not load models: {modelsError}
                    </div>
                  ) : availableModels.length === 0 ? (
                    <div style={styles.noModelsInfo}>
                      No free image generation models are currently
                      available on ImageRouter. This is usually
                      temporary — the backend checks every 2 days.
                      Please try again later.
                    </div>
                  ) : (
                    <div style={styles.modelListContainer}>
                      {availableModels.map((model) => (
                        <div
                          key={model}
                          style={
                            selectedModel === model
                              ? styles.modelChipSelected
                              : styles.modelChip
                          }
                          onClick={() => setSelectedModel(model)}
                        >
                          {model.replace(":free", "").replace(/^[^/]+\//, "")}
                        </div>
                      ))}
                      <button
                        style={styles.generateButton}
                        onClick={() => handleImpressMe(selections)}
                      >
                        Generate!
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <SelectionStep
                  options={currentStep.options}
                  onSelect={handleSelect}
                  baseColor={selections.baseColor}
                  stepId={currentStep.id}
                />
              )}
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
  );
};

export default DesignFormPage;