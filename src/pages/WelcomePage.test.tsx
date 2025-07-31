import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import { useAuth } from '../lib/auth';

// Mock the useAuth hook
vi.mock('../lib/auth', () => ({
  useAuth: vi.fn(),
}));

describe('WelcomePage', () => {
  test('renders sign in button when user is not signed in', () => {
    // Mock useAuth to return a logged out state
    (useAuth as vi.Mock).mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );
    const signInButton = screen.getByText(/sign in \/ sign up/i);
    expect(signInButton).toBeInTheDocument();
    expect(screen.queryByText(/start/i)).not.toBeInTheDocument();
  });

  test('renders start button when user is signed in', () => {
    // Mock useAuth to return a logged in state
    (useAuth as vi.Mock).mockReturnValue({ user: { uid: '123', email: 'test@example.com' }, loading: false });

    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );
    const startButton = screen.getByText(/start/i);
    expect(startButton).toBeInTheDocument();
    expect(screen.queryByText(/sign in \/ sign up/i)).not.toBeInTheDocument();
  });
});
