"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/currency";

export function BudgetList({ items, currency }: { items: { id: string; amount: number; spent: number; remaining: number; percent: number; category?: { name: string; icon: string } }[]; currency: string }) {
  return <Card><CardHeader><CardTitle>Monthly Budgets</CardTitle></CardHeader><CardContent className="space-y-4">{items.length === 0 ? <p className="text-sm text-muted-foreground">No budgets configured yet.</p> : items.map((item) => <div key={item.id} className="space-y-2"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{item.category?.icon} {item.category?.name}</p><p className="text-sm text-muted-foreground">Remaining {formatCurrency(item.remaining, currency)}</p></div>{item.remaining < 0 ? <span className="inline-flex items-center gap-1 text-sm font-semibold text-expense"><AlertTriangle size={16} /> Over</span> : <p className="text-sm font-semibold">{Math.round(item.percent)}%</p>}</div><Progress value={item.percent} className={item.remaining < 0 ? "[&>div]:bg-expense" : ""} /></div>)}</CardContent></Card>;
}
