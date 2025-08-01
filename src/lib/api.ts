const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Using API_BASE_URL:', API_BASE_URL);

// Assuming firebase.ts will be created and configured for web in the same directory
import { auth } from './firebase';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  let token = null;
  if (user) {
    token = await user.getIdToken(true); // Force a token refresh
  }

  // Correctly initialize Headers object to avoid type errors
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Only add Content-Type if there is a body and it's not already set
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers, // Use the correctly constructed Headers object
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  // Handle cases where the response might be empty
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export async function generateDesigns(designOptions: {
  prompt: string;
  model: string;
  width?: number;
  height?: number;
  num_images?: number;
}) {
  return fetchWithAuth('/api/generate', {
    method: 'POST',
    body: JSON.stringify(designOptions),
  });
}

export async function saveDesign(designData: {
  prompt: string;
  temporaryImageUrl: string;
}) {
  return fetchWithAuth('/api/save-design', {
    method: 'POST',
    body: JSON.stringify(designData),
  });
}

export async function getMyDesigns() {
  return fetchWithAuth('/api/my-designs');
}

export async function deleteDesign(designId: string) {
  return fetchWithAuth(`/api/designs/${designId}`, {
    method: 'DELETE',
  });
}

export async function toggleFavorite(designId: string) {
  return fetchWithAuth(`/api/designs/${designId}/favorite`, {
    method: 'PATCH', // No body, which is the correct fix.
  });
}