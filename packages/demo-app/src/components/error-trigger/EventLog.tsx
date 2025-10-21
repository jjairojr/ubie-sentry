import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  status: "success" | "pending";
}

interface EventLogProps {
  logs: Array<ErrorLog>;
  onClearLogs: () => void;
}

export function EventLog({ logs, onClearLogs }: EventLogProps) {
  return (
    <Card className="lg:col-span-1 h-fit sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Event Log</span>
          {logs.length > 0 && <Badge variant="secondary">{logs.length}</Badge>}
        </CardTitle>
        <CardDescription>Recent triggered events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No events yet. Trigger an error to see it here.
          </p>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 border rounded-md text-xs bg-card/50"
                >
                  <div className="flex items-center justify-between gap-1">
                    <Badge variant="outline" className="text-xs">
                      {log.type}
                    </Badge>
                    {log.status === "success" ? (
                      <span className="text-green-600 text-xs">✓</span>
                    ) : (
                      <span className="text-yellow-600 text-xs">⏳</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 break-words">
                    {log.message}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {log.timestamp}
                  </p>
                </div>
              ))}
            </div>
            {logs.length > 0 && (
              <Button
                onClick={onClearLogs}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Clear Log
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
