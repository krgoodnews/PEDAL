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
    } catch (err: any) {
      if (err.message === "RATE_LIMIT_EXCEEDED") {
        setError("요청이 너무 많아 일시적으로 차단되었습니다. 잠시 후 다시 시도해 주세요.");
      } else {
        setError("데이터를 불러오는데 실패했습니다. 네트워크 상태를 확인해 주세요.");
      }
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
      {loading && <p>Loading Products...</p>}
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
