import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Error {
  id: string;
  message: string;
  errorType: string;
  count: number;
  severity?: string;
  occurredAt: number;
}

interface RecentErrorsListProps {
  errors: Array<Error>;
  onSelectError: (fingerprint: string) => void;
}

function getSeverityColor(severity?: string) {
  if (severity === "critical") return "bg-destructive/10 text-destructive";
  if (severity === "warning") return "bg-yellow-500/10 text-yellow-600";
  return "bg-blue-500/10 text-blue-600";
}

export function RecentErrorsList({
  errors,
  onSelectError,
}: RecentErrorsListProps) {
  if (errors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No errors recorded yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Errors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {errors.map((error) => (
            <button
              key={error.id}
              onClick={() => onSelectError(error.id)}
              className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {error.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {error.errorType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {error.count} occurrence{error.count > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {error.severity && (
                  <Badge className={`flex-shrink-0 ${getSeverityColor(error.severity)}`}>
                    {error.severity}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
