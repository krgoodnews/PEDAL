// src/lib/api.ts
import type { Photo } from "../types/photo";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://jsonplaceholder.typicode.com";

export const getPhotos = async (): Promise<Photo[]> => {
  const response = await fetch(`${API_BASE_URL}/photos?_limit=100`);
  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }
  return response.json();
};

export const getPhotoById = async (id: number): Promise<Photo> => {
  const response = await fetch(`${API_BASE_URL}/photos/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch photo detail");
  }
  return response.json();
};
