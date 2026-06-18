import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/layout/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pocket Ledger",
  description: "A mobile-first personal finance tracker for daily income and expense logging.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Pocket Ledger" }
};

export const viewport: Viewport = { themeColor: "#2563EB", width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><PwaRegister />{children}</body></html>;
}
