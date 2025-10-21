import { AlertCircle, AlertTriangle, Bug, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorTriggerButtonsProps {
  isLoading: boolean;
  onTriggerJSError: () => void;
  onTriggerTypeError: () => void;
  onTriggerReferenceError: () => void;
  onTriggerCustomError: () => void;
  onTriggerUnhandledRejection: () => void;
  onTriggerMessage: () => void;
  onTriggerBreadcrumb: () => void;
}

export function ErrorTriggerButtons({
  isLoading,
  onTriggerJSError,
  onTriggerTypeError,
  onTriggerReferenceError,
  onTriggerCustomError,
  onTriggerUnhandledRejection,
  onTriggerMessage,
  onTriggerBreadcrumb,
}: ErrorTriggerButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Button
        onClick={onTriggerJSError}
        disabled={isLoading}
        className="h-auto py-3 flex flex-col items-center gap-1"
        variant="outline"
      >
        <Bug className="h-5 w-5" />
        <span>JavaScript Error</span>
      </Button>

      <Button
        onClick={onTriggerTypeError}
        disabled={isLoading}
        className="h-auto py-3 flex flex-col items-center gap-1"
        variant="outline"
      >
        <AlertCircle className="h-5 w-5" />
        <span>Type Error</span>
      </Button>

      <Button
        onClick={onTriggerReferenceError}
        disabled={isLoading}
        className="h-auto py-3 flex flex-col items-center gap-1"
        variant="outline"
      >
        <AlertCircle className="h-5 w-5" />
        <span>Reference Error</span>
      </Button>

      <Button
        onClick={onTriggerCustomError}
        disabled={isLoading}
        className="h-auto py-3 flex flex-col items-center gap-1"
        variant="outline"
      >
        <Bug className="h-5 w-5" />
        <span>Custom Error</span>
      </Button>

      <Button
        onClick={onTriggerUnhandledRejection}
        disabled={isLoading}
        className="h-auto py-3 flex flex-col items-center gap-1"
        variant="outline"
      >
        <AlertTriangle className="h-5 w-5" />
        <span>Unhandled Rejection</span>
      </Button>

      <Button
        onClick={onTriggerMessage}
        disabled={isLoading}
        className="h-auto py-3 flex flex-col items-center gap-1"
        variant="outline"
      >
        <Bug className="h-5 w-5" />
        <span>Capture Message</span>
      </Button>

      <Button
        onClick={onTriggerBreadcrumb}
        disabled={isLoading}
        className="h-auto py-3 flex flex-col items-center gap-1"
        variant="outline"
      >
        <Zap className="h-5 w-5" />
        <span>Test Breadcrumb</span>
      </Button>
    </div>
  );
}
