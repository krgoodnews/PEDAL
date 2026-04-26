import React from 'react';
import { RefreshCw } from 'lucide-react';

interface StatusHeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const StatusHeader: React.FC<StatusHeaderProps> = ({ lastUpdated, onRefresh, isLoading }) => {
  const formattedDate = lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">PEDAL Dashboard</h1>
        <p className="text-sm text-gray-400">
          Last updated: <span className="text-gray-300 font-mono">{formattedDate}</span>
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        aria-label="Refresh status"
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
      </button>
    </div>
  );
};

export default StatusHeader;
