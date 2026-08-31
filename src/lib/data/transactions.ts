import { createClient } from "@/lib/supabase/server";

export async function getDashboardSummary() {
  // Fake 3 seconds of loading to test Skeletons
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export async function getSpendingByCategory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      amount,
      categories (
        name
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("type", "expense");

  if (error) {
    throw error;
  }

  const spending = new Map<string, number>();

  for (const transaction of data) {
    const category = transaction.categories;

    if (!category) continue;

    const name = category.name;

    spending.set(name, (spending.get(name) ?? 0) + Number(transaction.amount));
  }

  return Array.from(spending, ([category, amount]) => ({
    category,
    amount,
  })).sort((a, b) => b.amount - a.amount);
}

export async function getRecentTransactions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
    id,
    amount,
    type,
    transaction_date,
    categories (
      name,
      icon
    )
  `,
    )
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }
  return data;
}

const PAGE_SIZE = 15;

export async function getTransactions(page = 1) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("transactions")
    .select(
      `
    id,
    amount,
    type,
    transaction_date,
    categories (
      name,
      icon
    )
  `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }
  return {
    transactions: data ?? [],
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

import type { Tables, TablesInsert } from "@/types/database";

export type Transaction = Tables<"transactions">;
export type TransactionInsert = TablesInsert<"transactions">;

export async function getCategories() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon, type")
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createTransaction(
  transaction: Omit<TransactionInsert, "user_id">,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...transaction,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

import type { TablesUpdate } from "@/types/database";

export type TransactionUpdate = TablesUpdate<"transactions">;

export async function getTransaction(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      amount,
      type,
      category_id,
      description,
      transaction_date,
      categories (
        name,
        icon
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTransaction(
  id: string,
  updates: Omit<TransactionUpdate, "user_id">,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
