import { AlertCircle, MousePointer2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRageClicks } from '@/hooks/useRageClicks';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function RageClicksMonitor() {
  const { rageClicks, mostFrustratingElement, totalRageClicks, isLoading } = useRageClicks();

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

  if (totalRageClicks === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <MousePointer2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No rage clicks detected yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {mostFrustratingElement && totalRageClicks > 10 && (
        <Card className="p-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                High Frustration Detected
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                Users are frantically clicking {mostFrustratingElement.element}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                <span className="font-semibold">{totalRageClicks}</span> rage clicks in the last 24 hours
              </p>
            </div>
          </div>
        </Card>
      )}

      {mostFrustratingElement && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Most Frustrating Element</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Element receiving the most rapid clicks
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="font-mono text-sm break-all text-foreground">
                {mostFrustratingElement.element}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Rage Clicks</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {mostFrustratingElement.count}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Detected</p>
                <p className="text-sm font-medium">
                  {formatDistanceToNow(new Date(mostFrustratingElement.lastSeen), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {rageClicks.length > 1 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">All Rage Click Events</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rageClicks.map((rc, idx) => (
              <div key={idx} className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-sm truncate flex-1 mr-2">{rc.element}</p>
                  <Badge variant={rc.count > 10 ? 'destructive' : 'secondary'}>
                    {rc.count} clicks
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(rc.lastSeen), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <div className="space-y-2">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200">What are Rage Clicks?</h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Rage clicks are rapid successive clicks on the same element, indicating user frustration. This typically means the element isn't responding as expected or the user experience is broken.
          </p>
        </div>
      </Card>
    </div>
  );
}
