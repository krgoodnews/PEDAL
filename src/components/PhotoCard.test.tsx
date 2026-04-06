import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import PhotoCard from './PhotoCard';
import type { Photo } from '../types/photo';

const mockPhoto: Photo = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  price: 100,
  url: 'https://example.com/image.jpg',
  thumbnailUrl: 'https://example.com/thumb.jpg'
};

test('renders photo card with title', () => {
  render(
    <BrowserRouter>
      <PhotoCard photo={mockPhoto} />
    </BrowserRouter>
  );
  
  const titleElement = screen.getByText(/Test Product/i);
  expect(titleElement).toBeDefined();
});
