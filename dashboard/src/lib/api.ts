import { PedalStatusResponse, ApiError } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function fetchPedalStatus(): Promise<PedalStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as PedalStatusResponse | ApiError;

    if ('error' in data) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch PEDAL status:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred while fetching status');
  }
}
