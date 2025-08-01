import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDButton from '../../src/components/ThreeDButton'; // Adjust path as needed
import ColorPickerModal from '../../src/components/ColorPickerModal'; // Adjust path as needed
import SelectorRow from '../../src/components/SelectorRow'; // Adjust path as needed
import { generateDesigns } from '../../src/lib/api'; // Adjust path as needed

const IMAGE_GENERATION_MODELS = [
  'stabilityai/sdxl-turbo:free',
  'google/gemini-2.0-flash-exp:free',
  'black-forest-labs/FLUX-1-schnell:free',
  'HiDream-ai/HiDream-I1-Full:free',
];

// Placeholder for icons - will be replaced with actual web-compatible icons later
const LengthShortIcon = '';
const LengthMediumIcon = '';
const LengthLongIcon = '';
const ShapeSquareIcon = '';
const ShapeRoundIcon = '';
const ShapeAlmondIcon = '';
const ShapeSquovalIcon = '';
const ShapePointedIcon = '';
const ShapeBallerinaIcon = '';
const StyleFrenchIcon = '';
const StyleFloralIcon = '';
const StyleLineArtIcon = '';
const StyleGeometricIcon = '';
const StyleOmbreIcon = '';
const StyleAbstractIcon = '';
const StyleDotNailsIcon = '';
const StyleGlitterIcon = '';
const ColorBaseIcon = '';
const ColorMonochromaticIcon = '';
const ColorAnalogousIcon = '';
const ColorComplimentaryIcon = '';
const ColorTriadIcon = '';
const ColorTetradicIcon = '';

interface SelectorOption {
  value: string;
  icon: string; // Placeholder for icon path/component
}

const lengthOptions: SelectorOption[] = [
  { value: "Short", icon: LengthShortIcon },
  { value: "Medium", icon: LengthMediumIcon },
  { value: "Long", icon: LengthLongIcon },
];
const shapeOptions: SelectorOption[] = [
  { value: "Square", icon: ShapeSquareIcon },
  { value: "Round", icon: ShapeRoundIcon },
  { value: "Almond", icon: ShapeAlmondIcon },
  { value: "Squoval", icon: ShapeSquovalIcon },
  { value: "Pointed", icon: ShapePointedIcon },
  { value: "Ballerina", icon: ShapeBallerinaIcon },
];
const styleOptions: SelectorOption[] = [
  { value: "French", icon: StyleFrenchIcon },
  { value: "Floral", icon: StyleFloralIcon },
  { value: "Line Art", icon: StyleLineArtIcon },
  { value: "Geometric", icon: StyleGeometricIcon },
  { value: "Ombre", icon: StyleOmbreIcon },
  { value: "Abstract", icon: StyleAbstractIcon },
  { value: "Dot Nails", icon: StyleDotNailsIcon },
  { value: "Glitter", icon: StyleGlitterIcon },
];
const colorConfigOptions: SelectorOption[] = [
  { value: "Select", icon: ColorBaseIcon },
  { value: "Mono", icon: ColorMonochromaticIcon },
  { value: "Analog", icon: ColorAnalogousIcon },
  { value: "Complim", icon: ColorComplimentaryIcon },
  { value: "Triad", icon: ColorTriadIcon },
  { value: "Tetradic", icon: ColorTetradicIcon },
];

const DesignFormPage = () => {
  const navigate = useNavigate();
  const [selectedLength, setSelectedLength] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColorConfig, setSelectedColorConfig] = useState<string | null>(null);
  const [selectedBaseColor, setSelectedBaseColor] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isBaseColorSelected, setIsBaseColorSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('length');

  const scrollViewRef = useRef<HTMLDivElement>(null);
  const sectionOffsets = useRef({
    length: 0,
    shape: 340,
    style: 620,
    color: 1020,
    done: 2500,
  });

  // This useEffect is for handling route params, which is not directly applicable in a simple web page without a router.
  // For now, it's commented out or can be adapted if a router is introduced later.
  /*
  useEffect(() => {
    if (route.params?.clear) {
      setSelectedLength(null);
      setSelectedShape(null);
      setSelectedStyle(null);
      setSelectedColorConfig(null);
      setSelectedBaseColor(null);
      setActiveSection('length');
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // navigation.setParams({ clear: false }); // This would be handled by the router
    }
  }, [route.params?.clear]);
  */

  const allOptionsSelected = selectedLength && selectedShape && selectedStyle && selectedColorConfig && (selectedColorConfig !== "Select" || selectedBaseColor);

  const handleColorSelect = (hex: string) => {
    setSelectedBaseColor(hex);
    setSelectedColorConfig("Select");
    setShowColorPicker(false);
    setIsBaseColorSelected(true);
  };

  const handleSelect = (setter: React.Dispatch<React.SetStateAction<string | null>>, value: string, nextSection: string) => {
    const startTime = Date.now();
    console.log('handleSelect called');
    if (value === "Select") {
      setShowColorPicker(true);
      return;
    }
    setter(value);
    setActiveSection(nextSection);
    setTimeout(() => {
      if (scrollViewRef.current) {
        const targetOffset = sectionOffsets.current[nextSection];
        if (typeof targetOffset === 'number') {
          scrollViewRef.current.scrollTo({ top: targetOffset, behavior: 'smooth' });
        }
      }
    }, 50);
    const endTime = Date.now();
    console.log(`handleSelect execution time: ${endTime - startTime}ms`);
  };

  const handleImpressMe = async () => {
    if (!allOptionsSelected) {
      alert("Please complete all selections before generating.");
      return;
    }
    setLoading(true);
    try {
      let prompt = `A detailed closeup Nail design with ${selectedLength} length, ${selectedShape} shape, ${selectedStyle} style,`;
      if (selectedColorConfig === "Select" && selectedBaseColor) {
        prompt += ` and a base color of ${selectedBaseColor} with a ${selectedColorConfig} color configuration.`;
      } else {
        prompt += ` and ${selectedColorConfig} color configuration.`;
      }

      const imagePromises = IMAGE_GENERATION_MODELS.map(model => 
        generateDesigns({ prompt, model, num_images: 1, width: 1024, height: 1024 })
      );

      const results = await Promise.all(imagePromises);
      const imageUrls = results.flatMap(result => result.imageUrls);

      setLoading(false);
      navigate('/results', { state: { generatedImages: imageUrls, prompt: prompt } });

    } catch (error: any) {
      setLoading(false);
      console.error("Fatal error in handleImpressMe:", error);
      alert(`Generation Failed: ${error.message}`);
    }
  };

  const Colors = {
    lightYellowCream: '#F5F5DC',
    lightGrayPurple: '#D8BFD8',
    lightDustyBroun: '#B8860B',
  };

  const styles = {
    background: {
      backgroundImage: 'url(/images/bg1.png)', // Assuming bg1.png is in public/images
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%',
    },
    scrollViewContainer: {
      padding: '20px',
      paddingTop: '40px',
      overflowY: 'auto', // Make it scrollable
      maxHeight: '100vh', // Limit height to viewport for scrolling
    },
    title: {
      fontSize: '36px',
      fontFamily: 'PottaOne-Regular', // Ensure this font is loaded in your web app
      color: Colors.lightYellowCream,
      textAlign: 'center',
      marginBottom: '30px',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
    },
    activeSection: {
      backgroundColor: Colors.lightGrayPurple,
      borderRadius: '10px',
      marginBottom: '20px',
    },
    inactiveSection: {
      backgroundColor: Colors.lightDustyBroun,
      opacity: 0.25,
    },
    spacer: {
      height: '50vh', // Equivalent to Dimensions.get('window').height / 2
    },
  };

  return (
    <div style={styles.background}>
      <div ref={scrollViewRef} >
        <h1 style={styles.title}>Create Your Masterpiece</h1>
        <SelectorRow title="Nail Length" options={lengthOptions} onSelect={(value) => handleSelect(setSelectedLength, value, 'shape')} selectedValue={selectedLength} style={activeSection === 'length' ? styles.activeSection : styles.inactiveSection} isActive={activeSection === 'length'} />
        <SelectorRow title="Nail Shape" options={shapeOptions} onSelect={(value) => handleSelect(setSelectedShape, value, 'style')} selectedValue={selectedShape} style={activeSection === 'shape' ? styles.activeSection : styles.inactiveSection} isActive={activeSection === 'shape'} />
        <SelectorRow title="Nail Style" options={styleOptions} onSelect={(value) => handleSelect(setSelectedStyle, value, 'color')} selectedValue={selectedStyle} style={activeSection === 'style' ? styles.activeSection : styles.inactiveSection} isActive={activeSection === 'style'} />
        <SelectorRow title="Color Palette" options={colorConfigOptions} onSelect={(value) => handleSelect(setSelectedColorConfig, value, 'done')} selectedValue={selectedColorConfig} style={activeSection === 'color' ? styles.activeSection : styles.inactiveSection} baseColor={selectedBaseColor} isBaseColorSelected={isBaseColorSelected} isActive={activeSection === 'color'} />

        {allOptionsSelected && (
          <ThreeDButton
            onPress={handleImpressMe}
            disabled={loading}
            loading={loading}
            title="Impress Me"
          />
        )}
        <div style={styles.spacer} />
      </div>
      <ColorPickerModal
        isVisible={showColorPicker}
        onSelectColor={handleColorSelect}
        onClose={() => setShowColorPicker(false)}
      />
    </div>
  );
};

export default DesignFormPage;
