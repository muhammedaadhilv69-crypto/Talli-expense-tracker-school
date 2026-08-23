"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartBar } from "lucide-react";

const chartConfig = {
  amount: {
    label: "Spending",
  },
};

type SpendingData = {
  category: string;
  amount: number;
};

type SpendingBarChartProps = {
  data: SpendingData[];
};

export default function SpendingBarChart({ data }: SpendingBarChartProps) {
  return (
    <Card className="w-fit p-2 h-fit">
      <CardHeader className="flex gap-2 justify-between">
        <div>
          <CardTitle>Spending Overview</CardTitle>
          <CardDescription>Your expenses by category</CardDescription>
        </div>
        <ChartBar />
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-40 h-fit w-96">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid horizontal={false} />

            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
            />

            <XAxis
              dataKey="amount"
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar dataKey="amount" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
