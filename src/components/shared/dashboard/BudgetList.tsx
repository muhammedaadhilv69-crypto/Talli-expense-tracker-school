import Budget from "@/components/shared/dashboard/Budget";
import Pagination from "@/components/shared/dashboard/Pagination";
import { getAllBudgetsForPage } from "@/lib/data/budgets";

type BudgetListProps = {
  page: number;
  basePath?: string;
};

export default async function BudgetList({
  page,
  basePath = "/dashboard/budgets",
}: BudgetListProps) {
  const { budgets, totalPages } = await getAllBudgetsForPage(page);

  return (
    <>
      <div className="flex flex-col gap-2 py-2">
        {budgets.map((b) => (
          <Budget key={b.id} budget={b} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        createHref={(p) => `${basePath}?page=${p}`}
      />
    </>
  );
}
