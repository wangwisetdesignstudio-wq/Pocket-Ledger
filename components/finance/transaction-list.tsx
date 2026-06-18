"use client";

import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category, Transaction } from "@/types/finance";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { getCategory } from "@/utils/finance";
import { cn } from "@/lib/utils";

export function TransactionList({ transactions, categories, currency, onEdit, onDelete, compact = false }: { transactions: Transaction[]; categories: Category[]; currency: string; onEdit: (transaction: Transaction) => void; onDelete: (id: string) => void; compact?: boolean }) {
  if (transactions.length === 0) return <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No transactions yet. Tap + to add your first one.</div>;
  return <div className="space-y-3">{transactions.map((transaction) => {
    const category = getCategory(categories, transaction.categoryId);
    return <div key={transaction.id} className="group flex touch-pan-y items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition hover:shadow-soft" draggable onDragEnd={(event) => { if (event.clientX < 80) onDelete(transaction.id); }}>
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted text-xl">{category?.icon ?? "•"}</div>
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-semibold">{category?.name ?? "Unknown"}</p><span className={cn("h-2 w-2 rounded-full", transaction.type === "income" ? "bg-success" : "bg-expense")} /></div><p className="truncate text-sm text-muted-foreground">{transaction.note || "No note"} · {formatDate(transaction.date)}</p></div>
      <div className="text-right"><p className={cn("font-bold", transaction.type === "income" ? "text-success" : "text-expense")}>{transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount, currency)}</p>{!compact && <div className="mt-1 flex justify-end gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100"><Button aria-label="Edit transaction" variant="ghost" size="icon" className="h-9 w-9" onClick={() => onEdit(transaction)}><Edit3 size={16} /></Button><Button aria-label="Delete transaction" variant="ghost" size="icon" className="h-9 w-9 text-expense" onClick={() => onDelete(transaction.id)}><Trash2 size={16} /></Button></div>}</div>
    </div>;
  })}</div>;
}
