// src/lib/api.ts
import type { Photo } from "../types/photo";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://dummyjson.com";

export const getPhotos = async (): Promise<Photo[]> => {
  const response = await fetch(`${API_BASE_URL}/products?limit=100`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  
  // DummyJSON 상품 데이터를 Photo 인터페이스로 매핑
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
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product detail");
  }
  const product = await response.json();
  
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    url: product.images[0],
    thumbnailUrl: `https://dummyjson.com/icon/product_${product.id}/500`
  };
};
