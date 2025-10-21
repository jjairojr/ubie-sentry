import {
  MessageCircle,
  MousePointer,
  Navigation,
  Terminal,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Breadcrumb {
  category: string;
  message: string;
  timestamp: number;
  level?: string;
  data?: any;
}

interface BreadcrumbsTimelineProps {
  breadcrumbs: Array<Breadcrumb>;
}

function getBreadcrumbIcon(category: string, level?: string) {
  if (category === "navigation")
    return <Navigation className="h-4 w-4 text-blue-500" />;
  if (category === "user-interaction")
    return <MousePointer className="h-4 w-4 text-green-500" />;
  if (category === "console") {
    if (level === "error") return <Terminal className="h-4 w-4 text-red-500" />;
    if (level === "warning")
      return <Terminal className="h-4 w-4 text-yellow-500" />;
    return <Terminal className="h-4 w-4 text-gray-500" />;
  }
  return <MessageCircle className="h-4 w-4 text-gray-400" />;
}

export function BreadcrumbsTimeline({ breadcrumbs }: BreadcrumbsTimelineProps) {
  if (breadcrumbs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No breadcrumbs recorded
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="relative">
          <div className="flex gap-4 pb-6 pt-2">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="p-2.5 rounded-full bg-muted border border-border">
                {getBreadcrumbIcon(breadcrumb.category, breadcrumb.level)}
              </div>
              {index < breadcrumbs.length - 1 && (
                <div className="w-0.5 h-12 bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground break-words">
                  {breadcrumb.message}
                </p>
                {breadcrumb.level && (
                  <Badge
                    variant="outline"
                    className="flex-shrink-0 capitalize text-xs font-normal"
                  >
                    {breadcrumb.level}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(breadcrumb.timestamp), "HH:mm:ss.SSS")}
              </p>
              {breadcrumb.category && (
                <p className="text-xs text-muted-foreground/70 mt-0.5 capitalize">
                  {breadcrumb.category}
                </p>
              )}
              {breadcrumb.data && Object.keys(breadcrumb.data).length > 0 && (
                <div className="mt-3 text-xs bg-muted/40 p-3 rounded border border-border/50">
                  <details className="cursor-pointer group">
                    <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                      Details
                    </summary>
                    <pre className="mt-2 text-xs whitespace-pre-wrap break-words text-muted-foreground font-mono">
                      {JSON.stringify(breadcrumb.data, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
