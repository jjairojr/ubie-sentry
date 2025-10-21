import { Loader2 } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

interface ChartData {
  name: string;
  errors: number;
  critical: number;
}

interface ErrorSeverityChartProps {
  data: Array<ChartData>;
  isLoading: boolean;
}

export function ErrorSeverityChart({
  data,
  isLoading,
}: ErrorSeverityChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Severity Distribution</CardTitle>
          <CardDescription>Breakdown by severity level</CardDescription>
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
          <CardTitle>Error Severity Distribution</CardTitle>
          <CardDescription>Breakdown by severity level</CardDescription>
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
        <CardTitle>Error Severity Distribution</CardTitle>
        <CardDescription>
          Total errors vs critical errors over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
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
                if (!active || !payload || !payload.length) {
                  return null;
                }
                const chartData = payload[0].payload;
                return (
                  <div className="p-4 space-y-3 min-w-72 bg-gray-900">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Error ID
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {label}
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
                    <div className="border-t border-border pt-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Statistics
                      </p>
                      {payload.map((entry: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 py-1"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {entry.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {entry.value}
                          </span>
                        </div>
                      ))}
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
              iconType="line"
              verticalAlign="top"
            />
            <Line
              type="monotone"
              dataKey="errors"
              stroke="hsl(208, 100%, 50%)"
              name="Total Errors"
              strokeWidth={3}
              dot={{ fill: "hsl(208, 100%, 50%)", r: 5, strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="critical"
              stroke="hsl(0, 84.2%, 60.2%)"
              name="Critical Errors"
              strokeWidth={3}
              dot={{ fill: "hsl(0, 84.2%, 60.2%)", r: 5, strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
