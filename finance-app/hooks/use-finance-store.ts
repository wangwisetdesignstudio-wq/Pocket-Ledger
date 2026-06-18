"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { initialState } from "@/data/seed";
import { uid } from "@/lib/utils";
import type { Budget, Category, FinanceState, RecurringExpense, Settings, Transaction, TransactionFormValues } from "@/types/finance";
import { generateRecurringForCurrentMonth } from "@/utils/finance";

const STORAGE_KEY = "pocket-ledger-state-v1";

function loadState(): FinanceState {
  if (typeof window === "undefined") return initialState;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return generateRecurringForCurrentMonth(initialState);
  try {
    return generateRecurringForCurrentMonth({ ...initialState, ...JSON.parse(saved) });
  } catch {
    return generateRecurringForCurrentMonth(initialState);
  }
}

export function useFinanceStore() {
  const [state, setState] = useState<FinanceState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", state.settings.theme === "dark" || (state.settings.theme === "system" && systemDark));
  }, [ready, state]);

  const addTransaction = useCallback((values: TransactionFormValues) => {
    const now = new Date().toISOString();
    const transaction: Transaction = { ...values, id: uid("tx"), amount: Number(values.amount), createdAt: now, updatedAt: now };
    setState((current) => ({ ...current, transactions: [transaction, ...current.transactions] }));
  }, []);

  const updateTransaction = useCallback((id: string, values: TransactionFormValues) => {
    setState((current) => ({
      ...current,
      transactions: current.transactions.map((item) => item.id === id ? { ...item, ...values, amount: Number(values.amount), updatedAt: new Date().toISOString() } : item)
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((current) => ({ ...current, transactions: current.transactions.filter((item) => item.id !== id) }));
  }, []);

  const addCategory = useCallback((category: Omit<Category, "id" | "isCustom">) => {
    setState((current) => ({ ...current, categories: [...current.categories, { ...category, id: uid("cat"), isCustom: true }] }));
  }, []);

  const upsertBudget = useCallback((budget: Omit<Budget, "id"> & { id?: string }) => {
    setState((current) => {
      const id = budget.id ?? uid("budget");
      const exists = current.budgets.some((item) => item.id === id || (item.categoryId === budget.categoryId && item.month === budget.month));
      return { ...current, budgets: exists ? current.budgets.map((item) => item.id === id || (item.categoryId === budget.categoryId && item.month === budget.month) ? { ...item, ...budget, id: item.id } : item) : [...current.budgets, { ...budget, id }] };
    });
  }, []);

  const upsertRecurring = useCallback((recurring: Omit<RecurringExpense, "id"> & { id?: string }) => {
    setState((current) => {
      const id = recurring.id ?? uid("rec");
      const exists = current.recurringExpenses.some((item) => item.id === id);
      return { ...current, recurringExpenses: exists ? current.recurringExpenses.map((item) => item.id === id ? { ...item, ...recurring, id } : item) : [...current.recurringExpenses, { ...recurring, id }] };
    });
  }, []);

  const updateSettings = useCallback((settings: Partial<Settings>) => {
    setState((current) => ({ ...current, settings: { ...current.settings, ...settings } }));
  }, []);

  const importState = useCallback((nextState: FinanceState) => {
    setState(generateRecurringForCurrentMonth({ ...initialState, ...nextState }));
  }, []);

  const resetDemoData = useCallback(() => setState(generateRecurringForCurrentMonth(initialState)), []);

  return useMemo(() => ({ state, ready, addTransaction, updateTransaction, deleteTransaction, addCategory, upsertBudget, upsertRecurring, updateSettings, importState, resetDemoData }), [state, ready, addTransaction, updateTransaction, deleteTransaction, addCategory, upsertBudget, upsertRecurring, updateSettings, importState, resetDemoData]);
}
