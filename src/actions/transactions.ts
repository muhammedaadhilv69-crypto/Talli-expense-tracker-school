"use server";

import { createTransaction, updateTransaction } from "@/lib/data/transactions";

import type { TransactionFormValues } from "@/schemas/transactions-schemas";

export async function createTransactionAction(values: TransactionFormValues) {
  return createTransaction(values);
}

export async function updateTransactionAction(
  id: string,
  values: TransactionFormValues,
) {
  return updateTransaction(id, values);
}
