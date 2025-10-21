import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StackTraceTabProps {
  stackTrace?: string;
}

export function StackTraceTab({ stackTrace }: StackTraceTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Stack Trace</CardTitle>
      </CardHeader>
      <CardContent>
        {stackTrace ? (
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto break-words whitespace-pre-wrap">
            {stackTrace}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            No stack trace available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
