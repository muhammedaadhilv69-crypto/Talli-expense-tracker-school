import Budget from "@/components/shared/dashboard/Budget";
import Pagination from "@/components/shared/dashboard/Pagination";
import { getAllBudgetsForPage } from "@/lib/data/budgets";
import { Budget as Bud } from "@/types/budgets";

type BudgetListProps = {
  budgets: Bud[];
};

export default async function BudgetList({
  budgets
}: BudgetListProps) {

  return (
    <>
      <div className="flex flex-col gap-2 py-2">
        {budgets.map((b) => (
          <Budget key={b.id} budget={b} />
        ))}
      </div>
    </>
  );
}
