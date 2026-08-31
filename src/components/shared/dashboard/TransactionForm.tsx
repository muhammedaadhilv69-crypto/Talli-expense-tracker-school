"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  transactionSchema,
  type TransactionFormValues,
} from "@/schemas/transactions-schemas";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  type: string;
};

type TransactionFormProps = {
  categories: Category[];
  defaultValues?: Partial<TransactionFormValues>;
  submitLabel?: string;
  submittingLabel?: string;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
};

export function TransactionForm({
  categories,
  defaultValues,
  submitLabel = "Add Transaction",
  submittingLabel = "Adding...",
  onSubmit,
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: undefined,
      category_id: "",
      description: "",
      transaction_date: new Date().toISOString().split("T")[0],
      ...defaultValues,
    },
  });

  const selectedType = watch("type");

  const filteredCategories = categories.filter(
    (category) => category.type === selectedType,
  );

  async function submit(values: TransactionFormValues) {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>

        <Select
          value={selectedType}
          onValueChange={(value) => {
            setValue("type", value as "income" | "expense");
            setValue("category_id", "");
          }}
        >
          <SelectTrigger id="type" className="w-full">
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>

        <Input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          {...register("amount", {
            valueAsNumber: true,
          })}
        />

        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category_id">Category</Label>

        <Select
          value={watch("category_id")}
          onValueChange={(value) => setValue("category_id", value)}
        >
          <SelectTrigger id="category_id" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>

          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category_id && (
          <p className="text-sm text-destructive">
            {errors.category_id.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          placeholder="What was this transaction for?"
          className="resize-none"
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="transaction_date">Date</Label>

        <Input
          id="transaction_date"
          type="date"
          {...register("transaction_date")}
        />

        {errors.transaction_date && (
          <p className="text-sm text-destructive">
            {errors.transaction_date.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
