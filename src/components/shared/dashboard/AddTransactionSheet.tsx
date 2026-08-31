"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { createTransactionAction } from "@/actions/transactions";
import type { TransactionFormValues } from "@/schemas/transactions-schemas";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  type: string;
};

type AddTransactionSheetProps = {
  categories: Category[];
};

export function AddTransactionSheet({ categories }: AddTransactionSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: TransactionFormValues) {
    try {
      await createTransactionAction(values);

      toast.success("Transaction added successfully");

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Add Transaction
      </SheetTrigger>

      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>
            Record a new income or expense transaction.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4">
          <TransactionForm categories={categories} onSubmit={handleSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
