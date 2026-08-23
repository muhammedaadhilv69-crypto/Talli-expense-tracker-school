import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryCardsSkeleton() {
  return (
    <div className="m-1 grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            {/* Card description */}
            <Skeleton className="h-4 w-20" />

            {/* Card title / amount */}
            <Skeleton className="mt-2 h-8 w-32" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
