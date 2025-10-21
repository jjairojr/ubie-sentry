export interface TrendData {
  timestamp: number;
  count: number;
}

export interface TrendAnalysis {
  fingerprint: string;
  message: string;
  errorType: string;
  currentCount: number;
  previousDayCount: number;
  trendPercentage: number;
  isSpiking: boolean;
  trend: Array<TrendData>;
}

export interface UseTrendsReturn {
  trends: Array<TrendAnalysis>;
  spikingErrors: Array<TrendAnalysis>;
  highestGrowth: TrendAnalysis | null;
  isLoading: boolean;
  error: Error | null;
}
