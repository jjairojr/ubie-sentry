import { AlertTriangle, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTrends } from '@/hooks/useTrends';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ErrorTrends() {
  const { trends, spikingErrors, highestGrowth, isLoading } = useTrends();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </Card>
    );
  }

  if (trends.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No trends data available yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {spikingErrors.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                {spikingErrors.length} Error{spikingErrors.length !== 1 ? 's' : ''} Spiking
              </h3>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                Error rates have increased more than 50% compared to yesterday
              </p>
              <div className="mt-2 space-y-1">
                {spikingErrors.slice(0, 3).map((error) => (
                  <div key={error.fingerprint} className="text-sm text-red-700 dark:text-red-400">
                    <span className="font-medium">{error.message}</span>
                    <span className="text-red-600 dark:text-red-500 ml-2">
                      ↑ {error.trendPercentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {highestGrowth && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Highest Growth</h3>
              <p className="text-sm text-muted-foreground mb-3">{highestGrowth.message}</p>
            </div>

            {highestGrowth.trend && highestGrowth.trend.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={highestGrowth.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "2px solid var(--border)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                      cursor={{ stroke: "var(--border)", strokeWidth: 2 }}
                      labelStyle={{ color: "var(--foreground)" }}
                      content={({ active, payload, label }) => {
                        /* eslint-disable @typescript-eslint/no-unnecessary-condition */
                        if (!active || !payload || !payload.length) {
                          return null;
                        }
                        /* eslint-enable @typescript-eslint/no-unnecessary-condition */
                        return (
                          <div className="p-4 space-y-2 min-w-64">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Timestamp
                              </p>
                              <p className="text-sm font-medium text-foreground mt-1">
                                {new Date(label as number).toLocaleString()}
                              </p>
                            </div>
                            <div className="border-t border-border pt-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                Error Count
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span className="text-sm font-semibold text-foreground">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : null}

            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-lg font-semibold">{highestGrowth.currentCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Yesterday</p>
                <p className="text-lg font-semibold">{highestGrowth.previousDayCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Change</p>
                <Badge variant={highestGrowth.trendPercentage > 0 ? 'destructive' : 'secondary'}>
                  {highestGrowth.trendPercentage > 0 ? '+' : ''}{highestGrowth.trendPercentage}%
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {trends.length > 1 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">All Error Trends</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {trends.map((trend) => (
              <div key={trend.fingerprint} className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{trend.message}</p>
                  <Badge variant={trend.isSpiking ? 'destructive' : 'outline'}>
                    {trend.isSpiking ? '🔥 Spiking' : 'Normal'}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>Today: <span className="font-semibold text-foreground">{trend.currentCount}</span></div>
                  <div>Yesterday: <span className="font-semibold text-foreground">{trend.previousDayCount}</span></div>
                  <div>Change: <span className={trend.trendPercentage > 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-green-600 dark:text-green-400 font-semibold'}>
                    {trend.trendPercentage > 0 ? '+' : ''}{trend.trendPercentage}%
                  </span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
