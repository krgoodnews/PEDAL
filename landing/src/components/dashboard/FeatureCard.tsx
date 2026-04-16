import React from 'react';
import { FeatureStatus } from '@/lib/types';

interface FeatureCardProps {
  id: string;
  feature: FeatureStatus;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ id, feature }) => {
  const { status, description, updatedAt } = feature;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'blocked':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'archived':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formattedDate = new Date(updatedAt).toLocaleString();

  return (
    <div
      role="article"
      aria-labelledby={`feature-title-${id}`}
      className="p-4 mb-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 id={`feature-title-${id}`} className="text-lg font-bold text-white truncate mr-2">
          {id}
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
        {description}
      </p>
      <div className="text-[10px] text-gray-500 text-right">
        {formattedDate}
      </div>
    </div>
  );
};

export default FeatureCard;
