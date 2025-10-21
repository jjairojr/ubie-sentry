import { useState } from "react";
import {
  AlertCircle,
  Clock,
  Loader2,
  MousePointer2,
  TrendingUp,
} from "lucide-react";
import { useErrors } from "@/hooks/useErrors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorTrends } from "@/components/ErrorTrends";
import { RageClicksMonitor } from "@/components/RageClicksMonitor";
import { ErrorDetailModal } from "@/components/ErrorDetailModal";
import { ErrorSeverityChart } from "@/components/dashboard/ErrorSeverityChart";
import { TopErrorTypesChart } from "@/components/dashboard/TopErrorTypesChart";

export default function Dashboard() {
  const { stats, recentErrors, errorGroups, isLoading } = useErrors();
  const [selectedErrorFingerprint, setSelectedErrorFingerprint] = useState<
    string | null
  >(null);

  const chartData = recentErrors.slice(0, 7).map((error, idx) => ({
    name: `E${idx + 1}`,
    message: error.message.substring(0, 30),
    errors: error.count,
    critical: error.severity === "critical" ? error.count : 0,
  }));

  const errorTypeData = errorGroups.slice(0, 5).map((group, idx) => ({
    name: `T${idx + 1}`,
    message: group.message ? group.message.substring(0, 25) : `Error Type ${idx + 1}`,
    type: group.errorType || "Error",
    count: group.count,
  }));

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Error Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and track application errors in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time errors
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">
                Critical Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {stats.critical}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Needs immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-600/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.warning}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Potential issues
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-600/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.resolved}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Fixed issues</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2 cursor-pointer">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="rage-clicks" className="flex items-center gap-2 cursor-pointer">
              <MousePointer2 className="h-4 w-4" />
              Rage Clicks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorSeverityChart data={chartData} isLoading={isLoading} />
              <TopErrorTypesChart data={errorTypeData} isLoading={isLoading} />
            </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                  <CardDescription>
                    {isLoading ? "Loading errors..." : "Latest error occurrences"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : recentErrors.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No Errors Yet</AlertTitle>
                      <AlertDescription>
                        Your application is running smoothly. Navigate to the Error
                        Trigger page to test error monitoring.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {recentErrors.map((error) => (
                        <button
                          key={error.id}
                          onClick={() => setSelectedErrorFingerprint(error.id)}
                          className="w-full flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors text-left cursor-pointer"
                        >
                          <div className="mt-1">
                            {error.severity === "critical" ? (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">
                                {error.message}
                              </h3>
                              <Badge variant="outline">{error.type}</Badge>
                              <Badge
                                variant={
                                  error.severity === "critical"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {error.count} occurrences
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {error.timestamp}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <ErrorTrends />
            </TabsContent>

            <TabsContent value="rage-clicks" className="space-y-6">
              <RageClicksMonitor />
            </TabsContent>
        </Tabs>
      </div>

      <ErrorDetailModal
        fingerprint={selectedErrorFingerprint}
        isOpen={!!selectedErrorFingerprint}
        onClose={() => setSelectedErrorFingerprint(null)}
      />
    </div>
  );
}
