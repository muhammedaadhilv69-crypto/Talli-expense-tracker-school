"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { TransactionForm } from "./TransactionForm";
import { updateTransactionAction } from "@/actions/transactions";
import type { TransactionFormValues } from "@/schemas/transactions-schemas";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  type: string;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  category_id: string;
  description: string | null;
  transaction_date: string;
};

type EditTransactionSheetProps = {
  transaction: Transaction;
  categories: Category[];
};

export function EditTransactionSheet({transaction, categories}: EditTransactionSheetProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    async function handleSubmit(values: TransactionFormValues) {
        try {
            await updateTransactionAction(transaction.id, values);
            toast.success("Transaction updated!")
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error(error);
            toast.error("Failed to update transaction")
        }
    }

    return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" />}>
        <Pencil />
        <span className="sr-only">Edit transaction</span>
      </SheetTrigger>

      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Update this transaction.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4">
          <TransactionForm
            categories={categories}
            onSubmit={handleSubmit}
            submitLabel="Update Transaction"
            submittingLabel="Updating..."
            defaultValues={{
              type: transaction.type as "income" | "expense",
              amount: transaction.amount,
              category_id: transaction.category_id,
              description: transaction.description ?? "",
              transaction_date: transaction.transaction_date,
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}