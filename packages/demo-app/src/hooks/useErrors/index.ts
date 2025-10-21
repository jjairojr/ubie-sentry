import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { fetchErrorGroups } from "./api";
import type {
  ErrorGroup,
  ErrorStats,
  RecentError,
  UseErrorsReturn,
} from "./types";

interface PaginatedResponse<T> {
  data: Array<T>;
  total: number;
  limit: number;
  offset: number;
}

export function useErrors(): UseErrorsReturn {
  const { data: errorGroupsData, isLoading: groupsLoading } = useInfiniteQuery({
    queryKey: ["error-groups"],
    queryFn: ({ pageParam = 0 }) => fetchErrorGroups(pageParam),
    getNextPageParam: (lastPage: PaginatedResponse<any>) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0,
    refetchInterval: 1000,
    staleTime: 0,
  });

  const errorGroups = errorGroupsData?.pages.flatMap((page) => page.data) || [];

  const stats: ErrorStats = {
    total: errorGroups.reduce(
      (sum: number, group: ErrorGroup) => sum + (group.count || 0),
      0,
    ),
    critical: errorGroups
      .filter((g: ErrorGroup) => g.errorType === "Error")
      .reduce((sum: number, group: ErrorGroup) => sum + (group.count || 0), 0),
    warning: errorGroups
      .filter((g: ErrorGroup) => g.errorType === "Warning")
      .reduce((sum: number, group: ErrorGroup) => sum + (group.count || 0), 0),
    resolved: 0,
  };

  const recentErrors: Array<RecentError> = errorGroups
    .slice(0, 10)
    .map((group: ErrorGroup) => ({
      id: group.fingerprint,
      message: group.message,
      type: group.errorType || "Error",
      severity:
        group.errorType === "Error"
          ? "critical"
          : group.errorType === "Warning"
            ? "warning"
            : "info",
      timestamp: formatDistanceToNow(new Date(group.lastSeen), {
        addSuffix: true,
      }),
      count: group.count || 1,
    }));

  return {
    errorGroups,
    stats,
    recentErrors,
    isLoading: groupsLoading,
  };
}

export type * from "./types";
