import React from 'react';
import { FeatureStatus, PedalPhase } from '@/lib/types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  features: Record<string, FeatureStatus>;
}

const PHASES: { phase: PedalPhase; title: string }[] = [
  { phase: 'plan', title: 'Planning' },
  { phase: 'engineering', title: 'Engineering' },
  { phase: 'do', title: 'Implementation' },
  { phase: 'analyze', title: 'Analysis' },
  { phase: 'iterate', title: 'Iteration' },
  { phase: 'learn', title: 'Final' },
  { phase: 'archived', title: 'Archived' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ features }) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-200px)]">
      {PHASES.map(({ phase, title }) => (
        <KanbanColumn key={phase} phase={phase} title={title} features={features} />
      ))}
    </div>
  );
};

export default KanbanBoard;
