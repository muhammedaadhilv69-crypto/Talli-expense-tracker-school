import SummaryCards from "@/components/shared/dashboard/SummaryCards";
import { getProfile } from "@/lib/data/profile";
import { Suspense } from "react";
import SummaryCardsSkeleton from "@/components/shared/skeletons/SummaryCardsSkeleton";
import { Separator } from "@/components/ui/separator";
import SpendingChart from "@/components/shared/dashboard/SpendingChart";
import SpendingChartSkeleton from "@/components/shared/skeletons/SpendingChartSkeleton";
import RecentTransactions from "@/components/shared/dashboard/RecentTransactionsTable";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import RecentTransactionsSkeleton from "@/components/shared/skeletons/RecentTransactionsSkeleton";
import BudgetOverview from "@/components/shared/dashboard/BudgetOverview";
export default async function Page() {
  const profile = await getProfile();
  return (
    <div className="p-6 h-full">
      <div className="">
        <h1 className="text-2xl">
          Good morning!{" "}
          <span className="font-semibold text-emerald-800">
            {profile?.full_name}.
          </span>
        </h1>
        <p>
          Here&apos;s your financial overview for{" "}
          <span className="text-semibold text-blue-900">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
          .
        </p>
      </div>
      <Separator className="my-4" />
      <div className="py-2 gap-2">
        <h2 className="text-xl">Overview</h2>
        <Suspense fallback={<SummaryCardsSkeleton />}>
          <SummaryCards />
        </Suspense>
        <div className="flex gap-2">
          <div className="flex-1">
            <Suspense fallback={<SpendingChartSkeleton />}>
              <SpendingChart />
            </Suspense>
          </div>
          <div className="flex-2 flex">
            <Suspense>
              <BudgetOverview />
            </Suspense>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="py-2">
        <div className="flex justify-between">
          <h2 className="text-2xl">Recent Transactions</h2>
          <div className="flex gap-2 text-sm items-center">
            <Link
              href="/dashboard/transactions"
              className="flex gap-2 text-sm items-center"
            >
              <p>View All</p>
              <ArrowRight size="25" />
            </Link>
          </div>
        </div>
        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactions />
        </Suspense>
      </div>
    </div>
  );
}
