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

const lengthOptions = [{ value: "Short", icon: '/images/length_short.svg' }, { value: "Medium", icon: '/images/length_medium.svg' }, { value: "Long", icon: '/images/length_long.svg' }];
const shapeOptions = [{ value: "Square", icon: '/images/shape_square.svg' }, { value: "Round", icon: '/images/shape_round.svg' }, { value: "Almond", icon: '/images/shape_almond.svg' }, { value: "Squoval", icon: '/images/shape_squoval.svg' }, { value: "Pointed", icon: '/images/shape_pointed.svg' }, { value: "Ballerina", icon: '/images/shape_ballerina.svg' }];
const styleOptions = [{ value: "French", icon: '/images/style_french.svg' }, { value: "Floral", icon: '/images/style_floral.svg' }, { value: "Line Art", icon: '/images/style_line.svg' }, { value: "Geometric", icon: '/images/style_geometric.svg' }, { value: "Ombre", icon: '/images/style_ombre.svg' }, { value: "Abstract", icon: '/images/style_abstract.svg' }, { value: "Dot Nails", icon: '/images/style_dots.svg' }, { value: "Glitter", icon: '/images/style_glitter.png' }];
const colorConfigOptions = [
    { value: "Pick a Base Color", icon: '/images/color_select.svg' },
    { value: "Monochromatic", icon: '/images/color_mono.svg' },
    { value: "Analogous", icon: '/images/color_analog.svg' },
    { value: "Complimentary", icon: '/images/color_complim.svg' },
    { value: "Triadic", icon: '/images/color_triad.svg' },
    { value: "Tetradic", icon: '/images/color_tetra.svg' },
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
    } catch (error: any) {
      setLoading(false);
      console.error("Fatal error in handleImpressMe:", error);
      alert(`Generation Failed: ${error.message}`);
    }
  };

  const handleSelect = (value: string) => {
    const currentStep = steps[currentStepIndex];
    
    if (currentStep.id === 'color' && value === 'Pick a Base Color') {
      setColorPickerVisible(true);
      return; 
    }

    const newSelections = { ...selections, [currentStep.id]: value };
    setSelections(newSelections);

    if (currentStepIndex >= steps.length - 1) {
      handleImpressMe(newSelections);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleColorSelect = (hex: string) => {
    setSelections({ ...selections, baseColor: hex });
    setColorPickerVisible(false);
  };

  const currentStep = steps[currentStepIndex];

  const styles = {
    outerContainer: {
        width: '100%',
        minHeight: 'calc(100vh - 70px)', // Adjust height to account for header
        backgroundColor: '#FFFFFF', // Changed to white to remove the gray background
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
        justifyContent: 'flex-start', // Align content to the top
        alignItems: 'center',
        padding: '40px',
    },
    title: {
      fontSize: '36px',
      color: Colors.darkBlue,
      textAlign: 'center' as 'center', // Center the title
      width: '100%',
      marginBottom: '20px',
    },
    subtitleContainer: {
        textAlign: 'center' as 'center',
        marginBottom: '40px',
    },
    subtitle: {
        fontSize: '24px',
        color: '#555',
    },
    subtitleDetail: {
        fontSize: '18px',
        color: '#D8BFD8',
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
                <h1 style={styles.title}>Create Your Masterpiece</h1>
                <ProgressBar currentStep={currentStepIndex + 1} totalSteps={steps.length} />
                
                <AnimatePresence mode="wait">
                    <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center' as 'center', width: '100%' }}
                    >
                        <div style={styles.subtitleContainer}>
                            <p style={styles.subtitle}>Select</p>
                            <p style={styles.subtitleDetail}>{currentStep.title}</p>
                        </div>
                        <SelectionStep
                            options={currentStep.options}
                            onSelect={handleSelect}
                            baseColor={selections.baseColor}
                            stepId={currentStep.id}
                        />
                    </motion.div>
                </AnimatePresence>
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
