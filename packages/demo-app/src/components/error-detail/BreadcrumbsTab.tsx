import { BreadcrumbsTimeline } from "./BreadcrumbsTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Breadcrumb {
  category: string;
  message: string;
  timestamp: number;
  level?: string;
  data?: any;
}

interface BreadcrumbsTabProps {
  breadcrumbs: Array<Breadcrumb>;
}

export function BreadcrumbsTab({ breadcrumbs }: BreadcrumbsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">User Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <BreadcrumbsTimeline breadcrumbs={breadcrumbs} />
      </CardContent>
    </Card>
  );
}
