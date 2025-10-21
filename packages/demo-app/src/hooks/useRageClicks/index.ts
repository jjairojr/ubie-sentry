import { useQuery } from "@tanstack/react-query";
import { fetchRageClicks } from "./api";
import type { RageClick, UseRageClicksReturn } from "./types";

export function useRageClicks(): UseRageClicksReturn {
  const { data: rageClicksData, isLoading, error } = useQuery({
    queryKey: ["rage-clicks"],
    queryFn: () => fetchRageClicks(),
    refetchInterval: 5000,
    staleTime: 2000,
  });

  const rageClicks: Array<RageClick> = rageClicksData?.data || [];

  const mostFrustratingElement = rageClicks.length > 0 ? rageClicks[0] : null;

  return {
    rageClicks,
    mostFrustratingElement,
    totalRageClicks: rageClicks.reduce((sum, rc) => sum + rc.count, 0),
    isLoading,
    error: error,
  };
}

export type * from "./types";
