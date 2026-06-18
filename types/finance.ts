export type TransactionType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  isCustom?: boolean;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: string;
  note?: string;
  recurringId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  month: string;
  amount: number;
};

export type RecurringExpense = {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  dayOfMonth: number;
  note?: string;
  active: boolean;
  lastGeneratedMonth?: string;
};

export type Settings = {
  currency: string;
  theme: "light" | "dark" | "system";
  monthlyReminder: boolean;
};

export type FinanceState = {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  recurringExpenses: RecurringExpense[];
  settings: Settings;
};

export type TransactionFormValues = {
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: string;
  note?: string;
};
