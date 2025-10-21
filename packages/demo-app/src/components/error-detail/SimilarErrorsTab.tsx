import { AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ErrorData {
  id: string;
  message: string;
  errorType: string;
  occurredAt: number;
}

interface SimilarErrorsTabProps {
  errors: Array<ErrorData>;
}

export function SimilarErrorsTab({ errors }: SimilarErrorsTabProps) {
  if (errors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Similar Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No similar errors found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Similar Errors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {errors.map((error, index) => (
            <div
              key={error.id}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {error.errorType}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground break-words">
                    {error.message}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3" />
                    {format(new Date(error.occurredAt), "PPpp")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
