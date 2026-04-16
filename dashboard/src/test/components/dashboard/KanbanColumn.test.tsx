import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KanbanColumn from '@/components/dashboard/KanbanColumn';
import { FeatureStatus } from '@/lib/types';

describe('KanbanColumn', () => {
  const mockFeatures: Record<string, FeatureStatus> = {
    'feature-1': {
      phase: 'plan',
      status: 'in_progress',
      updatedAt: '2026-04-16T10:00:00Z',
      description: 'Planning feature 1',
    },
    'feature-2': {
      phase: 'plan',
      status: 'completed',
      updatedAt: '2026-04-16T11:00:00Z',
      description: 'Plan complete for feature 2',
    },
  };

  it('renders the column title and count', () => {
    render(<KanbanColumn title="Planning" phase="plan" features={mockFeatures} />);
    
    expect(screen.getByText('Planning')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined(); // Count should be 2
  });

  it('renders cards for features in the correct phase', () => {
    render(<KanbanColumn title="Planning" phase="plan" features={mockFeatures} />);
    
    expect(screen.getByText('feature-1')).toBeDefined();
    expect(screen.getByText('feature-2')).toBeDefined();
  });

  it('does not render cards for features in different phases', () => {
    const mixedFeatures: Record<string, FeatureStatus> = {
      ...mockFeatures,
      'feature-3': {
        phase: 'engineering',
        status: 'pending',
        updatedAt: '2026-04-16T12:00:00Z',
        description: 'Eng for feature 3',
      },
    };

    render(<KanbanColumn title="Planning" phase="plan" features={mixedFeatures} />);
    
    expect(screen.queryByText('feature-3')).toBeNull();
  });
});
