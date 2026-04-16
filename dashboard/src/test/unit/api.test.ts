import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPedalStatus, API_BASE_URL } from '@/lib/api';

describe('fetchPedalStatus', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('fetches status successfully from the API', async () => {
    const mockData = {
      version: '2.0',
      lastUpdated: '2026-04-16T12:00:00Z',
      features: {},
      history: [],
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchPedalStatus();
    
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/status`, expect.any(Object));
    expect(result).toEqual(mockData);
  });

  it('throws an error when the API returns an error object', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ error: 'File not found' }),
    });

    await expect(fetchPedalStatus()).rejects.toThrow('File not found');
  });

  it('throws an error when the fetch fails', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchPedalStatus()).rejects.toThrow('HTTP error! status: 500');
  });
});
