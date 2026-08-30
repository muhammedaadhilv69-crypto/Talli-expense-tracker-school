import { getAllSavingsForPage } from "@/lib/data/savings";
import Pagination from "@/components/shared/dashboard/Pagination";
import { Suspense } from "react";
import SavingsList from "@/components/shared/dashboard/SavingsList";

export const metadata = {
  title: "Savings | Talli",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);

  const { savings, totalPages } = await getAllSavingsForPage();

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl">Savings</h1>
        <p className="">Complete your dreams</p>
      </div>
      <div className="my-4">
      <Suspense key={page}>
        <SavingsList savings={savings} />
      </Suspense>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        createHref={(p) => `/dashboard/budgets?page=${p}`}
      />
    </div>
  );
}
