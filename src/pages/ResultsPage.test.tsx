import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import ResultsPage from './ResultsPage';
import * as api from '../lib/api';

// Mock the API module
vi.mock('../lib/api', () => ({
  saveDesign: vi.fn(),
}));

// Mock react-router-dom's useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

const mockImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
];

describe('ResultsPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Setup the mock for useLocation to return our images
    (useLocation as vi.Mock).mockReturnValue({
      state: { generatedImages: mockImages },
    });
  });

  test('renders generated images with Save and Full Screen buttons', () => {
    render(<Router><ResultsPage /></Router>);

    // Check for the images
    expect(screen.getAllByRole('img')).toHaveLength(2);

    // Check for the buttons for each image
    expect(screen.getAllByRole('button', { name: 'Save' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Full Screen' })).toHaveLength(2);
  });

  test('clicking "Full Screen" button opens the modal', () => {
    render(<Router><ResultsPage /></Router>);

    // Initially, the modal should not be visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click the first "Full Screen" button
    const fullScreenButtons = screen.getAllByRole('button', { name: 'Full Screen' });
    fireEvent.click(fullScreenButtons[0]);

    // Now the modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // The image in the modal should have the correct src
    const modalImage = screen.getByRole('img', { name: /full screen view/i });
    expect(modalImage).toHaveAttribute('src', mockImages[0]);
  });

  test('clicking "Save" button calls the API and updates the button text', async () => {
    (api.saveDesign as vi.Mock).mockResolvedValue({ success: true });

    render(<Router><ResultsPage /></Router>);

    const saveButtons = screen.getAllByRole('button', { name: 'Save' });
    fireEvent.click(saveButtons[0]);

    // Verify the API was called correctly
    await waitFor(() => {
      expect(api.saveDesign).toHaveBeenCalledWith({
        temporaryImageUrl: mockImages[0],
        prompt: `Generated design ${mockImages[0]}`, // This will need to be adjusted based on implementation
      });
    });

    // The button should now be updated to show it's saved
    expect(screen.getAllByRole('button', { name: 'Saved' })[0]).toBeInTheDocument();
  });
});