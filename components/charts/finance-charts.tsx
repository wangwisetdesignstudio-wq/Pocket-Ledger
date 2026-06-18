"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currency";

const colors = ["#2563EB", "#22C55E", "#EF4444", "#F59E0B", "#8B5CF6", "#14B8A6", "#EC4899", "#64748B"];

export function ExpensePieChart({ data, currency }: { data: { name: string; value: number; icon?: string }[]; currency: string }) {
  return <Card><CardHeader><CardTitle>Expense by Category</CardTitle></CardHeader><CardContent className="h-72">{data.length ? <ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={3}>{data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value) => formatCurrency(Number(value), currency)} /><Legend /></PieChart></ResponsiveContainer> : <EmptyChart />}</CardContent></Card>;
}

export function MonthlyTrendChart({ data, currency }: { data: { month: string; income: number; expenses: number }[]; currency: string }) {
  return <Card><CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader><CardContent className="h-72">{data.length ? <ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} width={42} tickLine={false} axisLine={false} /><Tooltip formatter={(value) => formatCurrency(Number(value), currency)} /><Legend /><Bar dataKey="income" radius={[8, 8, 0, 0]} fill="#22C55E" /><Bar dataKey="expenses" radius={[8, 8, 0, 0]} fill="#EF4444" /></BarChart></ResponsiveContainer> : <EmptyChart />}</CardContent></Card>;
}

function EmptyChart() {
  return <div className="grid h-full place-items-center rounded-2xl bg-muted text-sm text-muted-foreground">No chart data yet</div>;
}
