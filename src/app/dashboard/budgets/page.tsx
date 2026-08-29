import BudgetSpendingOverview from "@/components/shared/dashboard/BudgetSpendingOverview"
import { getAllBudgetsForPage } from "@/lib/data/budgets"
import Budget from "@/components/shared/dashboard/Budget";
import Pagination from "@/components/shared/dashboard/Pagination";

export const metadata = {
  title: "Budgets | Talli",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);

  const { budgets, totalPages } = await getAllBudgetsForPage(page);

  return (
    <div className="p-6">
      <div>
        <h1>Budgets</h1>
        <p>Track your spendings</p>
      </div>
      <div className="py-5">
        <BudgetSpendingOverview />
      </div>
      <div className="flex flex-col gap-2 py-2">
        {budgets.map(b => (
            <Budget key={b.id} budget={b} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        createHref={(p) => `/dashboard/budgets?page=${p}`}
      />
    </div>
  )
}
