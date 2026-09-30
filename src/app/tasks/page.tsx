'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, IssuePriority } from '@/types';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  Upload,
  Calendar,
  User,
  ShieldCheck,
  Building2,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TasksPage() {
  const {
    tasks,
    currentUser,
    t,
    startTask,
    submitEvidence,
    reviewTask,
    extendDeadline,
    createTask,
    objects,
    openObjectPassport,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [evidenceModalTask, setEvidenceModalTask] = useState<Task | null>(null);
  const [reviewModalTask, setReviewModalTask] = useState<Task | null>(null);
  const [extendModalTask, setExtendModalTask] = useState<Task | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskExecutor, setNewTaskExecutor] = useState('Rayon Elektr Tarmaqları Kárxanası');
  const [newTaskInspector, setNewTaskInspector] = useState('Ǵárezsiz Tekseriw & Monitorinq Inspeksiyası');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-10-15T18:00');
  const [newTaskPriority, setNewTaskPriority] = useState<IssuePriority>('high');
  const [newTaskObjectId, setNewTaskObjectId] = useState('');
  const [newTaskExpected, setNewTaskExpected] = useState('');
  const [newTaskMethod, setNewTaskMethod] = useState('');

  // Evidence submission state
  const [evidenceComment, setEvidenceComment] = useState('');
  const [evidenceNumeric, setEvidenceNumeric] = useState('');
  const [evidenceUnit, setEvidenceUnit] = useState('');
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState(
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
  );
  const [evidenceDocName, setEvidenceDocName] = useState('Diyxanabad_Gaz_Ornatuv_Akti.pdf');

  // Review state
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAlert, setReviewAlert] = useState<string | null>(null);

  // Extend deadline state
  const [newDeadlineDate, setNewDeadlineDate] = useState('');
  const [extendReason, setExtendReason] = useState('');

  // Filtering
  const filteredTasks = tasks.filter((tsk) => {
    const matchesSearch =
      tsk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tsk.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tsk.mainExecutorOrg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tsk.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || tsk.priority === priorityFilter;
    const matchesOverdue = !showOverdueOnly || tsk.isOverdue;

    return matchesSearch && matchesStatus && matchesPriority && matchesOverdue;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    createTask({
      title: newTaskTitle,
      actionDescription: newTaskDesc,
      mainExecutorOrg: newTaskExecutor,
      executorPerson: 'Mas\'ul muhandis',
      inspectorOrg: newTaskInspector,
      inspectorPerson: 'M. Torebaev',
      priority: newTaskPriority,
      deadline: newTaskDeadline + ':00+05:00',
      expectedResult: newTaskExpected || 'Natija dalolatnomasi',
      verificationMethod: newTaskMethod || 'Joyida ko\'zdan kechirish va foto fiksatsiya',
      objectId: newTaskObjectId || undefined,
      objectName: objects.find((o) => o.id === newTaskObjectId)?.name,
      mfyId: 'mfy-1',
    });

    setCreateModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceModalTask) return;

    submitEvidence(evidenceModalTask.id, {
      submittedAt: new Date().toISOString(),
      submittedBy: `${currentUser.name} (${currentUser.title})`,
      comment: evidenceComment || 'Jumıslar tolıq orınlandı, dálil hújjetleri biriktirildi.',
      numericResult: evidenceNumeric ? parseFloat(evidenceNumeric) : undefined,
      unit: evidenceUnit,
      photos: [evidencePhotoUrl],
      documents: [{ name: evidenceDocName, size: '2.1 MB', type: 'PDF' }],
    });

    setEvidenceModalTask(null);
    setEvidenceComment('');
  };

  const handleReviewAction = (accepted: boolean) => {
    if (!reviewModalTask) return;

    const res = reviewTask(reviewModalTask.id, accepted, reviewNotes);
    if (!res.success) {
      setReviewAlert(res.message);
    } else {
      if (accepted) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      setReviewModalTask(null);
      setReviewNotes('');
      setReviewAlert(null);
    }
  };

  const handleExtendDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalTask || !newDeadlineDate) return;

    extendDeadline(extendModalTask.id, newDeadlineDate + ':00+05:00', extendReason);
    setExtendModalTask(null);
    setNewDeadlineDate('');
    setExtendReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              <CheckSquare className="w-7 h-7 text-[#0a3d8f]" />
              {t.pageTasksTitle}
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-[#0a3d8f] font-bold border border-blue-200">
              {tasks.length} {t.tabAllTasks}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {t.pageTasksSubtitle}
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#0a3d8f] hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-900/10 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.btnCreateTask}</span>
        </button>
      </div>

      {/* Filters bar in Crisp White */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchTaskPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a3d8f] focus:bg-white transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0a3d8f]"
          >
            <option value="all">Barlıq statuslar</option>
            <option value="assigned">Tapsırıldı (Assigned)</option>
            <option value="in_progress">Jarayonda (In Progress)</option>
            <option value="under_review">Tekseriwde (Under Review)</option>
            <option value="accepted">Qabıl etildi (Accepted)</option>
            <option value="returned_for_revision">Qayta islewge (Revision)</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0a3d8f]"
          >
            <option value="all">Barlıq áhmiyet</option>
            <option value="critical">Kritikalıq</option>
            <option value="high">Bálent</option>
            <option value="medium">Orta</option>
            <option value="low">Tómen</option>
          </select>
        </div>

        {/* Overdue checkbox */}
        <label className="flex items-center space-x-2 text-xs text-red-600 font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={showOverdueOnly}
            onChange={(e) => setShowOverdueOnly(e.target.checked)}
            className="rounded border-slate-300 text-red-600 focus:ring-0 w-4 h-4"
          />
          <span>Faqat múddeti ótkenler</span>
        </label>
      </div>

      {/* Tasks Cards List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-sm">
            Tapsırma tabılmadı.
          </div>
        ) : (
          filteredTasks.map((tsk) => {
            const isOverdue = tsk.isOverdue;
            return (
              <div
                key={tsk.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isOverdue
                    ? 'bg-white border-red-300 shadow-md'
                    : tsk.status === 'under_review'
                    ? 'bg-white border-amber-300 shadow-md'
                    : tsk.status === 'accepted'
                    ? 'bg-white border-emerald-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        {tsk.code}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          tsk.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : tsk.status === 'under_review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : tsk.status === 'returned_for_revision'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-blue-100 text-[#0a3d8f] border border-blue-200'
                        }`}
                      >
                        {tsk.status}
                      </span>

                      {isOverdue && (
                        <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold border border-red-200 animate-pulse flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          MÚDDETI ÓTKEN (Asia/Tashkent)
                        </span>
                      )}

                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                          tsk.priority === 'critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : tsk.priority === 'high'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tsk.priority.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{tsk.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{tsk.actionDescription}</p>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#0a3d8f]" />
                        <span>Orynlawshı: <strong className="text-slate-800">{tsk.mainExecutorOrg}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Tekseriwshi: <strong className="text-slate-800">{tsk.inspectorOrg}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Múddet: <strong className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-800'}>
                          {new Date(tsk.deadline).toLocaleDateString()} {new Date(tsk.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </strong></span>
                      </div>

                      {tsk.objectName && (
                        <button
                          onClick={() => openObjectPassport(tsk.objectId!)}
                          className="flex items-center gap-1.5 text-[#0a3d8f] hover:underline font-semibold"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>{tsk.objectName}</span>
                        </button>
                      )}
                    </div>

                    {/* Evidence & Review Notes preview */}
                    {tsk.evidence && (
                      <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="text-slate-800 font-bold flex items-center gap-2">
                            <Upload className="w-4 h-4 text-emerald-600" />
                            Dálil tapsırılǵan: {tsk.evidence.comment}
                          </div>
                          {tsk.evidence.numericResult !== undefined && (
                            <div className="text-slate-600">
                              Faktik nátiyje: <strong className="text-slate-900">{tsk.evidence.numericResult} {tsk.evidence.unit}</strong>
                            </div>
                          )}
                        </div>

                        {tsk.evidence.photos.length > 0 && (
                          <div className="flex items-center gap-2.5">
                            <img
                              src={tsk.evidence.photos[0]}
                              alt="Dalil"
                              className="w-14 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
                            />
                            <span className="text-[11px] text-slate-500 font-medium">({tsk.evidence.documents[0]?.name || 'Hújjet'})</span>
                          </div>
                        )}
                      </div>
                    )}

                    {tsk.review && (
                      <div className={`p-3.5 rounded-2xl text-xs border ${
                        tsk.review.accepted ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                      }`}>
                        <strong>Tekseriwshi xulosasi ({tsk.review.reviewedBy}):</strong> {tsk.review.inspectorNotes || tsk.review.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Actions Column in State Blue */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {tsk.status === 'assigned' && (
                      <button
                        onClick={() => startTask(tsk.id)}
                        className="px-4 py-2 rounded-xl bg-[#0a3d8f] hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        Jumıstı baslaw (In Progress)
                      </button>
                    )}

                    {(tsk.status === 'in_progress' || tsk.status === 'returned_for_revision') && (
                      <button
                        onClick={() => setEvidenceModalTask(tsk)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Dálil tapsırıw</span>
                      </button>
                    )}

                    {tsk.status === 'under_review' && (
                      <button
                        onClick={() => {
                          setReviewModalTask(tsk);
                          setReviewAlert(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Tekseriw & Qabıllaw</span>
                      </button>
                    )}

                    {tsk.status !== 'accepted' && (
                      <button
                        onClick={() => setExtendModalTask(tsk)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                      >
                        Múddetti uzaytıw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Task */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-8 shadow-2xl space-y-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-[#0a3d8f]" />
              Jańa Tapsırma Belgilew (FR-05)
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Tapsırma mazmunı / Atı</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Mısalı: Diyxanabad issıqxanasına jańa gaz liniyasın tartıw"
                  className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#0a3d8f]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Anıq háreket túsindirmesi</label>
                <textarea
                  rows={2}
                  required
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Kerekli texnika, materiallar hám orınlaw boyınsha talaplar..."
                  className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#0a3d8f]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Tiykarǵı Orynlawshı Shólkem</label>
                  <select
                    value={newTaskExecutor}
                    onChange={(e) => setNewTaskExecutor(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="Rayon Elektr Tarmaqları Kárxanası">Rayon Elektr Tarmaqları Kárxanası</option>
                    <option value="«Hududgaz Qaraqalpaqstan» Gaz Támiynatı">«Hududgaz» Gaz Támiynatı</option>
                    <option value="«Qaraqalpaq Suw Támiynatı» Shomanay filialı">«Suw Támiynatı» Filialı</option>
                    <option value="Shomanay Rayon Jol Ońlaw Basqarması">Jol Ońlaw Basqarması</option>
                    <option value="Rayon Kambagallikti Qısqartıw & Bántlik Bólimi">Bántlik Bólimi</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Ǵárezsiz Tekseriwshi</label>
                  <select
                    value={newTaskInspector}
                    onChange={(e) => setNewTaskInspector(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="Ǵárezsiz Tekseriw & Monitorinq Inspeksiyası">Ǵárezsiz Tekseriw Inspeksiyası</option>
                    <option value="Shomanay rayonı hákimligi">Shomanay Hákimligi (Koordinator)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Múddet (Asia/Tashkent)</label>
                  <input
                    type="datetime-local"
                    required
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Baylanıslı Obyekt</label>
                  <select
                    value={newTaskObjectId}
                    onChange={(e) => setNewTaskObjectId(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="">Obyekt biriktirilmesin</option>
                    {objects.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Biykar etiw
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0a3d8f] hover:bg-blue-800 rounded-xl shadow-sm"
                >
                  Tapsırma qosıw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Evidence */}
      {evidenceModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-6 h-6 text-amber-600" />
              Orınlanǵanlıq Dálilin Tapsırıw (FR-07)
            </h2>
            <p className="text-xs text-slate-500">
              Tapsırma: <strong className="text-slate-800">{evidenceModalTask.title}</strong>
            </p>

            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Orınlaw esabatı / Izoh</label>
                <textarea
                  rows={2}
                  required
                  value={evidenceComment}
                  onChange={(e) => setEvidenceComment(e.target.value)}
                  placeholder="Qanday jumıslar pitkerildi, qashan sınaqtan ótti..."
                  className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Sanlıq nátiyje (fakt)</label>
                  <input
                    type="number"
                    step="any"
                    value={evidenceNumeric}
                    onChange={(e) => setEvidenceNumeric(e.target.value)}
                    placeholder="Mısalı: 2.2"
                    className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Ólshem birligi</label>
                  <input
                    type="text"
                    value={evidenceUnit}
                    onChange={(e) => setEvidenceUnit(e.target.value)}
                    placeholder="atm, MWt, km..."
                    className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Foto dálil (URL)</label>
                <input
                  type="text"
                  value={evidencePhotoUrl}
                  onChange={(e) => setEvidencePhotoUrl(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Dalalatnama / Akt hújjeti (PDF)</label>
                <input
                  type="text"
                  value={evidenceDocName}
                  onChange={(e) => setEvidenceDocName(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEvidenceModalTask(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Biykar etiw
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm"
                >
                  Dálillerdi tekseriwge jiberiw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review & Accept Task */}
      {reviewModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Ǵárezsiz Tekseriw & Qabıllaw (FR-05, FR-07)
            </h2>
            <p className="text-xs text-slate-600">
              Tapsırma: <strong className="text-slate-900">{reviewModalTask.title}</strong>
            </p>

            {reviewAlert && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div>{reviewAlert}</div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="text-slate-600">
                Házirgi avtorizaciyadan ótken paydalanıwshı: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.title})
              </div>
              <div className="text-slate-600">
                Talap etiletuǵın tekseriwshi: <strong className="text-slate-900">{reviewModalTask.inspectorOrg}</strong>
              </div>
              {currentUser.role === 'organization' && (
                <div className="text-red-600 font-bold pt-1">
                  ⚠️ Diqqat: Siz orınlawshı rolindesiz. Orynlawshı óz tapsırmasın ózi qabıl ete almaydı!
                  Joqarıdaǵı menyudan roldi <strong>«Ǵárezsiz Tekseriwshi»</strong> yamasa <strong>«Rayon Hákimi»</strong>ge almastırıń.
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Tekseriwshi xulosasi / Eskertpeler</label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Dálil boyınsha dálalatnama tekserildi, obyekttegi gaz/elektr parametrleri sáykes..."
                className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewModalTask(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Jabıw
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleReviewAction(false)}
                  className="px-4 py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl"
                >
                  Qayta islewge qaytarıw
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-700/20"
                >
                  Tapsırmanı Qabıl etiw (Accept)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Extend Deadline */}
      {extendModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#0a3d8f]" />
              Múddetti Uzaytıw (FR-06)
            </h2>
            <p className="text-xs text-slate-600">
              Aldınǵı múddet: <strong className="text-slate-900">{new Date(extendModalTask.deadline).toLocaleDateString()}</strong>
            </p>

            <form onSubmit={handleExtendDeadline} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Jańa múddet</label>
                <input
                  type="datetime-local"
                  required
                  value={newDeadlineDate}
                  onChange={(e) => setNewDeadlineDate(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Uzaytıw sebebi (Auditke jazıladı)</label>
                <textarea
                  rows={2}
                  required
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  placeholder="Kabel materialları jetkerip beriliwi keshikkenligi sebepli..."
                  className="w-full mt-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setExtendModalTask(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Biykar etiw
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0a3d8f] hover:bg-blue-800 rounded-xl"
                >
                  Múddetti saqlaw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
