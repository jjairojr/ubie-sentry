import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
  critical: number;
  warnings: number;
  resolved: number;
}

export function StatsCards({
  total,
  critical,
  warnings,
  resolved,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{total}</div>
          <p className="text-xs text-muted-foreground mt-1">All time errors</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            Critical Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">{critical}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Needs immediate attention
          </p>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-600">
            Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">{warnings}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Non-critical issues
          </p>
        </CardContent>
      </Card>

      <Card className="border-green-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">
            Resolved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{resolved}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Issues fixed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
