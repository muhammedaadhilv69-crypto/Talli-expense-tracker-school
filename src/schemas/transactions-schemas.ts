import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be greater than 0"),
  category_id: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  transaction_date: z.string().min(1, "Please select a date"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
