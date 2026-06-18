"use client";

import { useMemo, useState } from "react";
import { Bell, Moon, Plus, Search, SunMedium } from "lucide-react";
import { BottomNav, type AppTab } from "@/components/layout/bottom-nav";
import { BudgetList } from "@/components/finance/budget-list";
import { ExportButtons } from "@/components/finance/quick-actions";
import { SummaryCards } from "@/components/finance/summary-cards";
import { TransactionForm } from "@/components/finance/transaction-form";
import { TransactionList } from "@/components/finance/transaction-list";
import { ExpensePieChart, MonthlyTrendChart } from "@/components/charts/finance-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinanceStore } from "@/hooks/use-finance-store";
import type { Transaction, TransactionType } from "@/types/finance";
import { formatCurrency } from "@/utils/currency";
import { currentMonth, monthLabel } from "@/utils/date";
import { budgetProgress, categoryBreakdown, filterByMonth, monthlyTrend, totals, transactionMatches } from "@/utils/finance";

export default function Home() {
  const store = useFinanceStore();
  const { state } = store;
  const [tab, setTab] = useState<AppTab>("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const month = currentMonth();

  const allTotals = useMemo(() => totals(state.transactions), [state.transactions]);
  const monthTransactions = useMemo(() => filterByMonth(state.transactions, month), [state.transactions, month]);
  const monthlyTotals = useMemo(() => totals(monthTransactions), [monthTransactions]);
  const recent = useMemo(() => [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6), [state.transactions]);
  const filteredTransactions = useMemo(() => state.transactions.filter((item) => transactionMatches(item, state.categories, query, typeFilter)), [state.transactions, state.categories, query, typeFilter]);
  const expenseData = useMemo(() => categoryBreakdown(monthTransactions, state.categories, "expense"), [monthTransactions, state.categories]);
  const incomeData = useMemo(() => categoryBreakdown(monthTransactions, state.categories, "income"), [monthTransactions, state.categories]);
  const trend = useMemo(() => monthlyTrend(state.transactions), [state.transactions]);
  const budgets = useMemo(() => budgetProgress(state.budgets, state.transactions, state.categories, month), [state.budgets, state.transactions, state.categories, month]);

  function openAdd() { setEditing(null); setSheetOpen(true); }
  function onTab(next: AppTab) { if (next === "add") openAdd(); else setTab(next); }

  return <main className="mx-auto min-h-screen w-full max-w-xl px-4 pb-28 pt-5 sm:max-w-5xl"><header className="mb-5 flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">{monthLabel(month)}</p><h1 className="text-3xl font-bold tracking-normal">Pocket Ledger</h1></div><Button aria-label="Add transaction" size="icon" onClick={openAdd}><Plus size={24} /></Button></header>
    {tab === "home" && <section className="space-y-5"><SummaryCards balance={allTotals.balance} income={monthlyTotals.income} expenses={monthlyTotals.expenses} currency={state.settings.currency} /><Card><CardHeader><CardTitle>Monthly Summary</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3"><MiniStat label="Income" value={monthlyTotals.income} currency={state.settings.currency} tone="text-success" /><MiniStat label="Expenses" value={monthlyTotals.expenses} currency={state.settings.currency} tone="text-expense" /></CardContent></Card><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader><CardContent><TransactionList compact transactions={recent} categories={state.categories} currency={state.settings.currency} onEdit={(item) => { setEditing(item); setSheetOpen(true); }} onDelete={store.deleteTransaction} /></CardContent></Card><ExpensePieChart data={expenseData} currency={state.settings.currency} /></div><MonthlyTrendChart data={trend} currency={state.settings.currency} /></section>}
    {tab === "reports" && <section className="space-y-5"><SearchFilter query={query} setQuery={setQuery} typeFilter={typeFilter} setTypeFilter={setTypeFilter} /><div className="grid gap-5 lg:grid-cols-2"><ExpensePieChart data={expenseData} currency={state.settings.currency} /><MonthlyTrendChart data={trend} currency={state.settings.currency} /></div><Card><CardHeader><CardTitle>Top Spending Categories</CardTitle></CardHeader><CardContent className="space-y-3">{expenseData.slice(0, 5).map((item, index) => <div key={item.name} className="flex items-center justify-between rounded-2xl bg-muted p-3"><span className="font-semibold">{index + 1}. {item.icon} {item.name}</span><span className="font-bold text-expense">{formatCurrency(item.value, state.settings.currency)}</span></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{[...expenseData, ...incomeData].map((item) => <div key={`${item.name}-${item.value}`} className="rounded-2xl bg-muted p-3"><p className="font-semibold">{item.icon} {item.name}</p><p className="text-sm text-muted-foreground">{formatCurrency(item.value, state.settings.currency)}</p></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Transactions</CardTitle></CardHeader><CardContent><TransactionList transactions={filteredTransactions} categories={state.categories} currency={state.settings.currency} onEdit={(item) => { setEditing(item); setSheetOpen(true); }} onDelete={store.deleteTransaction} /></CardContent></Card></section>}
    {tab === "monthly" && <section className="space-y-5"><BudgetList items={budgets} currency={state.settings.currency} /><Card><CardHeader><CardTitle>Set Budget</CardTitle></CardHeader><CardContent><BudgetEditor categories={state.categories.filter((c) => c.type === "expense")} month={month} onSave={store.upsertBudget} /></CardContent></Card><Card><CardHeader><CardTitle>Recurring Expenses</CardTitle></CardHeader><CardContent className="space-y-3">{state.recurringExpenses.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl bg-muted p-3"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">Day {item.dayOfMonth} · {formatCurrency(item.amount, state.settings.currency)}</p></div><span className={item.active ? "text-success" : "text-muted-foreground"}>{item.active ? "Active" : "Paused"}</span></div>)}</CardContent></Card></section>}
    {tab === "settings" && <section className="space-y-5"><Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Currency</Label><select className="h-12 w-full rounded-2xl border border-input bg-background px-4" value={state.settings.currency} onChange={(event) => store.updateSettings({ currency: event.target.value })}><option value="THB">Thai Baht (THB)</option><option value="USD">US Dollar (USD)</option><option value="EUR">Euro (EUR)</option><option value="JPY">Yen (JPY)</option></select></div><div className="grid grid-cols-3 gap-2"><Button variant={state.settings.theme === "light" ? "default" : "secondary"} onClick={() => store.updateSettings({ theme: "light" })}><SunMedium size={18} />Light</Button><Button variant={state.settings.theme === "dark" ? "default" : "secondary"} onClick={() => store.updateSettings({ theme: "dark" })}><Moon size={18} />Dark</Button><Button variant={state.settings.theme === "system" ? "default" : "secondary"} onClick={() => store.updateSettings({ theme: "system" })}>Auto</Button></div><label className="flex items-center justify-between rounded-2xl bg-muted p-4"><span className="inline-flex items-center gap-2 font-semibold"><Bell size={18} />Monthly reminders</span><input type="checkbox" checked={state.settings.monthlyReminder} onChange={(event) => store.updateSettings({ monthlyReminder: event.target.checked })} /></label></CardContent></Card><ExportButtons state={state} onImport={store.importState} /><Button variant="destructive" className="w-full" onClick={store.resetDemoData}>Reset Demo Data</Button></section>}
    <TransactionForm open={sheetOpen} categories={state.categories} transaction={editing} onClose={() => setSheetOpen(false)} onAddCategory={store.addCategory} onSubmit={(values) => editing ? store.updateTransaction(editing.id, values) : store.addTransaction(values)} />
    <BottomNav active={tab} onChange={onTab} />
  </main>;
}

function MiniStat({ label, value, currency, tone }: { label: string; value: number; currency: string; tone: string }) { return <div className="rounded-2xl bg-muted p-4"><p className="text-sm text-muted-foreground">{label}</p><p className={`mt-1 text-xl font-bold ${tone}`}>{formatCurrency(value, currency)}</p></div>; }

function SearchFilter({ query, setQuery, typeFilter, setTypeFilter }: { query: string; setQuery: (value: string) => void; typeFilter: "all" | TransactionType; setTypeFilter: (value: "all" | TransactionType) => void }) { return <Card><CardContent className="space-y-3 p-4"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><Input className="pl-11" placeholder="Search category, date, amount, keyword" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="grid grid-cols-3 gap-2">{(["all", "income", "expense"] as const).map((item) => <Button key={item} variant={typeFilter === item ? "default" : "secondary"} onClick={() => setTypeFilter(item)}>{item}</Button>)}</div></CardContent></Card>; }

function BudgetEditor({ categories, month, onSave }: { categories: { id: string; name: string; icon: string }[]; month: string; onSave: (budget: { categoryId: string; month: string; amount: number }) => void }) { const [categoryId, setCategoryId] = useState(categories[0]?.id ?? ""); const [amount, setAmount] = useState(1000); return <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><select className="h-12 rounded-2xl border border-input bg-background px-4" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.icon} {category.name}</option>)}</select><Input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /><Button onClick={() => onSave({ categoryId, month, amount })}>Save</Button></div>; }
