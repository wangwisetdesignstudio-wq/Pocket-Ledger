import type { Category, FinanceState, Transaction } from "@/types/finance";
import { formatCurrency } from "@/utils/currency";

function categoryName(categories: Category[], id: string) {
  return categories.find((category) => category.id === id)?.name ?? "Unknown";
}

export function transactionsToCsv(transactions: Transaction[], categories: Category[]) {
  const rows = [["Date", "Type", "Category", "Note", "Amount"]];
  transactions.forEach((item) => rows.push([item.date, item.type, categoryName(categories, item.categoryId), item.note ?? "", String(item.amount)]));
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

export function downloadText(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportBackup(state: FinanceState) {
  downloadText("finance-backup.json", JSON.stringify(state, null, 2), "application/json");
}

export function exportCsv(state: FinanceState) {
  downloadText("transactions.csv", transactionsToCsv(state.transactions, state.categories), "text/csv");
}

export function exportExcel(state: FinanceState) {
  const html = `<table><tr><th>Date</th><th>Type</th><th>Category</th><th>Note</th><th>Amount</th></tr>${state.transactions.map((item) => `<tr><td>${item.date}</td><td>${item.type}</td><td>${categoryName(state.categories, item.categoryId)}</td><td>${item.note ?? ""}</td><td>${item.amount}</td></tr>`).join("")}</table>`;
  downloadText("transactions.xls", html, "application/vnd.ms-excel");
}

export function exportPdf(state: FinanceState) {
  const popup = window.open("", "_blank");
  if (!popup) return;
  popup.document.write(`<html><head><title>Finance Report</title><style>body{font-family:Arial;padding:32px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}.income{color:#22C55E}.expense{color:#EF4444}</style></head><body><h1>Finance Report</h1><table><tr><th>Date</th><th>Type</th><th>Category</th><th>Note</th><th>Amount</th></tr>${state.transactions.map((item) => `<tr><td>${item.date}</td><td class="${item.type}">${item.type}</td><td>${categoryName(state.categories, item.categoryId)}</td><td>${item.note ?? ""}</td><td>${formatCurrency(item.amount, state.settings.currency)}</td></tr>`).join("")}</table><script>print()</script></body></html>`);
  popup.document.close();
}
