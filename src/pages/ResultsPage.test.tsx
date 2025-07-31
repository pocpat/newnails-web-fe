import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResultsPage from './ResultsPage';

describe('ResultsPage', () => {
  it('renders a list of images based on the imageUrls in location state', () => {
    const imageUrls = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ];

    render(
      <MemoryRouter initialEntries={[{ pathname: '/results', state: { generatedImages: imageUrls } }]}>
        <Routes>
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(imageUrls.length);

    images.forEach((image, index) => {
      expect(image).toHaveAttribute('src', imageUrls[index]);
    });
  });

  it('renders a message when no images are provided', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/results', state: {} }]}>
        <Routes>
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('No images generated. Please go back and try again.')).toBeInTheDocument();
  });
});
