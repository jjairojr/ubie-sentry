import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorData {
  message: string;
  errorType: string;
  url: string;
  browserInfo: string;
  occurredAt: number;
  createdAt: number;
}

interface ErrorContextTabProps {
  error: ErrorData;
}

export function ErrorContextTab({ error }: ErrorContextTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Error Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Message
          </p>
          <p className="text-sm break-words">{error.message}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Type
          </p>
          <Badge variant="outline">{error.errorType || "Unknown"}</Badge>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            URL
          </p>
          <p className="text-sm font-mono break-all">{error.url}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Browser Info
          </p>
          <p className="text-sm font-mono break-all max-h-20 overflow-y-auto">
            {error.browserInfo}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Occurred At
          </p>
          <p className="text-sm">
            {typeof error.occurredAt === "number" && error.occurredAt > 0
              ? format(new Date(error.occurredAt), "PPpp")
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Created At
          </p>
          <p className="text-sm">
            {typeof error.createdAt === "number" && error.createdAt > 0
              ? format(new Date(error.createdAt), "PPpp")
              : "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
