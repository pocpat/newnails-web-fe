import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from '../../src/components/ProgressBar';
import SelectionStep from '../../src/components/SelectionStep';
import ColorPickerModal from '../../src/components/ColorPickerModal';
import { generateDesigns } from '../../src/lib/api';
import { Colors } from '../../src/lib/colors';

// --- Constants ---
const IMAGE_GENERATION_MODELS = [
  'stabilityai/sdxl-turbo:free',
  'google/gemini-2.0-flash-exp:free',
  'black-forest-labs/FLUX-1-schnell:free',
  'HiDream-ai/HiDream-I1-Full:free',
];

const lengthOptions = [{ value: "short", icon: '/images/length_short.svg' }, { value: "medium", icon: '/images/length_medium.svg' }, { value: "long", icon: '/images/length_long.svg' }];
const shapeOptions = [{ value: "square", icon: '/images/shape_square.svg' }, { value: "round", icon: '/images/shape_round.svg' }, { value: "almond", icon: '/images/shape_almond.svg' }, { value: "squoval", icon: '/images/shape_squoval.svg' }, { value: "pointed", icon: '/images/shape_pointed.svg' }, { value: "ballerina", icon: '/images/shape_ballerina.svg' }];
const styleOptions = [{ value: "french", icon: '/images/style_french.svg' }, { value: "floral", icon: '/images/style_floral.svg' }, { value: "line art", icon: '/images/style_line.svg' }, { value: "geometric", icon: '/images/style_geometric.svg' }, { value: "ombre", icon: '/images/style_ombre.svg' }, { value: "abstract", icon: '/images/style_abstract.svg' }, { value: "dot nails", icon: '/images/style_dots.svg' }, { value: "glitter", icon: '/images/style_glitter.png' }];
const colorConfigOptions = [
    { value: "Pick a Base Color", icon: '/images/color_select.svg' },
    { value: "unified", icon: '/images/color_mono.svg' },
    { value: "harmonious", icon: '/images/color_analog.svg' },
    { value: "contrast", icon: '/images/color_complim.svg' },
    { value: "balanced", icon: '/images/color_triad.svg' },
    { value: "rich", icon: '/images/color_tetra.svg' },
];

const steps = [
  { id: 'length', title: 'Nail Length', options: lengthOptions },
  { id: 'shape', title: 'Nail Shape', options: shapeOptions },
  { id: 'style', title: 'Nail Style', options: styleOptions },
  { id: 'color', title: 'Color Palette', options: colorConfigOptions },
];

// --- Component ---
const DesignFormPage = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImpressMe = async (finalSelections: Record<string, string>) => {
    setLoading(true);
    try {
      const { length, shape, style, color, baseColor } = finalSelections;
      let prompt = `A detailed closeup Nail design with ${length} length, ${shape} shape, ${style} style`;

      if (baseColor) {
        prompt += `, using a base color of ${baseColor}`;
      }
      if (color && color !== "Pick a Base Color") {
          prompt += ` in a ${color} color configuration.`
      } else {
          prompt += "."
      }

      const imagePromises = IMAGE_GENERATION_MODELS.map(model =>
        generateDesigns({ prompt, model, num_images: 1, width: 1024, height: 1024 })
      );

      const results = await Promise.all(imagePromises);
      const imageUrls = results.flatMap(result => result.imageUrls);

      navigate('/results', { state: { generatedImages: imageUrls, prompt: prompt } });
      return true;
    } catch (error: any) {
      setLoading(false);
      console.error("Fatal error in handleImpressMe:", error);
      alert(`Generation Failed: ${error.message}`);
      return false;
    }
  };

  const handleSelect = async (value: string) => {
    const currentStep = steps[currentStepIndex];
    
    if (currentStep.id === 'color' && value === 'Pick a Base Color') {
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

  const handleColorSelect = (hex: string) => {
    setSelections({ ...selections, baseColor: hex });
    setColorPickerVisible(false);
  };

  const currentStep = steps[currentStepIndex];

  const styles: { [key: string]: React.CSSProperties } = {
    outerContainer: {
        width: '100%',
        minHeight: 'calc(95vh - 70px)', // Adjust height to account for header
        backgroundColor: '#FFFFFF', // Changed to white to remove the gray background
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between',  //new
       
    },
    pageContainer: {
        display: 'flex',
        width: '1920px',
        height: '1080px',
        maxWidth: '100vw',
        maxHeight: '100vh',
        fontFamily: 'sans-serif',
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
        transform: 'scale(calc(min(100vh / 1080, 100vw / 1920)))',
        transformOrigin: 'center center',
        overflow: 'hidden', // Hide anything that might stick out
        flex: 1,
    },
    leftPanel: {
        width: '540px',
        backgroundColor: Colors.lightDustyBroun,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '0 540px 540px 0', // Creates a semi-circle on the right
    },
    heroImage: {
        width: '80%',
        maxWidth: '400px',
        height: 'auto',
    },
    rightPanel: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '40px',
        paddingBottom: '20px',
    },
    title: {
      fontFamily: 'PottaOne, sans-serif',
      fontSize: '3rem',
      color: Colors.darkCherry,
      textAlign: 'center' as 'center', // Center the title
      width: '100%',
      marginBottom: '20px',
    },
    subtitleContainer: {
        textAlign: 'center' as 'center',
        marginBottom: '20px',
    },
    subtitle: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '1.69rem',
        fontWeight: '600',
        color: Colors.greyAzure,
        textTransform: 'uppercase',
        margin: 0,

    },
    subtitleDetail: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '2.25rem',
        fontWeight: '400',
        color: Colors.greyAzure,
        textTransform: 'uppercase',
        margin: 0,
        letterSpacing: '1.6px',
    },
    topContent: {
        width: '100%',
        textAlign: 'center' as 'center',
    },
    bottomContent: {
        width: '100%',
        paddingBottom: '20px',
    },
    progressBarContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '20px',
    }
  };

  if (loading) {
    return <div style={styles.outerContainer}><div style={styles.pageContainer}><h1 style={{...styles.title, margin: 'auto'}}>Generating your masterpiece...</h1></div></div>;
  }

  return (
    <div style={styles.outerContainer}>
        <div style={styles.pageContainer}>
            <div style={styles.leftPanel}>
                <img src="/images/hero-img.png" alt="Nail Art" style={styles.heroImage} />
            </div>
            <div style={styles.rightPanel}>
                <div style={styles.topContent}>
                    <h1 style={styles.title}>Create Your Masterpiece</h1>
                    <div style={styles.progressBarContainer}>
                        <ProgressBar currentStep={currentStepIndex + 1} totalSteps={steps.length} />
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
                        style={{ width: '100%' }}
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
            onSelectColor={handleColorSelect}
            onClose={() => setColorPickerVisible(false)}
        />
        </div>
       
    </div>
  );
};

export default DesignFormPage;