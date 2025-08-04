import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import Header from './Header';
import { AuthProvider } from '../lib/auth';

// Mock the useAuth hook for Vitest
vi.mock('../lib/auth', () => ({
  __esModule: true,
  useAuth: () => ({
    user: { uid: 'test-user' }, // Simulate a logged-in user
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Header component', () => {
  test('renders the logo and menu button', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Check for the logo (we'll use text for now)
    expect(screen.getByText('DiPSY')).toBeInTheDocument();

    // Check for the menu button
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  test('clicking menu button opens and closes the menu with correct links', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Menu should be open, check for links
    expect(screen.getByText('My Designs')).toBeInTheDocument();
    expect(screen.getByText('Start Over')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Click the menu button again to close it
    fireEvent.click(menuButton);

    // Menu items should now be gone
    expect(screen.queryByText('My Designs')).not.toBeInTheDocument();
    expect(screen.queryByText('Start Over')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});