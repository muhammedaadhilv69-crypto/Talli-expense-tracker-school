import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type SavingsGoal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  description: string | null;
};

export default function SavingsList({ savings }: { savings: SavingsGoal[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {savings.map((saving) => {
        const progress =
          saving.target_amount > 0
            ? Math.min(
                (saving.current_amount / saving.target_amount) * 100,
                100,
              )
            : 0;

        const remaining = Math.max(
          saving.target_amount - saving.current_amount,
          0,
        );

        return (
          <Card key={saving.id} className="gap-0">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="truncate">{saving.name}</CardTitle>

                  {saving.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {saving.description}
                    </CardDescription>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                  <p className="text-xs text-muted-foreground">complete</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      {saving.current_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      saved of {saving.target_amount.toFixed(2)}
                    </p>
                  </div>

                  {saving.target_date && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Target date
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(saving.target_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <Progress value={progress} />
              </div>

              <div className="border-t pt-3">
                {remaining > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {remaining.toFixed(2)}
                    </span>{" "}
                    left to reach your goal
                  </p>
                ) : (
                  <p className="text-sm font-medium">🎉 Goal reached!</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
