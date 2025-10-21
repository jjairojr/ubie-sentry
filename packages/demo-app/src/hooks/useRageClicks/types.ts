export interface RageClick {
  element: string;
  count: number;
  lastSeen: number;
}

export interface UseRageClicksReturn {
  rageClicks: Array<RageClick>;
  mostFrustratingElement: RageClick | null;
  totalRageClicks: number;
  isLoading: boolean;
  error: Error | null;
}
