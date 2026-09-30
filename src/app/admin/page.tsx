'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Database,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Search,
  RotateCcw,
} from 'lucide-react';

export default function AdminPage() {
  const { auditLogs, importMockData, resetToDefaultData, t } = useApp();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [auditSearch, setAuditSearch] = useState('');

  const handleSimulateImport = () => {
    const res = importMockData(selectedFile || 'Shomanay_Obyektler_2026_Q3.xlsx', 14);
    setImportResult({ imported: res.imported, errors: res.errors });
  };

  const filteredLogs = auditLogs.filter((log) =>
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.entityName.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Database className="w-7 h-7 text-[#0a3d8f]" />
            {t.pageAdminTitle}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {t.pageAdminSubtitle}
          </p>
        </div>

        <button
          onClick={resetToDefaultData}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <span>Baza maǵlıwmatların dáslepki halǵa qaytarıw</span>
        </button>
      </div>

      {/* Section 1: Excel / CSV Import (FR-13) in Crisp White */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">{t.importTitle}</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono font-bold">Format: XLSX, CSV (UTF-8)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          {/* Upload Area */}
          <div className="p-10 border-2 border-dashed border-slate-200 hover:border-[#0a3d8f] rounded-3xl bg-slate-50 text-center space-y-4 transition-colors">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#0a3d8f] flex items-center justify-center border border-blue-100">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Excel yamasa CSV fayldı saylań</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Obyektler reestri, investiciya basqıshları yamasa taraw kórsetkishleri
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setSelectedFile('Shomanay_Obyektler_2026_Q3.xlsx')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs cursor-pointer"
              >
                📁 «Shomanay_Obyektler_2026_Q3.xlsx»
              </button>
              <button
                onClick={() => setSelectedFile('Investiciyalar_Milestones_Fakt.xlsx')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs cursor-pointer"
              >
                📁 «Investiciyalar_Milestones_Fakt.xlsx»
              </button>
            </div>

            {selectedFile && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-[#0a3d8f] flex items-center justify-between">
                <span>Saylanǵan fayl: <strong>{selectedFile}</strong> (1.4 MB)</span>
                <button
                  onClick={handleSimulateImport}
                  className="px-4 py-2 rounded-xl bg-[#0a3d8f] hover:bg-blue-800 text-white font-bold shadow-sm cursor-pointer"
                >
                  Importtı baslaw
                </button>
              </div>
            )}
          </div>

          {/* Validation & Ingestion Protocol (FR-13) */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Satrma-satr Validaciya Protokoli
            </h3>

            {importResult ? (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>
                    Tabıslı júklendi: <strong>{importResult.imported} qatar</strong> maǵlıwmatlar bazasına qosıldı.
                  </span>
                </div>

                {importResult.errors.map((err, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-600 space-y-2.5 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a3d8f]" />
                  <span>Qáwipsizlik tekseriwi: Makroslar atqarılmaydı</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a3d8f]" />
                  <span>Koordinalar: WGS 84 diapazoni tekseriledi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a3d8f]" />
                  <span>Dubllar qorǵawı: Idempotentlik gilti arqalı qaytalanıwlar bloklanadı</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a3d8f]" />
                  <span>Rásmiylestiriw: Júklengen paket dáslep qoralama (draft) bolıp túsedi</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Audit Log (FR-15 & NFR-02) */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#0a3d8f]" />
            <h2 className="text-base font-extrabold text-slate-900">{t.auditTitle}</h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              placeholder="Audit boyınsha izlew..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#0a3d8f]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">{t.auditTableTime}</th>
                <th className="py-3 px-4">{t.auditTableUser}</th>
                <th className="py-3 px-4">{t.auditTableAction}</th>
                <th className="py-3 px-4">{t.auditTableEntity}</th>
                <th className="py-3 px-4">{t.auditTableChanges}</th>
                <th className="py-3 px-4">{t.auditTableIp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{log.userName}</td>
                  <td className="py-3.5 px-4 text-[#0a3d8f] font-bold">{log.action}</td>
                  <td className="py-3.5 px-4 text-slate-700">{log.entityName}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {log.changes.map((c, i) => (
                      <div key={i} className="text-xs">
                        <span className="text-slate-400 font-medium">{c.field}:</span>{' '}
                        <span className="text-red-500 line-through mr-1 font-mono">{c.oldValue}</span>
                        <span className="text-emerald-700 font-bold font-mono">➡️ {c.newValue}</span>
                      </div>
                    ))}
                    {log.reason && (
                      <div className="text-[11px] text-slate-500 italic mt-1 font-medium">Sebep: {log.reason}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
