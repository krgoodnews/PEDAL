// src/pages/ListPage.tsx
import React, { useEffect, useState } from 'react';
import { getPhotos } from '../lib/api';
import type { Photo } from '../types/photo';
import PhotoGrid from '../components/PhotoGrid';
import Layout from '../components/Layout';

const ListPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhotos();
      setPhotos(data);
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="btn-back" onClick={fetchPhotos}>Retry</button>
        </div>
      )}
      {!loading && !error && <PhotoGrid photos={photos} />}
    </Layout>
  );
};

export default ListPage;
