import { useQuery } from "@tanstack/react-query";
import { fetchErrorGroupDetail } from "./api";

export function useErrorDetail(fingerprint: string | null) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["error-detail", fingerprint],
    queryFn: () => fetchErrorGroupDetail(fingerprint!),
    enabled: !!fingerprint,
    refetchInterval: 3000,
    staleTime: 2000,
  });

  return {
    errorDetail: data,
    isLoading,
    isError,
    error,
  };
}
