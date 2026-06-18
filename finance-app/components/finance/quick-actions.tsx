"use client";

import { Download, FileSpreadsheet, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FinanceState } from "@/types/finance";
import { exportBackup, exportCsv, exportExcel, exportPdf } from "@/utils/export";

export function ExportButtons({ state, onImport }: { state: FinanceState; onImport: (state: FinanceState) => void }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Button variant="secondary" onClick={() => exportCsv(state)}><Download size={18} />CSV</Button><Button variant="secondary" onClick={() => exportExcel(state)}><FileSpreadsheet size={18} />Excel</Button><Button variant="secondary" onClick={() => exportPdf(state)}><FileText size={18} />PDF</Button><label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-muted px-5 text-sm font-semibold"><Upload size={18} />Import<input hidden type="file" accept="application/json" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; onImport(JSON.parse(await file.text())); }} /></label><Button className="col-span-2 sm:col-span-4" variant="secondary" onClick={() => exportBackup(state)}>Backup Local Data</Button></div>;
}
