import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FeatureCard from '@/components/dashboard/FeatureCard';
import { FeatureStatus } from '@/lib/types';

describe('FeatureCard', () => {
  const mockFeature: FeatureStatus = {
    phase: 'engineering',
    status: 'in_progress',
    updatedAt: '2026-04-16T14:49:35Z',
    description: 'Starting Engineering phase',
  };

  it('renders feature title and description', () => {
    render(<FeatureCard id="mcp-kanban" feature={mockFeature} />);
    
    expect(screen.getByText('mcp-kanban')).toBeDefined();
    expect(screen.getByText('Starting Engineering phase')).toBeDefined();
  });

  it('displays the correct status badge', () => {
    render(<FeatureCard id="mcp-kanban" feature={mockFeature} />);
    
    expect(screen.getByText('in_progress')).toBeDefined();
  });

  it('has correct ARIA attributes for accessibility', () => {
    render(<FeatureCard id="mcp-kanban" feature={mockFeature} />);
    
    const article = screen.getByRole('article');
    expect(article.getAttribute('aria-labelledby')).toBe('feature-title-mcp-kanban');
  });

  it('renders the formatted date', () => {
    render(<FeatureCard id="mcp-kanban" feature={mockFeature} />);
    
    // Check if some part of the date is present (depending on locale formatting, but at least 2026 should be there)
    expect(screen.getByText(/2026/)).toBeDefined();
  });
});
