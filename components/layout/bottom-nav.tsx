"use client";

import { BarChart3, CalendarDays, Home, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "home", label: "Home", icon: Home },
  { id: "add", label: "Add", icon: Plus },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "monthly", label: "Monthly", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings }
] as const;

export type AppTab = typeof items[number]["id"];

export function BottomNav({ active, onChange }: { active: AppTab; onChange: (tab: AppTab) => void }) {
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2 sm:rounded-t-3xl sm:border"><div className="grid grid-cols-5 gap-1">{items.map((item) => <button key={item.id} aria-label={item.label} onClick={() => onChange(item.id)} className={cn("flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-medium text-muted-foreground transition", active === item.id && item.id !== "add" && "bg-muted text-primary", item.id === "add" && "-mt-8 mx-auto h-16 w-16 rounded-full bg-primary text-white shadow-soft")}><item.icon size={item.id === "add" ? 26 : 21} /><span className={item.id === "add" ? "sr-only" : ""}>{item.label}</span></button>)}</div></nav>;
}
