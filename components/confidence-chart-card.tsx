"use client";

import { Download, LineChart as LineChartIcon } from "lucide-react";
import { toPng } from "html-to-image";
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
import type { ConfidenceJourneyPoint } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfidenceChartCard({
  chartRef,
  journey,
  readiness,
}: {
  chartRef: React.RefObject<HTMLDivElement | null>;
  journey: ConfidenceJourneyPoint[];
  readiness: number;
}) {
  const downloadPng = async () => {
    if (!chartRef.current) {
      return;
    }

    const png = await toPng(chartRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.href = png;
    link.download = `electra-confidence-${readiness}.png`;
    link.click();
  };

  const baseline = journey[0]?.readiness ?? readiness;
  const delta = readiness - baseline;

  return (
    <Card ref={chartRef}>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4 text-[var(--primary)]" />
            Confidence Journey
          </CardTitle>
          <CardDescription>
            Proof of impact across documents, EVM, rights, timelines, and myth resistance.
          </CardDescription>
          <p className="mt-3 text-sm font-medium text-[var(--accent)]">
            I went from {baseline}% to {readiness}% election ready.
            {delta > 0 ? ` That is a ${delta}-point lift.` : ""}
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => void downloadPng()}>
          <Download className="h-4 w-4" />
          Share proof card
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={journey}
              margin={{ left: -12, right: 12, top: 12, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  background: "rgba(8, 17, 31, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f8fbff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="documents"
                stroke="var(--chart-documents)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line type="monotone" dataKey="evm" stroke="var(--chart-evm)" strokeWidth={2} dot={{ r: 3 }} />
              <Line
                type="monotone"
                dataKey="rights"
                stroke="var(--chart-rights)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="timelines"
                stroke="var(--chart-timelines)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="myths"
                stroke="var(--chart-myths)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
