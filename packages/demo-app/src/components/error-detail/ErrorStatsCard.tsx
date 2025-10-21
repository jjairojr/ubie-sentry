import { format } from "date-fns";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorStatsCardProps {
  count: number;
  lastSeen: number;
  firstSeen: number;
  fingerprint: string;
}

export function ErrorStatsCard({
  count,
  lastSeen,
  firstSeen,
  fingerprint,
}: ErrorStatsCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const lastSeenDate = new Date(lastSeen);
  const firstSeenDate = new Date(firstSeen);
  const fpText = fingerprint || "N/A";

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Total Occurrences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Last Seen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            {new Date(lastSeenDate).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {format(lastSeenDate, "PPpp")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            First Seen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            {new Date(firstSeenDate).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {format(firstSeenDate, "PPpp")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Fingerprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => copyToClipboard(fpText, "fingerprint")}
            className="flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
            disabled={fpText === "N/A"}
          >
            {fpText === "N/A" ? fpText : fpText.substring(0, 8) + "..."}
            {fpText !== "N/A" &&
              (copiedId === "fingerprint" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              ))}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
