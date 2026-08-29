import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type BudgetSkeletonProps = {
  count?: number;
};

export default function BudgetSkeleton({ count = 3 }: BudgetSkeletonProps) {
  return (
    <div className="flex flex-col gap-2 py-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border-muted bg-muted/30">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {/* Category icon */}
                <Skeleton className="size-10 rounded-md" />

                <div className="min-w-0 space-y-2">
                  {/* Category name */}
                  <Skeleton className="h-4 w-32" />
                  {/* Period label */}
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Period badge */}
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Spent / budget line */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-10" />
            </div>

            {/* Progress bar */}
            <Skeleton className="h-2 w-full rounded-full" />

            {/* Footer: status + date range */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
