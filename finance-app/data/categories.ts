import type { Category } from "@/types/finance";

export const expenseCategories: Category[] = [
  { id: "food", name: "Food", icon: "🍜", type: "expense" },
  { id: "coffee", name: "Coffee", icon: "☕", type: "expense" },
  { id: "shopping", name: "Shopping", icon: "🛒", type: "expense" },
  { id: "fuel", name: "Fuel", icon: "⛽", type: "expense" },
  { id: "mobile", name: "Mobile", icon: "📱", type: "expense" },
  { id: "software", name: "Software Subscription", icon: "💻", type: "expense" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", type: "expense" },
  { id: "rent", name: "Rent", icon: "🏠", type: "expense" },
  { id: "utilities", name: "Utilities", icon: "⚡", type: "expense" },
  { id: "medical", name: "Medical", icon: "💊", type: "expense" },
  { id: "transportation", name: "Transportation", icon: "🚗", type: "expense" },
  { id: "gift-expense", name: "Gift", icon: "🎁", type: "expense" },
  { id: "travel", name: "Travel", icon: "✈️", type: "expense" },
  { id: "pets", name: "Pets", icon: "🐶", type: "expense" },
  { id: "education", name: "Education", icon: "📚", type: "expense" },
  { id: "clothing", name: "Clothing", icon: "👕", type: "expense" },
  { id: "investment-expense", name: "Investment", icon: "💰", type: "expense" },
  { id: "others-expense", name: "Others", icon: "📦", type: "expense" }
];

export const incomeCategories: Category[] = [
  { id: "salary", name: "Salary", icon: "💼", type: "income" },
  { id: "investment-income", name: "Investment", icon: "📈", type: "income" },
  { id: "bonus", name: "Bonus", icon: "🎁", type: "income" },
  { id: "freelance", name: "Freelance", icon: "💵", type: "income" },
  { id: "rental-income", name: "Rental Income", icon: "🏢", type: "income" },
  { id: "others-income", name: "Others", icon: "💰", type: "income" }
];

export const defaultCategories = [...expenseCategories, ...incomeCategories];
