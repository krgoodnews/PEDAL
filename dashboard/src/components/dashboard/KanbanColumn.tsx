import React from 'react';
import { FeatureStatus, PedalPhase } from '@/lib/types';
import FeatureCard from './FeatureCard';

interface KanbanColumnProps {
  title: string;
  phase: PedalPhase;
  features: Record<string, FeatureStatus>;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, phase, features }) => {
  const filteredFeatures = Object.entries(features).filter(
    ([_, feature]) => feature.phase === phase
  );

  return (
    <div className="flex flex-col h-full min-w-[300px] w-full max-w-[400px]">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h2>
        <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">
          {filteredFeatures.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 bg-black/20 rounded-xl border border-white/5 scrollbar-hide">
        {filteredFeatures.map(([id, feature]) => (
          <FeatureCard key={id} id={id} feature={feature} />
        ))}
        {filteredFeatures.length === 0 && (
          <div className="h-full flex items-center justify-center text-xs text-gray-600 italic">
            No items in this phase
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
