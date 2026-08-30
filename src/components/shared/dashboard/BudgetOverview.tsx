import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBudgetOverview } from "@/lib/data/dashboard"
import BudgetItem from "../BudgetItem";
import type { BudgetOverview } from "@/lib/data/budgets";

export default async function BudgetOverview() {
    const budgets: BudgetOverview[] = await getBudgetOverview();
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Budgets Overview</CardTitle>
                <CardDescription>Track your spendings against your recent budgets</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-2">
                {budgets.slice(0, 3).map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                ))}
            </CardContent>
        </Card>
    )
}