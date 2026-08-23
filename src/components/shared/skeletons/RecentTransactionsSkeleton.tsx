import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

export default function RecentTransactionsSkeleton() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              {/* Date */}
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>

              {/* Category */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell>
                <div className="flex justify-end">
                  <Skeleton className="h-4 w-20" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
