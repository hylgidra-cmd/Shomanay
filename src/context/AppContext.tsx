'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  User,
  DistrictObject,
  MFY,
  Issue,
  Task,
  InvestmentProject,
  IndustrialZone,
  AuditLogItem,
  SectorIndicator,
  TaskEvidence,
} from '@/types';
import { translations } from '@/lib/i18n';
import {
  mockUsers,
  mockMFYs,
  mockObjects,
  mockIssues,
  mockTasks,
  mockInvestments,
  mockIndustrialZones,
  mockAuditLogs,
  mockIndicators,
} from '@/lib/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['qq'];
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  users: User[];
  
  // Data
  objects: DistrictObject[];
  mfys: MFY[];
  issues: Issue[];
  tasks: Task[];
  investments: InvestmentProject[];
  industrialZones: IndustrialZone[];
  indicators: SectorIndicator[];
  auditLogs: AuditLogItem[];

  // Selected Object Passport Modal
  selectedPassportObject: DistrictObject | null;
  openObjectPassport: (obj: DistrictObject | string) => void;
  closeObjectPassport: () => void;

  // Actions (2-TZ Lifecycle)
  createIssue: (issue: Omit<Issue, 'id' | 'code' | 'reportedDate' | 'status'>) => void;
  createTask: (task: Omit<Task, 'id' | 'code' | 'createdDate' | 'status' | 'extensions' | 'isOverdue'>) => void;
  startTask: (taskId: string) => void;
  submitEvidence: (taskId: string, evidence: TaskEvidence) => { success: boolean; message?: string };
  reviewTask: (taskId: string, accepted: boolean, notes?: string) => { success: boolean; message: string };
  extendDeadline: (taskId: string, newDeadline: string, reason: string) => { success: boolean; message: string };
  importMockData: (fileName: string, rowCount: number) => { success: boolean; imported: number; errors: string[] };
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('qq');
  const [currentRole, setCurrentRole] = useState<UserRole>('hokim');
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  const [objects, setObjects] = useState<DistrictObject[]>(mockObjects);
  const [mfys, setMfys] = useState<MFY[]>(mockMFYs);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [investments, setInvestments] = useState<InvestmentProject[]>(mockInvestments);
  const [industrialZones, setIndustrialZones] = useState<IndustrialZone[]>(mockIndustrialZones);
  const [indicators] = useState<SectorIndicator[]>(mockIndicators);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);

  const [selectedPassportObject, setSelectedPassportObject] = useState<DistrictObject | null>(null);

  // Load from localStorage on mount if available
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('shm_lang') as Language;
      if (savedLang && ['qq', 'uz', 'ru'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
      const savedRole = localStorage.getItem('shm_role') as UserRole;
      if (savedRole) {
        setCurrentRole(savedRole);
        const matched = mockUsers.find((u) => u.role === savedRole);
        if (matched) setCurrentUser(matched);
      }
      const savedTasks = localStorage.getItem('shm_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      const savedIssues = localStorage.getItem('shm_issues');
      if (savedIssues) setIssues(JSON.parse(savedIssues));
      const savedAudit = localStorage.getItem('shm_audit');
      if (savedAudit) setAuditLogs(JSON.parse(savedAudit));
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('shm_lang', lang);
    } catch {}
  };

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentRole(role);
    const matched = mockUsers.find((u) => u.role === role);
    if (matched) setCurrentUser(matched);
    try {
      localStorage.setItem('shm_role', role);
    } catch {}
  };

  const t = translations[language] || translations.qq;

  const logAuditAction = (
    action: string,
    entityType: AuditLogItem['entityType'],
    entityId: string,
    entityName: string,
    changes: AuditLogItem['changes'],
    reason?: string
  ) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: `${currentUser.name} (${currentUser.title})`,
      userRole: currentUser.role,
      action,
      entityType,
      entityId,
      entityName,
      changes,
      reason,
      ipAddress: '195.158.12.84',
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('shm_audit', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const openObjectPassport = (obj: DistrictObject | string) => {
    if (typeof obj === 'string') {
      const found = objects.find((o) => o.id === obj);
      if (found) setSelectedPassportObject(found);
    } else {
      setSelectedPassportObject(obj);
    }
  };

  const closeObjectPassport = () => {
    setSelectedPassportObject(null);
  };

  const createIssue = (issueData: Omit<Issue, 'id' | 'code' | 'reportedDate' | 'status'>) => {
    const newCode = `MSH-2026-${String(issues.length + 86).padStart(3, '0')}`;
    const newId = `iss-${Date.now()}`;
    const newIssue: Issue = {
      ...issueData,
      id: newId,
      code: newCode,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'open',
    };
    setIssues((prev) => {
      const updated = [newIssue, ...prev];
      try {
        localStorage.setItem('shm_issues', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditAction(
      'Jańa mashqala tirkeldi',
      'issue',
      newId,
      newIssue.title,
      [{ field: 'status', oldValue: 'joq', newValue: 'open' }],
      newIssue.description
    );
  };

  const createTask = (taskData: Omit<Task, 'id' | 'code' | 'createdDate' | 'status' | 'extensions' | 'isOverdue'>) => {
    const newCode = `TAP-2026-${String(tasks.length + 1).padStart(3, '0')}`;
    const newId = `tsk-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id: newId,
      code: newCode,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'assigned',
      extensions: [],
      isOverdue: false,
    };

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      try {
        localStorage.setItem('shm_tasks', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Update related issue if any
    if (taskData.issueId) {
      setIssues((prev) =>
        prev.map((iss) =>
          iss.id === taskData.issueId ? { ...iss, status: 'assigned', assignedTaskId: newId } : iss
        )
      );
    }

    logAuditAction(
      'Jańa tapsırma tayınlandı',
      'task',
      newId,
      newTask.title,
      [{ field: 'status', oldValue: 'draft', newValue: 'assigned' }],
      `Múddet: ${newTask.deadline}, Orynlawshı: ${newTask.mainExecutorOrg}`
    );
  };

  const startTask = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((tsk) => (tsk.id === taskId ? { ...tsk, status: 'in_progress' as const } : tsk));
      try {
        localStorage.setItem('shm_tasks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditAction(
      'Tapsırma orınlawǵa kirisildi',
      'task',
      taskId,
      'Status: in_progress',
      [{ field: 'status', oldValue: 'assigned', newValue: 'in_progress' }]
    );
  };

  const submitEvidence = (taskId: string, evidence: TaskEvidence) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Tapsırma tabılmadı' };

    setTasks((prev) => {
      const updated = prev.map((tsk) =>
        tsk.id === taskId
          ? {
              ...tsk,
              status: 'under_review' as const,
              evidence,
            }
          : tsk
      );
      try {
        localStorage.setItem('shm_tasks', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    logAuditAction(
      'Dálil hám esabat tapsırıldı (Tekseriwde)',
      'task',
      taskId,
      task.title,
      [
        { field: 'status', oldValue: task.status, newValue: 'under_review' },
        { field: 'evidence', oldValue: 'joq', newValue: `${evidence.photos.length} foto, ${evidence.documents.length} hújjet` },
      ],
      evidence.comment
    );

    return { success: true };
  };

  // Rule FR-05 & FR-07: Independent inspector rule
  const reviewTask = (taskId: string, accepted: boolean, notes?: string): { success: boolean; message: string } => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Tapsırma tabılmadı' };

    // Enforcement: Executor role CANNOT self-approve
    if (currentUser.role === 'organization') {
      return {
        success: false,
        message: t.selfApprovalWarning,
      };
    }

    if (accepted) {
      setTasks((prev) => {
        const updated = prev.map((tsk) =>
          tsk.id === taskId
            ? {
                ...tsk,
                status: 'accepted' as const,
                completedDate: new Date().toISOString().split('T')[0],
                review: {
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: `${currentUser.name} (${currentUser.title})`,
                  accepted: true,
                  inspectorNotes: notes || 'Dáliller tastıyıqlandı, qabıl etildi.',
                },
              }
            : tsk
        );
        try {
          localStorage.setItem('shm_tasks', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Also resolve issue if connected
      if (task.issueId) {
        setIssues((prev) =>
          prev.map((iss) => (iss.id === task.issueId ? { ...iss, status: 'resolved' as const } : iss))
        );
      }

      logAuditAction(
        'Tapsırma qabıl etildi (Accepted)',
        'task',
        taskId,
        task.title,
        [{ field: 'status', oldValue: 'under_review', newValue: 'accepted' }],
        notes
      );

      return { success: true, message: 'Tapsırma tekseriwshi tárepinen qabıl etildi!' };
    } else {
      setTasks((prev) => {
        const updated = prev.map((tsk) =>
          tsk.id === taskId
            ? {
                ...tsk,
                status: 'returned_for_revision' as const,
                review: {
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: `${currentUser.name} (${currentUser.title})`,
                  accepted: false,
                  rejectionReason: notes || 'Kemshilikler kórsetildi',
                },
              }
            : tsk
        );
        try {
          localStorage.setItem('shm_tasks', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      logAuditAction(
        'Tapsırma qayta islewge qaytarıldı (Revision)',
        'task',
        taskId,
        task.title,
        [{ field: 'status', oldValue: 'under_review', newValue: 'returned_for_revision' }],
        notes
      );

      return { success: true, message: 'Tapsırma qayta islewge qaytarıldı.' };
    }
  };

  const extendDeadline = (taskId: string, newDeadline: string, reason: string): { success: boolean; message: string } => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Tapsırma tabılmadı' };

    const extensionItem = {
      id: `ext-${Date.now()}`,
      oldDeadline: task.deadline,
      newDeadline,
      reason,
      approvedBy: `${currentUser.name} (${currentUser.title})`,
      approvedDate: new Date().toISOString().split('T')[0],
    };

    setTasks((prev) => {
      const updated = prev.map((tsk) =>
        tsk.id === taskId
          ? {
              ...tsk,
              deadline: newDeadline,
              isOverdue: false,
              extensions: [...tsk.extensions, extensionItem],
            }
          : tsk
      );
      try {
        localStorage.setItem('shm_tasks', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    logAuditAction(
      'Múddet uzaytırıldı',
      'task',
      taskId,
      task.title,
      [{ field: 'deadline', oldValue: task.deadline, newValue: newDeadline }],
      reason
    );

    return { success: true, message: 'Múddet tabıslı uzaytırıldı!' };
  };

  const importMockData = (fileName: string, rowCount: number) => {
    logAuditAction(
      'Excel/CSV maǵlıwmatlar importı',
      'import',
      `imp-${Date.now()}`,
      fileName,
      [{ field: 'rowsImported', oldValue: '0', newValue: String(rowCount) }],
      `Fayl: ${fileName}, Jazaqlangan qatarlar: ${rowCount}`
    );
    return {
      success: true,
      imported: rowCount,
      errors: ['Satr 4: koordinata aniqlanmadi, standart markaz koordinatasi biriktirildi.'],
    };
  };

  const resetToDefaultData = () => {
    setObjects(mockObjects);
    setMfys(mockMFYs);
    setIssues(mockIssues);
    setTasks(mockTasks);
    setInvestments(mockInvestments);
    setIndustrialZones(mockIndustrialZones);
    setAuditLogs(mockAuditLogs);
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUserRole,
        users: mockUsers,
        objects,
        mfys,
        issues,
        tasks,
        investments,
        industrialZones,
        indicators,
        auditLogs,
        selectedPassportObject,
        openObjectPassport,
        closeObjectPassport,
        createIssue,
        createTask,
        startTask,
        submitEvidence,
        reviewTask,
        extendDeadline,
        importMockData,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
