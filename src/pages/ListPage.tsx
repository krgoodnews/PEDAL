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

  useEffect(() => {
    const fetchPhotos = async () => {
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

    fetchPhotos();
  }, []);

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && <PhotoGrid photos={photos} />}
    </Layout>
  );
};

export default ListPage;
