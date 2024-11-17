import { observer } from "mobx-react-lite";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";

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
  const filteredData = Object.entries(x.data.data ?? {}).map(([date, info]) => {
    return {
      date: new Date(date),
      info,
    };
  });

  const chartConfig = {
    info: {
      label: x.data.x_axis,
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
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillall_count" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-all_count)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-all_count)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillConversion" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-success_count)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-success_count)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <YAxis
            dataKey="info"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
          >
            <Label
              style={{
                textAnchor: "middle",
                fontSize: "130%",
                fill: "white",
              }}
              angle={270}
              value={x.data.y_axis}
            />
          </YAxis>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
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
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="success_count"
            type="monotone"
            fill="url(#fillConversion)"
            stroke="var(--color-success_count)"
            stackId="a"
          />
          <Area
            dataKey="all_count"
            type="monotone"
            fill="url(#fillall_count)"
            stroke="var(--color-all_count)"
            stackId="a"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
});
