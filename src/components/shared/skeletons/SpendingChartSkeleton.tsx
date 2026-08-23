import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpendingChartSkeleton() {
  return (
    <Card className="w-fit p-2">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>

      <CardContent>
        <div className="min-h-40 w-96 space-y-5 pt-4">
          {/* Fake bars */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-[65%]" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-[45%]" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-[80%]" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-[35%]" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-[55%]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
