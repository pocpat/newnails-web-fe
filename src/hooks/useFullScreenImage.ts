import { useState } from 'react';

// This hook manages the state for the full screen image modal
export const useFullScreenImage = () => {
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const openFullScreen = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  // Return the state and the functions to control it
  return {
    fullScreenImage,
    openFullScreen,
    closeFullScreen,
  };
};