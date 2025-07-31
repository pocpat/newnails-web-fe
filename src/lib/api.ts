const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; // Default to localhost for development

// Assuming firebase.ts will be created and configured for web in the same directory
import { auth } from './firebase';

async function fetchWithAuth(url: string, options?: RequestInit) {
  const user = auth.currentUser;
  let token = null;
  console.log('fetchWithAuth: auth.currentUser:', auth.currentUser);
  if (user) {
    token = await user.getIdToken(true); // Force a token refresh
    console.log('Firebase Token Status:', token ? 'Token successfully retrieved' : 'Token is null');
  } else {
    console.log('No Firebase user found (auth.currentUser is null).');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers,
  };

  console.log('fetchWithAuth: Headers being sent:', headers);
  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
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
    method: 'PATCH',
  });
}