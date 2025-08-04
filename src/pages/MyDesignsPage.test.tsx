import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import MyDesignsPage from '../pages/MyDesignsPage';
import * as api from '../lib/api';
import { Colors } from '../lib/colors';

// Mock the API module
vi.mock('../lib/api', () => ({
  getMyDesigns: vi.fn(),
  toggleFavorite: vi.fn(),
  deleteDesign: vi.fn(),
}));

const mockDesigns = [
  { _id: '1', permanentUrl: 'https://example.com/image1.jpg', prompt: 'Recent, not favorite', isFavorite: false, createdAt: new Date('2025-08-01T12:00:00Z').toISOString() },
  { _id: '2', permanentUrl: 'https://example.com/image2.jpg', prompt: 'Old, favorite', isFavorite: true, createdAt: new Date('2025-08-01T10:00:00Z').toISOString() },
];

describe('MyDesignsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getMyDesigns as vi.Mock).mockResolvedValue(mockDesigns);
  });

  test('renders sort buttons and sorts by recent by default', async () => {
    render(<Router><MyDesignsPage /></Router>);
    await waitFor(() => {
      // Check for sort buttons
      expect(screen.getByRole('button', { name: /sort by recent/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sort by favorites/i })).toBeInTheDocument();
    });

    // Check default order (most recent first)
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Recent, not favorite');
    expect(images[1]).toHaveAttribute('alt', 'Old, favorite');
  });

  test('clicking "Sort by Favorites" re-orders the designs', async () => {
    render(<Router><MyDesignsPage /></Router>);
    let favoritesButton;
    await waitFor(() => {
      favoritesButton = screen.getByRole('button', { name: /sort by favorites/i });
    });

    fireEvent.click(favoritesButton);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      // Favorite item should now be first
      expect(images[0]).toHaveAttribute('alt', 'Old, favorite');
      expect(images[1]).toHaveAttribute('alt', 'Recent, not favorite');
    });
  });
});
