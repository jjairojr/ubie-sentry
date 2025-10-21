import { ErrorRepository } from '../repositories/ErrorRepository';
import { ErrorGroupRepository } from '../repositories/ErrorGroupRepository';

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
  trend: TrendData[];
}

export class TrendService {
  constructor(
    private errorRepository: ErrorRepository,
    private errorGroupRepository: ErrorGroupRepository
  ) {}

  async getErrorTrends(projectId: string): Promise<TrendAnalysis[]> {
    const errorGroups = await this.errorGroupRepository.findAllByProjectId(projectId);

    const trendAnalyses: TrendAnalysis[] = [];

    for (const group of errorGroups) {
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const twoDaysAgo = now - 48 * 60 * 60 * 1000;

      const todayErrors = await this.errorRepository.countByProjectIdAndFingerprint(
        projectId,
        group.fingerprint,
        new Date(oneDayAgo),
        new Date(now)
      );

      const yesterdayErrors = await this.errorRepository.countByProjectIdAndFingerprint(
        projectId,
        group.fingerprint,
        new Date(twoDaysAgo),
        new Date(oneDayAgo)
      );

      const trend = await this.getHourlyTrend(projectId, group.fingerprint);

      const trendPercentage = yesterdayErrors > 0
        ? ((todayErrors - yesterdayErrors) / yesterdayErrors) * 100
        : (todayErrors > 0 ? 100 : 0);

      const isSpiking = todayErrors > 0 && yesterdayErrors > 0 && trendPercentage > 50;

      trendAnalyses.push({
        fingerprint: group.fingerprint,
        message: group.message || 'Unknown error',
        errorType: group.errorType || 'Error',
        currentCount: todayErrors,
        previousDayCount: yesterdayErrors,
        trendPercentage: Math.round(trendPercentage),
        isSpiking,
        trend
      });
    }

    return trendAnalyses.sort((a, b) => b.currentCount - a.currentCount);
  }

  private async getHourlyTrend(projectId: string, fingerprint: string): Promise<TrendData[]> {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const hourlyData: TrendData[] = [];

    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now - (i + 1) * 60 * 60 * 1000);
      const hourEnd = new Date(now - i * 60 * 60 * 1000);

      const count = await this.errorRepository.countByProjectIdAndFingerprint(
        projectId,
        fingerprint,
        hourStart,
        hourEnd
      );

      hourlyData.push({
        timestamp: hourStart.getTime(),
        count
      });
    }

    return hourlyData;
  }

  async getRageClickTrends(projectId: string): Promise<any[]> {
    try {
      const errors = await this.errorRepository.findErrorsWithRageClicks(projectId);

      const rageClickMap = new Map<string, { element: string; count: number; lastSeen: number }>();

      for (const error of errors) {
        if (error.breadcrumbs) {
          const breadcrumbs = Array.isArray(error.breadcrumbs) ? error.breadcrumbs :
                             (typeof error.breadcrumbs === 'string' ? JSON.parse(error.breadcrumbs) : []);

          for (const breadcrumb of breadcrumbs) {
            if (breadcrumb.data?.isRageClick) {
              const key = breadcrumb.data.element;
              const existing = rageClickMap.get(key) || { element: key, count: 0, lastSeen: 0 };
              existing.count += 1;
              existing.lastSeen = Math.max(existing.lastSeen, breadcrumb.timestamp);
              rageClickMap.set(key, existing);
            }
          }
        }
      }

      return Array.from(rageClickMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    } catch (error) {
      console.error('[TrendService] Error getting rage click trends:', error);
      return [];
    }
  }
}
