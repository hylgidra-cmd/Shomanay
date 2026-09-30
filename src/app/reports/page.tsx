'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
} from 'lucide-react';

export default function ReportsPage() {
  const { tasks, investments, mfys, objects, t } = useApp();
  const [selectedReportType, setSelectedReportType] = useState('executive_summary');
  const [selectedMfy, setSelectedMfy] = useState('all');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (selectedReportType === 'executive_summary' || selectedReportType === 'tasks') {
      csvContent += 'ID,Kod,Sarlavha,Mas\'ul Tashkilot,Tekshiruvchi,Muddat,Status,Muddati O\'tgan\n';
      tasks.forEach((t) => {
        csvContent += `"${t.id}","${t.code}","${t.title}","${t.mainExecutorOrg}","${t.inspectorOrg}","${t.deadline}","${t.status}","${t.isOverdue ? 'Ha' : 'Yo\'q'}"\n`;
      });
    } else {
      csvContent += 'ID,Nomi,Investor,Soha,Jami Baha (mln),Ishga tushish,Moliyaviy %,Fizik %\n';
      investments.forEach((inv) => {
        csvContent += `"${inv.id}","${inv.name}","${inv.investorName}","${inv.directionSector}","${inv.totalCostMlnUzs}","${inv.plannedLaunchDate}","${inv.financialProgressPercent}","${inv.physicalProgressPercent}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Shomanay_${selectedReportType}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-cyan-300" />
            {t.pageReportsTitle}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t.pageReportsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-[#081324] hover:bg-slate-800/60 text-slate-200 text-xs font-bold border border-blue-900/50 shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-300" />
            <span>{t.printReport}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-2xl bg-cyan-300 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-900/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar in Crisp White */}
      <div className="p-5 rounded-3xl bg-[#081324] border border-blue-900/50 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Filter className="w-4 h-4 text-cyan-300" />
          <span>Esabat túri:</span>
        </div>

        <select
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          className="px-3.5 py-2.5 text-xs rounded-xl bg-[#0b1b33] border border-blue-900/50 text-slate-200 focus:outline-none focus:border-cyan-300"
        >
          <option value="executive_summary">Rayon Ulıwma Boshqarıw Esabatı</option>
          <option value="tasks">Topshırıqlar & Ijro Intizomi (Shólkemler kesiminde)</option>
          <option value="investments">Investiciya Joybarları (Reje & Fakt)</option>
          <option value="issues">Mashqalalar & Infratuzilma Sheklewleri Reestri</option>
        </select>

        <select
          value={selectedMfy}
          onChange={(e) => setSelectedMfy(e.target.value)}
          className="px-3.5 py-2.5 text-xs rounded-xl bg-[#0b1b33] border border-blue-900/50 text-slate-200 focus:outline-none focus:border-cyan-300"
        >
          <option value="all">Barlıq MPJlar</option>
          {mfys.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs text-slate-400 font-mono">
          Shakllantirildi: {new Date().toLocaleDateString()} (FERGA Live)
        </span>
      </div>

      {/* Printable Report Document Card in Government White/Blue */}
      <div className="p-10 rounded-3xl bg-[#081324] border border-blue-900/50 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Report Official Header */}
        <div className="text-center border-b-2 border-white pb-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300 font-black">
            Qaraqalpaqstan Respublikası · Shomanay Rayonı Hákimligi
          </div>
          <h2 className="text-2xl font-black text-white mt-2 uppercase">
            {selectedReportType === 'executive_summary' && 'Rayon Operativ Boshqarıw & Ijro Intizomi Esabatı'}
            {selectedReportType === 'tasks' && 'Topshırıqlar Orınlanıwı Hám Qadaǵalaw Reestri'}
            {selectedReportType === 'investments' && 'Investiciya Joybarları: Reje & Fakt Monitoringi'}
            {selectedReportType === 'issues' && 'Mashqalalar & Infratuzilma Sheklewleri Reestri'}
          </h2>
          <div className="text-xs text-slate-400 mt-1.5 font-mono">
            Sáne: 30-sentyabr 2026-jıl · Tashkent waqtı
          </div>
        </div>

        {/* Executive summary metrics */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#0b1b33] border border-blue-900/50">
            <div className="text-xs text-slate-400 font-medium">Jámi Obyektler</div>
            <div className="text-2xl font-black text-white mt-1">{objects.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1b33] border border-blue-900/50">
            <div className="text-xs text-slate-400 font-medium">Aktiv Tapsırmalar</div>
            <div className="text-2xl font-black text-cyan-300 mt-1">{tasks.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1b33] border border-blue-900/50">
            <div className="text-xs text-slate-400 font-medium">Múddeti Ótken</div>
            <div className="text-2xl font-black text-red-600 mt-1">
              {tasks.filter((t) => t.isOverdue && t.status !== 'accepted').length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1b33] border border-blue-900/50">
            <div className="text-xs text-slate-400 font-medium">Invest Joybarlar</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{investments.length}</div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-blue-900/50 divide-y divide-blue-900/50">
            <thead className="bg-[#0b1b33]">
              <tr className="text-slate-200 font-bold">
                <th className="py-3 px-4">Kod</th>
                <th className="py-3 px-4">Mazmunı / Atı</th>
                <th className="py-3 px-4">Juwapker Shólkem</th>
                <th className="py-3 px-4">Múddet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Fakt / Nátiyje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/50">
              {tasks.map((tsk) => (
                <tr key={tsk.id} className="hover:bg-slate-800/60">
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">{tsk.code}</td>
                  <td className="py-3 px-4 font-bold text-white">{tsk.title}</td>
                  <td className="py-3 px-4 text-slate-300">{tsk.mainExecutorOrg}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(tsk.deadline).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-bold uppercase text-[11px]">
                    <span className={`px-2.5 py-0.5 rounded-full ${
                      tsk.status === 'accepted' ? 'bg-emerald-950/40 text-emerald-400' :
                      tsk.status === 'under_review' ? 'bg-amber-950/40 text-amber-400' :
                      'bg-blue-950 text-cyan-300'
                    }`}>
                      {tsk.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {tsk.evidence ? `${tsk.evidence.numericResult || ''} ${tsk.evidence.unit || ''}` : 'Kutilmekte'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Signatures footer */}
        <div className="pt-10 border-t border-blue-900/50 flex justify-between items-center text-xs text-slate-300">
          <div>
            <div className="font-medium">Shomanay rayonı rawajlanıw muwapıqlastırıw bólimi</div>
            <div className="font-black text-white mt-2 text-sm">A. Qalandarov ___________________</div>
          </div>
          <div className="text-right">
            <div className="font-medium">Ǵárezsiz Tekseriw & Monitorinq Inspeksiyası</div>
            <div className="font-black text-white mt-2 text-sm">M. Torebaev ___________________</div>
          </div>
        </div>
      </div>
    </div>
  );
}
