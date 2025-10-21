import { Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorTypeData {
  name: string;
  type: string;
  count: number;
}

interface TopErrorTypesChartProps {
  data: Array<ErrorTypeData>;
  isLoading: boolean;
}

export function TopErrorTypesChart({
  data,
  isLoading,
}: TopErrorTypesChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Error Types</CardTitle>
          <CardDescription>Most frequent error types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Error Types</CardTitle>
          <CardDescription>Most frequent error types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Error Types</CardTitle>
        <CardDescription>
          Most frequent error types by occurrence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                border: "2px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              cursor={{ fill: "var(--accent)", opacity: 0.3 }}
              labelStyle={{ color: "var(--foreground)" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) {
                  return null;
                }
                const chartData = payload[0].payload;
                return (
                  <div className="p-4 space-y-3 min-w-72 bg-gray-900">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Type ID
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {chartData.name}
                      </p>
                    </div>
                    {chartData.message && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Message
                        </p>
                        <p className="text-sm text-foreground mt-1 break-words">
                          {chartData.message}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Error Type
                      </p>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded">
                          {chartData.type}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Statistics
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            Occurrences
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {chartData.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "24px",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                justifyContent: "center",
                gap: "24px",
              }}
              height={30}
              verticalAlign="top"
            />
            <Bar
              dataKey="count"
              fill="hsl(208, 100%, 50%)"
              name="Occurrences"
              radius={[8, 8, 0, 0]}
              label={{
                position: "top",
                fontSize: 11,
                fill: "var(--foreground)",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
