import { defaultCategories } from "@/data/categories";
import type { FinanceState, RecurringExpense } from "@/types/finance";

const today = new Date();
const month = today.toISOString().slice(0, 7);

export const defaultRecurringExpenses: RecurringExpense[] = [
  { id: "rec-netflix", name: "Netflix", amount: 419, categoryId: "entertainment", dayOfMonth: 5, note: "Streaming", active: true },
  { id: "rec-spotify", name: "Spotify", amount: 139, categoryId: "entertainment", dayOfMonth: 7, note: "Music", active: true },
  { id: "rec-icloud", name: "iCloud", amount: 35, categoryId: "software", dayOfMonth: 10, note: "Cloud storage", active: true },
  { id: "rec-phone", name: "Phone Bill", amount: 699, categoryId: "mobile", dayOfMonth: 16, note: "Mobile plan", active: true },
  { id: "rec-electricity", name: "Electricity", amount: 1200, categoryId: "utilities", dayOfMonth: 25, active: true }
];

export const initialState: FinanceState = {
  categories: defaultCategories,
  budgets: [
    { id: "budget-food", categoryId: "food", month, amount: 9000 },
    { id: "budget-coffee", categoryId: "coffee", month, amount: 2000 },
    { id: "budget-entertainment", categoryId: "entertainment", month, amount: 2500 },
    { id: "budget-utilities", categoryId: "utilities", month, amount: 4000 }
  ],
  recurringExpenses: defaultRecurringExpenses,
  settings: { currency: "THB", theme: "system", monthlyReminder: true },
  transactions: [
    { id: "tx-salary", type: "income", amount: 65000, date: `${month}-01`, categoryId: "salary", note: "Monthly salary", createdAt: today.toISOString(), updatedAt: today.toISOString() },
    { id: "tx-lunch", type: "expense", amount: 180, date: today.toISOString().slice(0, 10), categoryId: "food", note: "Lunch", createdAt: today.toISOString(), updatedAt: today.toISOString() },
    { id: "tx-coffee", type: "expense", amount: 95, date: today.toISOString().slice(0, 10), categoryId: "coffee", note: "Morning coffee", createdAt: today.toISOString(), updatedAt: today.toISOString() }
  ]
};
