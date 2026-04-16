'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { fetchPedalStatus } from '@/lib/api';
import { PedalStatusResponse } from '@/lib/types';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import StatusHeader from '@/components/dashboard/StatusHeader';
import { MeshGradient } from '@/components/ui/MeshGradient';

export default function DashboardPage() {
  const [data, setData] = useState<PedalStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchPedalStatus();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to MCP server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-blue-500/30">
      <MeshGradient color1="#1e1b4b" color2="#1e3a8a" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <StatusHeader 
          lastUpdated={data?.lastUpdated || ''} 
          onRefresh={loadData} 
          isLoading={isLoading} 
        />

        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex flex-col gap-2">
            <p className="font-bold">Error Connecting to MCP Server</p>
            <p className="text-sm opacity-90">{error}</p>
            <button 
              onClick={loadData}
              className="text-xs underline w-fit hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!data && isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-white/10 animate-spin"></div>
              <p className="text-gray-400 font-mono">Loading PEDAL status...</p>
            </div>
          </div>
        ) : data ? (
          <KanbanBoard features={data.features} />
        ) : null}
      </div>
    </main>
  );
}
