// src/lib/api.ts
import type { Photo } from "../types/photo";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://dummyjson.com";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  try {
    const response = await fetch(url);
    
    if (response.status === 429) {
      if (retries > 0) {
        const retryAfter = response.headers.get("Retry-After");
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.warn(`Rate limit hit. Retrying after ${delay}ms...`);
        await sleep(delay);
        return fetchWithRetry(url, retries - 1);
      }
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    if (!response.ok) {
      throw new Error(`HTTP_ERROR_${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.message === "RATE_LIMIT_EXCEEDED" || error.message.startsWith("HTTP_ERROR_")) {
      throw error;
    }
    if (retries > 0) {
      await sleep(2000);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
};

export const getPhotos = async (): Promise<Photo[]> => {
  const data = await fetchWithRetry(`${API_BASE_URL}/products?limit=100`);
  
  return data.products.map((product: any) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    url: product.images[0],
    thumbnailUrl: `https://dummyjson.com/icon/product_${product.id}/500`
  }));
};

export const getPhotoById = async (id: number): Promise<Photo> => {
  const product = await fetchWithRetry(`${API_BASE_URL}/products/${id}`);
  
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    url: product.images[0],
    thumbnailUrl: `https://dummyjson.com/icon/product_${product.id}/500`
  };
};
