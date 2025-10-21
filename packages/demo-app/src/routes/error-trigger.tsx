import { useState } from "react";
import { AlertCircle, AlertTriangle, Bug, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { errorMonitor } from "@/lib/sdk-init";

interface ErrorLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  status: "success" | "pending";
}

export default function ErrorTrigger() {
  const [errorLogs, setErrorLogs] = useState<Array<ErrorLog>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (type: string, message: string) => {
    const log: ErrorLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
      status: "pending",
    };
    setErrorLogs((prev) => [log, ...prev]);

    setTimeout(() => {
      setErrorLogs((prev) =>
        prev.map((l) => (l.id === log.id ? { ...l, status: "success" } : l)),
      );
    }, 1000);
  };

  const triggerJSError = async () => {
    setIsLoading(true);
    try {
      addLog("JavaScript Error", "Triggered JavaScript Error");
      throw new Error("This is a test JavaScript error from the trigger page");
    } catch (error) {
      const err = error as Error;
      errorMonitor.captureException(err);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const triggerTypeError = async () => {
    setIsLoading(true);
    try {
      addLog("Type Error", "Triggered Type Error");
      const obj: any = null;
      obj.property.nested.value();
    } catch (error) {
      const err = error as Error;
      errorMonitor.captureException(err);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const triggerReferenceError = async () => {
    setIsLoading(true);
    try {
      addLog("Reference Error", "Triggered Reference Error");
      const undefinedVariable: any = undefined;
      console.log(undefinedVariable.property);
    } catch (error) {
      const err = error as Error;
      errorMonitor.captureException(err);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const triggerCustomError = async () => {
    setIsLoading(true);
    try {
      addLog("Custom Error", "Triggered Custom Error");
      throw new Error("Custom application error: Database connection failed");
    } catch (error) {
      const err = error as Error;
      errorMonitor.captureException(err);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const triggerUnhandledRejection = async () => {
    setIsLoading(true);
    addLog("Unhandled Rejection", "Triggered Unhandled Promise Rejection");
    Promise.reject(new Error("This is an unhandled promise rejection"));
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const triggerMessage = async () => {
    setIsLoading(true);
    addLog("Message", "Captured custom message");
    errorMonitor.captureMessage(
      "This is a test message from the error trigger page",
      "info",
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const triggerBreadcrumb = async () => {
    setIsLoading(true);
    addLog("Breadcrumb", "User action breadcrumb captured");
    errorMonitor.captureException(new Error("Error after user action"));
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const clearLogs = () => {
    setErrorLogs([]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Error Trigger Events
          </h1>
          <p className="text-muted-foreground mt-2">
            Test various error scenarios to see how the monitoring SDK captures
            and reports errors
          </p>
        </div>

        {/* Warning Alert */}
        <Alert className="border-yellow-600/20 bg-yellow-600/5">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Development Feature</AlertTitle>
          <AlertDescription>
            This page is designed for testing error monitoring. Triggering
            errors here will send data to your monitoring server.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Error Triggers */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Error Triggers
                </CardTitle>
                <CardDescription>
                  Click on any button below to trigger different types of errors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={triggerJSError}
                    disabled={isLoading}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    variant="outline"
                  >
                    <Bug className="h-5 w-5" />
                    <span>JavaScript Error</span>
                  </Button>

                  <Button
                    onClick={triggerTypeError}
                    disabled={isLoading}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    variant="outline"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span>Type Error</span>
                  </Button>

                  <Button
                    onClick={triggerReferenceError}
                    disabled={isLoading}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    variant="outline"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span>Reference Error</span>
                  </Button>

                  <Button
                    onClick={triggerCustomError}
                    disabled={isLoading}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    variant="outline"
                  >
                    <Bug className="h-5 w-5" />
                    <span>Custom Error</span>
                  </Button>

                  <Button
                    onClick={triggerUnhandledRejection}
                    disabled={isLoading}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    variant="outline"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>Unhandled Rejection</span>
                  </Button>

                  <Button
                    onClick={triggerMessage}
                    disabled={isLoading}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    variant="outline"
                  >
                    <Bug className="h-5 w-5" />
                    <span>Capture Message</span>
                  </Button>

                  <Button
                    onClick={triggerBreadcrumb}
                    disabled={isLoading}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    variant="outline"
                  >
                    <Zap className="h-5 w-5" />
                    <span>Test Breadcrumb</span>
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Live Monitoring</AlertTitle>
                  <AlertDescription>
                    Keep the Dashboard page open in another tab to see errors
                    appear in real-time
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Event Log */}
          <Card className="lg:col-span-1 h-fit sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Event Log</span>
                {errorLogs.length > 0 && (
                  <Badge variant="secondary">{errorLogs.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>Recent triggered events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {errorLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No events yet. Trigger an error to see it here.
                </p>
              ) : (
                <>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {errorLogs.map((log) => (
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
                  {errorLogs.length > 0 && (
                    <Button
                      onClick={clearLogs}
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
        </div>
      </div>
    </div>
  );
}
