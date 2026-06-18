import { clampDay, currentMonth } from "@/utils/date";
import { uid } from "@/lib/utils";
import type { Budget, Category, FinanceState, RecurringExpense, Transaction, TransactionType } from "@/types/finance";

export function getCategory(categories: Category[], id: string) {
  return categories.find((category) => category.id === id);
}

export function filterByMonth(transactions: Transaction[], month = currentMonth()) {
  return transactions.filter((transaction) => transaction.date.startsWith(month));
}

export function totals(transactions: Transaction[]) {
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function categoryBreakdown(transactions: Transaction[], categories: Category[], type: TransactionType = "expense") {
  const map = new Map<string, { name: string; value: number; icon: string }>();
  transactions.filter((item) => item.type === type).forEach((item) => {
    const category = getCategory(categories, item.categoryId);
    const label = category?.name ?? "Unknown";
    const current = map.get(item.categoryId) ?? { name: label, value: 0, icon: category?.icon ?? "•" };
    map.set(item.categoryId, { ...current, value: current.value + item.amount });
  });
  return Array.from(map.values()).sort((a, b) => b.value - a.value);
}

export function monthlyTrend(transactions: Transaction[]) {
  const buckets = new Map<string, { month: string; income: number; expenses: number }>();
  transactions.forEach((item) => {
    const month = item.date.slice(0, 7);
    const bucket = buckets.get(month) ?? { month, income: 0, expenses: 0 };
    bucket[item.type === "income" ? "income" : "expenses"] += item.amount;
    buckets.set(month, bucket);
  });
  return Array.from(buckets.values()).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
}

export function budgetProgress(budgets: Budget[], transactions: Transaction[], categories: Category[], month = currentMonth()) {
  const monthTransactions = filterByMonth(transactions, month);
  return budgets.filter((budget) => budget.month === month).map((budget) => {
    const spent = monthTransactions.filter((item) => item.type === "expense" && item.categoryId === budget.categoryId).reduce((sum, item) => sum + item.amount, 0);
    const category = getCategory(categories, budget.categoryId);
    return { ...budget, spent, remaining: budget.amount - spent, percent: budget.amount ? Math.min((spent / budget.amount) * 100, 140) : 0, category };
  });
}

export function generateRecurringForCurrentMonth(state: FinanceState): FinanceState {
  const month = currentMonth();
  const [year, monthNumber] = month.split("-").map(Number);
  let changed = false;
  const transactions = [...state.transactions];
  const recurringExpenses: RecurringExpense[] = state.recurringExpenses.map((recurring) => {
    if (!recurring.active || recurring.lastGeneratedMonth === month) return recurring;
    const date = `${month}-${String(clampDay(year, monthNumber - 1, recurring.dayOfMonth)).padStart(2, "0")}`;
    const exists = transactions.some((item) => item.recurringId === recurring.id && item.date.startsWith(month));
    if (!exists) {
      const now = new Date().toISOString();
      transactions.push({ id: uid("tx"), type: "expense", amount: recurring.amount, date, categoryId: recurring.categoryId, note: recurring.note ?? recurring.name, recurringId: recurring.id, createdAt: now, updatedAt: now });
      changed = true;
    }
    return { ...recurring, lastGeneratedMonth: month };
  });
  return changed ? { ...state, transactions, recurringExpenses } : state;
}

export function transactionMatches(transaction: Transaction, categories: Category[], query: string, type: "all" | TransactionType) {
  if (type !== "all" && transaction.type !== type) return false;
  const category = getCategory(categories, transaction.categoryId);
  const haystack = `${category?.name ?? ""} ${transaction.note ?? ""} ${transaction.date} ${transaction.amount}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}
