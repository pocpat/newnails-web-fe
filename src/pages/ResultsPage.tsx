import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const { generatedImages } = location.state || {};

  if (!generatedImages || generatedImages.length === 0) {
    return <div>No images generated. Please go back and try again.</div>;
  }

  return (
    <div>
      <h1>Generated Designs</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {generatedImages.map((url, index) => (
          <img key={index} src={url} alt={`Generated design ${index + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
