import { observer } from "mobx-react-lite";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PatientDto } from "@/api/models/patient.model";

interface Data {
  data: PatientDto.Graph;
}

export const AnalyticsChart: React.FC<Data> = observer((x) => {
  const chartConfig = {
    info: {
      label: x.data.y_axis,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="gap-2">
      <div className="flex items-center gap-2 space-y-0">
        <div className="grid flex-1 gap-1">
          <h2 className="text-lg font-semibold">{x.data.title}</h2>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[400px] w-full min-h-48"
      >
        <LineChart data={x.data.data?.reverse() ?? []}>
          <defs>
            <linearGradient id="fillall_count" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-info)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-info)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillConversion" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-info)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-info)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("ru-RU", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("ru-RU", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Line
            dataKey="info"
            type="monotone"
            strokeWidth={2}
            dot={false}
            // fill="url(#fillall_count)"
            stroke="var(--color-info)"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
});
