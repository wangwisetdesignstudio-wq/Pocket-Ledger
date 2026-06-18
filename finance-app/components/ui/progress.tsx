import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return <div className={cn("h-3 overflow-hidden rounded-full bg-muted", className)}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(value, 100)}%` }} /></div>;
}
