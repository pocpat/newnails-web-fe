import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import FullScreenImageModal from './FullScreenImageModal';

describe('FullScreenImageModal', () => {
  const onCloseMock = vi.fn();

  test('does not render when isVisible is false', () => {
    render(
      <FullScreenImageModal
        isVisible={false}
        imageUrl=""
        onClose={onCloseMock}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders the modal with the image when isVisible is true', () => {
    const imageUrl = 'https://example.com/test-image.jpg';
    render(
      <FullScreenImageModal
        isVisible={true}
        imageUrl={imageUrl}
        onClose={onCloseMock}
      />
    );

    // Check that the modal container is visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check that the image is displayed with the correct src
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', imageUrl);
  });

  test('calls the onClose function when the close button is clicked', () => {
    render(
      <FullScreenImageModal
        isVisible={true}
        imageUrl="https://example.com/test-image.jpg"
        onClose={onCloseMock}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
