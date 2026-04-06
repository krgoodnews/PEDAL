// src/pages/DetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPhotoById } from '../lib/api';
import type { Photo } from '../types/photo';
import Layout from '../components/Layout';
import PhotoInfo from '../components/PhotoInfo';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotoDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPhotoById(Number(id));
      setPhoto(data);
    } catch (err) {
      setError("존재하지 않는 상품이거나 정보를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotoDetail();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <button className="btn-back" onClick={handleBack}>&larr; Back to Gallery</button>
      {loading && <p>Loading...</p>}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="btn-back" onClick={fetchPhotoDetail}>Retry</button>
        </div>
      )}
      {photo && <PhotoInfo photo={photo} />}
    </Layout>
  );
};

export default DetailPage;
