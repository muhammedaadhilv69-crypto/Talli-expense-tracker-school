import { ChartArea } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import BudgetSummaryCards from "./BudgetSummaryCards";
import { Suspense } from "react";
import SummaryCardsSkeleton from "../skeletons/SummaryCardsSkeleton";

export default function BudgetSpendingOverview() {
  return (
    <Card>
      <CardHeader className="flex justify-between w-full">
        <div>
          <CardTitle>Monthly overview</CardTitle>
          <CardDescription>
            simple overview on your monthly spendings
          </CardDescription>
        </div>
        <ChartArea />
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SummaryCardsSkeleton />}>
          <BudgetSummaryCards />
        </Suspense>
      </CardContent>
    </Card>
  );
}
