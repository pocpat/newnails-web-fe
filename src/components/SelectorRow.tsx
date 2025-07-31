import React from 'react';

interface SelectorOption {
  value: string;
  icon: string; // Placeholder for icon path/component
}

interface SelectorRowProps {
  title: string;
  options: (string | SelectorOption)[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
  style?: React.CSSProperties; // Use React.CSSProperties for web styles
  baseColor?: string | null;
  isBaseColorSelected?: boolean;
  isActive?: boolean;
}

const Colors = {
  black: '#000000',
  white: '#FFFFFF',
  lightYellowCream: '#F5F5DC',
  dustyBroun: '#B8860B',
  lightPink: '#FFB6C1',
  darkPinkPurple: '#8B008B',
  teal: '#008080',
};

const SelectorRow = React.memo(React.forwardRef<HTMLDivElement, SelectorRowProps>(({ title, options, onSelect, selectedValue, style, baseColor, isBaseColorSelected, isActive }, ref) => {
  const isColorLight = (hexColor: string) => {
    if (!hexColor) return false; // Handle null or undefined hexColor
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      marginBottom: '25px',
    },
    title: {
      fontSize: '18px',
      fontFamily: 'Inter-Bold', // Ensure this font is loaded in your web app
      color: Colors.dustyBroun,
      marginBottom: '10px',
    },
    optionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    option: {
      backgroundColor: 'rgba(119, 105, 121, 1)',
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingLeft: '15px',
      paddingRight: '15px',
      borderRadius: '20px',
      margin: '5px',
      borderWidth: '0px',
      borderColor: Colors.darkPinkPurple,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
    activeOptionShadow: {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    },
    inactiveOptionShadow: {
      boxShadow: 'none',
    },
    selectedOption: {
      backgroundColor: Colors.lightPink,
      borderColor: Colors.lightPink,
    },
    optionText: {
      color: Colors.black,
      fontFamily: 'Inter-Variable', // Ensure this font is loaded
      fontSize: '8px',
    },
    selectedOptionText: {
      color: Colors.teal,
      fontFamily: 'Inter-Bold',
    },
    lengthOption: {
      width: '80px',
      height: '100px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBottom: '10px',
      paddingTop: '10px',
    },
    optionIcon: {
      width: '60px',
      height: '60px',
    },
    colorSchemeDisabledOption: {
      opacity: 0.8,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    optionContent: {
      alignItems: 'center',
    },
  };

  return (
    <div ref={ref} style={{ ...styles.container, ...style }}>
      <h2 style={styles.title}>{title}</h2>
      <div style={styles.optionsContainer}>
        {options.map((option) => {
          const isObject = typeof option === 'object' && option !== null;
          const value = isObject ? (option as SelectorOption).value : (option as string);
          const Icon = isObject ? (option as SelectorOption).icon : undefined;

          const isSelectedAndColorPalette = selectedValue === value && title === "Color Palette" && value === "Select" && baseColor;
          const optionBackgroundColor = isSelectedAndColorPalette ? baseColor : (selectedValue === value ? styles.selectedOption.backgroundColor : styles.option.backgroundColor);
          let optionBorderColor = styles.option.borderColor;
          let optionBorderWidth = styles.option.borderWidth;

          if (title === "Color Palette" && value === "Select") {
            if (baseColor) {
              optionBorderColor = baseColor;
              optionBorderWidth = '1px';
            } else {
              optionBorderColor = '#FFFFFF';
              optionBorderWidth = '3px';
            }
          } else if (selectedValue === value) {
            optionBorderColor = styles.selectedOption.borderColor;
            optionBorderWidth = '1px';
          }

          const optionTextColor = isSelectedAndColorPalette ? (isColorLight(baseColor || '') ? Colors.black : Colors.white) : (selectedValue === value ? styles.selectedOptionText.color : styles.optionText.color);

          return (
            <button
              key={value}
              style={{
                ...styles.option,
                backgroundColor: optionBackgroundColor,
                borderColor: optionBorderColor,
                borderWidth: optionBorderWidth,
                ...( (title === "Nail Length" || title === "Nail Shape" || title === "Nail Style" || title === "Color Palette") && styles.lengthOption),
                ...(title === "Color Palette" && value !== "Select" && !isBaseColorSelected && styles.colorSchemeDisabledOption),
                ...(isActive ? styles.activeOptionShadow : styles.inactiveOptionShadow),
              }}
              onClick={() => onSelect(value)}
              disabled={title === "Color Palette" && value !== "Select" && !isBaseColorSelected}
            >
              {Icon ? (
                <>
                  <div style={styles.optionIcon}>
                    {/* For now, just display the value as text or an empty div for the icon */}
                    {Icon ? <img src={Icon} alt={value} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{ width: '100%', height: '100%' }} />}
                  </div>
                  <span style={{ ...styles.optionText, color: optionTextColor }}>
                    {value}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    ...styles.optionText,
                    color: optionTextColor,
                  }}
                >
                  {value}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}));

export default SelectorRow;