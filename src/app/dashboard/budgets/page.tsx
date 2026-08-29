import { Suspense } from "react";
import BudgetSpendingOverview from "@/components/shared/dashboard/BudgetSpendingOverview";
import BudgetList from "@/components/shared/dashboard/BudgetList";
import Pagination from "@/components/shared/dashboard/Pagination";
import { getAllBudgetsForPage } from "@/lib/data/budgets";
import BudgetSkeleton from "@/components/shared/skeletons/BudgetSkeleton";

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
  // const { budgets } = await getAllBudgetsForPage(page);


  return (
    <div className="p-6">
      <div>
        <h1>Budgets</h1>
        <p>Track your spendings</p>
      </div>
      <div className="py-5">
        <BudgetSpendingOverview />
      </div>
      <Suspense key={page} fallback={<BudgetSkeleton count={10} />}>
        <BudgetList budgets={budgets} />
      </Suspense>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        createHref={(p) => `/dashboard/budgets?page=${p}`}
      />
    </div>
  );
}
