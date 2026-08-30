import { createClient } from "@/lib/supabase/server";
import type { Budget } from "@/types/budgets";

const PAGE_SIZE = 10;

export type BudgetOverview = {
  id: string;
  category: {
    name: string;
    icon: string;
  } | null;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: "weekly" | "monthly";
  startDate: string;
  endDate: string;
};

export async function getBudgetOverview(): Promise<BudgetOverview[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get the user's budgets
  const { data: budgets, error: budgetsError } = await supabase
    .from("budgets")
    .select(
      `
      id,
      category_id,
      amount,
      period,
      start_date,
      end_date,
      categories (
        name,
        icon
      )
    `,
    )
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  if (budgetsError) {
    throw budgetsError;
  }

  // Get the user's expense transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("category_id, amount, transaction_date")
    .eq("user_id", user.id)
    .eq("type", "expense");

  if (transactionsError) {
    throw transactionsError;
  }

  return budgets.map((budget) => {
    const spent = transactions
      .filter(
        (transaction) =>
          transaction.category_id === budget.category_id &&
          transaction.transaction_date >= budget.start_date &&
          transaction.transaction_date <= budget.end_date,
      )
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const budgetAmount = Number(budget.amount);

    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

    return {
      id: budget.id,
      category: budget.categories
        ? {
            name: budget.categories.name,
            icon: budget.categories.icon ?? "other",
          }
        : null,
      budget: budgetAmount,
      spent,
      remaining: budgetAmount - spent,
      percentage,
      period: budget.period === "weekly" ? "weekly" : "monthly",
      startDate: budget.start_date,
      endDate: budget.end_date,
    };
  });
}

/**
 * Returns the total monthly budget for the authenticated user.
 * Only rows whose `period = 'monthly'` are included.
 */
export async function getMonthlyBudgetTotal(): Promise<number> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("budgets")
    .select("amount")
    .eq("user_id", user.id)
    .eq("period", "monthly");

  if (error) {
    throw error;
  }

  return data.reduce((total, budget) => total + Number(budget.amount), 0);
}

/**
 * Returns the total of the user's expense transactions for the current
 * calendar month.
 */
export async function getCurrentMonthExpensesTotal(): Promise<number> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toISOString()
    .slice(0, 10);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("transaction_date", startOfMonth)
    .lt("transaction_date", startOfNextMonth);

  if (error) {
    throw error;
  }

  return data.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0,
  );
}

/**
 * Returns the data shown on the Budget summary cards:
 * - `budget`: sum of the user's monthly budgets
 * - `spent`: sum of the user's expense transactions for the current month
 * - `remaining`: budget - spent
 */
export async function getMonthlyBudgetSummary() {
  const [budget, spent] = await Promise.all([
    getMonthlyBudgetTotal(),
    getCurrentMonthExpensesTotal(),
  ]);

  return {
    budget,
    spent,
    remaining: budget - spent,
  };
}

/**
 * Returns all budgets for the authenticated user, with the related
 * category joined. Ordered by `start_date` descending.
 * (Raw Supabase row shape; not normalized.)
 */
export async function getAllBudgets() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("budgets")
    .select(
      `
      id,
      category_id,
      amount,
      period,
      start_date,
      end_date,
      categories (
        name,
        icon
      )
    `,
    )
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Returns a paginated, page-friendly list of the user's budgets in the
 * shape consumed by the `Budget` component: normalized field names,
 * `categories` flattened to a single object or `null`, amounts coerced
 * to `number`, `period` narrowed to the supported union, and `spent`
 * computed per budget from the user's expense transactions in the
 * budget's date range so the cards display real data.
 *
 * The total count of budgets (independent of page) is also returned so
 * the caller can render pagination. Transactions are fetched unfiltered
 * (only by `user_id`/`type`) so `spent` is accurate for every returned
 * budget, not just the ones on the current page.
 */
export async function getAllBudgetsForPage(
  page = 1,
): Promise<{ budgets: Budget[]; totalPages: number }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const {
    data: budgets,
    error: budgetsError,
    count,
  } = await supabase
    .from("budgets")
    .select(
      `
      id,
      category_id,
      amount,
      period,
      start_date,
      end_date,
      categories (
        name,
        icon
      )
    `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("start_date", { ascending: false })
    .range(from, to);

  if (budgetsError) {
    throw budgetsError;
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("category_id, amount, transaction_date")
    .eq("user_id", user.id)
    .eq("type", "expense");

  if (transactionsError) {
    throw transactionsError;
  }

  const normalized = (budgets ?? []).map((budget) => {
    const spent = transactions
      .filter(
        (transaction) =>
          transaction.category_id === budget.category_id &&
          transaction.transaction_date >= budget.start_date &&
          transaction.transaction_date <= budget.end_date,
      )
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    return {
      id: budget.id,
      category_id: budget.category_id,
      amount: Number(budget.amount),
      period: (budget.period === "weekly" ? "weekly" : "monthly") as
        | "monthly"
        | "weekly",
      start_date: budget.start_date,
      end_date: budget.end_date,
      categories: Array.isArray(budget.categories)
        ? (budget.categories[0] ?? null)
        : (budget.categories ?? null),
      spent,
    } satisfies Budget;
  });

  return {
    budgets: normalized,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}
