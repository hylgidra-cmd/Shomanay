'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Users,
} from 'lucide-react';

export default function InvestmentsPage() {
  const { investments, t, openObjectPassport } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvestments = investments.filter((inv) =>
    inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.directionSector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#0a3d8f]" />
            {t.pageInvestTitle}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {t.pageInvestSubtitle}
          </p>
        </div>
      </div>

      {/* Search in Crisp White */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Joybar yamasa investor atın izlew..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a3d8f] focus:bg-white"
          />
        </div>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-6">
        {filteredInvestments.map((inv) => {
          const isDelayed = inv.stage === 'delayed' || inv.milestones.some((m) => m.status === 'delayed');
          return (
            <div
              key={inv.id}
              className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#0a3d8f] border border-blue-200 font-bold">
                      {inv.directionSector}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono font-bold">
                      Bosqich: {inv.stage.toUpperCase()}
                    </span>
                    {isDelayed && (
                      <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        KESHIGIWE BAR
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{inv.name}</h2>
                  <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-500">
                    <span>Investor: <strong className="text-slate-800">{inv.investorName}</strong></span>
                    <span>Rejeli iske túsiriw: <strong className="text-slate-800">{inv.plannedLaunchDate}</strong></span>
                  </div>

                  {/* Financial stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Jámi baha</div>
                      <div className="text-base font-extrabold text-slate-900 mt-1">{inv.totalCostMlnUzs.toLocaleString()} mln som</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Sırtqı investiciya</div>
                      <div className="text-base font-extrabold text-[#0a3d8f] mt-1">${inv.foreignInvestThousandUsd.toLocaleString()} mıń</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Eksport potencialı</div>
                      <div className="text-base font-extrabold text-emerald-700 mt-1">${inv.exportPotentialThousandUsd.toLocaleString()} mıń/jıl</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Jıllıq salıq tushumi</div>
                      <div className="text-base font-extrabold text-amber-700 mt-1">{inv.annualTaxPotentialMlnUzs.toLocaleString()} mln som</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openObjectPassport(inv.objectId)}
                  className="px-5 py-2.5 text-xs font-bold text-[#0a3d8f] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shrink-0 self-start"
                >
                  Obyekt Pasportı →
                </button>
              </div>

              {/* Financial Absorption vs Physical Construction Comparison (FR-09) */}
              <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-800 font-bold">{t.financialAbsorption}</span>
                    <span className="text-[#0a3d8f] font-mono font-black text-sm">{inv.financialProgressPercent}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${inv.financialProgressPercent}%` }}
                      className="bg-[#0a3d8f] h-full rounded-full transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Bank kreditleri hám investor qarjılarınıń esap-faktura boyınsha ózlestiriliwi
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-800 font-bold">{t.physicalProgress}</span>
                    <span className="text-emerald-700 font-mono font-black text-sm">{inv.physicalProgressPercent}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${inv.physicalProgressPercent}%` }}
                      className="bg-emerald-600 h-full rounded-full transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Qurılıs-montaj hám uskunalar ornatılıwınıń orınında tastıyıqlanǵan tayarlıǵı
                  </span>
                </div>
              </div>

              {/* Jobs verification (FR-09) */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0a3d8f]" />
                  <span className="text-slate-900 font-bold">Jumıs orınları verifikatsiyası (FR-09):</span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-600">Reje:</span>{' '}
                    <strong className="text-slate-900">{inv.plannedJobs} nafar</strong>
                  </div>
                  <div>
                    <span className="text-slate-600">Investor esabatı:</span>{' '}
                    <strong className="text-[#0a3d8f]">{inv.reportedJobs} nafar</strong>
                  </div>
                  <div>
                    <span className="text-slate-600">Tastıyıqlanǵan (Fakt):</span>{' '}
                    <strong className="text-emerald-700">{inv.verifiedJobs} nafar</strong>
                  </div>
                </div>
              </div>

              {/* Milestones list (FR-09) */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  {t.milestonesTitle}
                </h4>
                <div className="space-y-2.5">
                  {inv.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        {m.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : m.status === 'delayed' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400" />
                        )}
                        <div>
                          <span className="text-slate-900 font-bold">{m.title}</span>
                          <span className="text-slate-500 ml-2">({m.weightPercent}% salmaq)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-mono text-[11px]">Reje: {m.plannedDate}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'delayed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {m.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
