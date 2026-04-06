// src/components/PhotoCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Photo } from '../types/photo';

interface PhotoCardProps {
  photo: Photo;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/photo/${photo.id}`);
  };

  return (
    <div className="photo-card" onClick={handleClick}>
      <img 
        src={photo.thumbnailUrl} 
        alt={photo.title} 
        loading="lazy" 
      />
      <h3>{photo.title}</h3>
    </div>
  );
};

export default PhotoCard;
