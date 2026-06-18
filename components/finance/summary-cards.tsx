"use client";

import { ArrowDownRight, ArrowUpRight, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currency";

export function SummaryCards({ balance, income, expenses, currency }: { balance: number; income: number; expenses: number; currency: string }) {
  const cards = [
    { label: "Current Balance", value: balance, icon: WalletCards, tone: "text-primary" },
    { label: "Income", value: income, icon: ArrowUpRight, tone: "text-success" },
    { label: "Expenses", value: expenses, icon: ArrowDownRight, tone: "text-expense" }
  ];
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{cards.map((item) => <Card key={item.label} className="p-5"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{item.label}</p><item.icon className={item.tone} size={20} /></div><p className="mt-3 text-2xl font-bold tracking-normal">{formatCurrency(item.value, currency)}</p></Card>)}</div>;
}
