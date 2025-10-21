import { AlertCircle } from "lucide-react";
import { BreadcrumbsTab } from "./error-detail/BreadcrumbsTab";
import { StackTraceTab } from "./error-detail/StackTraceTab";
import { ErrorContextTab } from "./error-detail/ErrorContextTab";
import { ErrorStatsCard } from "./error-detail/ErrorStatsCard";
import { SimilarErrorsTab } from "./error-detail/SimilarErrorsTab";
import { useErrorDetail } from "@/hooks/useErrorDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Breadcrumb {
  category: string;
  message: string;
  timestamp: number;
  level?: string;
  data?: any;
}

interface ErrorDetailModalProps {
  fingerprint: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function parseBreadcrumbs(
  breadcrumbsString: string | undefined,
): Array<Breadcrumb> {
  if (!breadcrumbsString) return [];
  try {
    const parsed = JSON.parse(breadcrumbsString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ErrorDetailModal({
  fingerprint,
  isOpen,
  onClose,
}: ErrorDetailModalProps) {
  const { errorDetail } = useErrorDetail(fingerprint);
  const breadcrumbs = parseBreadcrumbs(errorDetail?.error?.breadcrumbs);

  if (!errorDetail) {
    return null;
  }

  const { error, group, similar = [] } = errorDetail;

  if (!error || !group) {
    return null;
  }

  const {
    count = group.count,
    message = error.message,
    errorType = error.errorType,
    fingerprint: fp = error.fingerprint,
  } = group;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg break-words">
                {message}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{errorType}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <ErrorStatsCard
            count={count}
            lastSeen={group.lastSeen}
            firstSeen={group.firstSeen}
            fingerprint={fp}
          />

          {error && (
            <Tabs defaultValue="stack" className="space-y-4">
              <TabsList>
                <TabsTrigger value="stack">Stack Trace</TabsTrigger>
                <TabsTrigger value="breadcrumbs">
                  Breadcrumbs ({breadcrumbs.length})
                </TabsTrigger>
                <TabsTrigger value="similar">
                  Similar ({similar.length})
                </TabsTrigger>
                <TabsTrigger value="context">Context</TabsTrigger>
              </TabsList>

              <TabsContent value="stack" className="space-y-2">
                <StackTraceTab stackTrace={error.stackTrace} />
              </TabsContent>

              <TabsContent value="breadcrumbs" className="space-y-2">
                <BreadcrumbsTab breadcrumbs={breadcrumbs} />
              </TabsContent>

              <TabsContent value="similar" className="space-y-2">
                <SimilarErrorsTab errors={similar} />
              </TabsContent>

              <TabsContent value="context" className="space-y-2">
                <ErrorContextTab error={error} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
