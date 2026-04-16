export type PedalPhase = 'plan' | 'engineering' | 'do' | 'analyze' | 'iterate' | 'learn' | 'archived';

export type FeatureStatusType = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'archived';

export interface FeatureStatus {
  phase: PedalPhase;
  status: FeatureStatusType;
  updatedAt: string;
  description: string;
}

export interface HistoryEntry {
  timestamp: string;
  action: string;
  feature: string;
  details: string;
}

export interface PedalStatusResponse {
  version: string;
  lastUpdated: string;
  activeFeatures: string[];
  primaryFeature: string;
  features: Record<string, FeatureStatus>;
  session: {
    startedAt: string;
    lastActivity: string;
  };
  history: HistoryEntry[];
}

export interface ApiError {
  error: string;
  path?: string;
}
