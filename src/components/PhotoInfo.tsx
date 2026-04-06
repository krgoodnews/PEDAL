// src/components/PhotoInfo.tsx
import React from 'react';
import type { Photo } from '../types/photo';

interface PhotoInfoProps {
  photo: Photo;
}

const PhotoInfo: React.FC<PhotoInfoProps> = ({ photo }) => {
  return (
    <div className="photo-detail">
      <img src={photo.url} alt={photo.title} />
      <h2>{photo.title}</h2>
      <p>ID: {photo.id}</p>
      <p>Price: ${photo.price}</p>
      <p>{photo.description}</p>
    </div>
  );
};

export default PhotoInfo;
