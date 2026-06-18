"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category, Transaction, TransactionFormValues, TransactionType } from "@/types/finance";
import { cn } from "@/lib/utils";

export function TransactionForm({ open, categories, transaction, onClose, onSubmit, onAddCategory }: { open: boolean; categories: Category[]; transaction?: Transaction | null; onClose: () => void; onSubmit: (values: TransactionFormValues) => void; onAddCategory: (category: Omit<Category, "id" | "isCustom">) => void }) {
  const form = useForm<TransactionFormValues>({ defaultValues: { type: "expense", amount: 0, date: new Date().toISOString().slice(0, 10), categoryId: "food", note: "" } });
  const type = form.watch("type");
  const filtered = categories.filter((category) => category.type === type);

  useEffect(() => {
    if (transaction) form.reset({ type: transaction.type, amount: transaction.amount, date: transaction.date, categoryId: transaction.categoryId, note: transaction.note ?? "" });
    else form.reset({ type: "expense", amount: 0, date: new Date().toISOString().slice(0, 10), categoryId: "food", note: "" });
  }, [transaction, open, form]);

  useEffect(() => {
    if (!filtered.some((category) => category.id === form.getValues("categoryId"))) form.setValue("categoryId", filtered[0]?.id ?? "");
  }, [type, filtered, form]);

  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"><div className="animate-sheet-up w-full max-w-lg rounded-t-[2rem] bg-background p-5 shadow-2xl sm:rounded-[2rem]"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{transaction ? "Edit transaction" : "Add transaction"}</h2><Button aria-label="Close" variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button></div><form className="space-y-4" onSubmit={form.handleSubmit((values) => { onSubmit({ ...values, amount: Number(values.amount) }); onClose(); })}>
    <Controller control={form.control} name="type" render={({ field }) => <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">{(["expense", "income"] as TransactionType[]).map((item) => <button key={item} type="button" onClick={() => field.onChange(item)} className={cn("h-12 rounded-xl font-semibold capitalize transition", field.value === item ? item === "income" ? "bg-success text-white shadow" : "bg-expense text-white shadow" : "text-muted-foreground")}>{item}</button>)}</div>} />
    <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Amount</Label><Input inputMode="decimal" type="number" step="0.01" min="0" {...form.register("amount", { valueAsNumber: true })} /></div><div className="space-y-2"><Label>Date</Label><Input type="date" {...form.register("date")} /></div></div>
    <div className="space-y-2"><Label>Category</Label><select className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-base outline-none focus:border-primary" {...form.register("categoryId")}>{filtered.map((category) => <option key={category.id} value={category.id}>{category.icon} {category.name}</option>)}</select></div>
    <div className="space-y-2"><Label>Note</Label><Input placeholder="Coffee, rent, client payment..." {...form.register("note")} /></div>
    <button type="button" className="text-sm font-semibold text-primary" onClick={() => { const name = prompt("Category name"); if (!name) return; const icon = prompt("Emoji icon", type === "income" ? "💰" : "📦") || "📦"; onAddCategory({ name, icon, type }); }}>+ Custom category</button>
    <Button className="w-full text-base" size="default" type="submit">Save</Button>
  </form></div></div>;
}
