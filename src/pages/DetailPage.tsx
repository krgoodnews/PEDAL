// src/pages/DetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPhotoById } from '../lib/api';
import type { Photo } from '../types/photo';
import Layout from '../components/Layout';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotoDetail = async () => {
      if (!id) return;
      try {
        const data = await getPhotoById(Number(id));
        setPhoto(data);
      } catch (err) {
        setError("존재하지 않는 사진이거나 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoDetail();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <button className="btn-back" onClick={handleBack}>&larr; Back to Gallery</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {photo && (
        <div className="photo-detail">
          <img src={photo.url} alt={photo.title} />
          <h2>{photo.title}</h2>
          <p>ID: {photo.id}</p>
          <p>Album ID: {photo.albumId}</p>
        </div>
      )}
    </Layout>
  );
};

export default DetailPage;
