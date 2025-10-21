import { useQuery } from "@tanstack/react-query";
import { fetchTrends } from "./api";
import type { TrendAnalysis, UseTrendsReturn } from "./types";

export function useTrends(): UseTrendsReturn {
  const { data: trendsData, isLoading, error } = useQuery({
    queryKey: ["trends"],
    queryFn: () => fetchTrends(),
    refetchInterval: 5000,
    staleTime: 2000,
  });

  const trends: Array<TrendAnalysis> = trendsData?.data || [];

  const spikingErrors = trends.filter(t => t.isSpiking);
  const highestGrowth = trends.length > 0 ? trends[0] : null;

  return {
    trends,
    spikingErrors,
    highestGrowth,
    isLoading,
    error: error,
  };
}

export type * from "./types";
