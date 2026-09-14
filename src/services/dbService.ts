import type { AiSeoResearchReport, LocalBusinessReport, SiteAuditReport, ClientProject, TrackedKeyword, BacklinkItem, AuditScanLog, AiAgentActionLog } from '../types/seo';

export interface AppDatabaseExport {
  version: number;
  exportedAt: string;
  clients: ClientProject[];
  researchReports: AiSeoResearchReport[];
  mapsReports: LocalBusinessReport[];
  siteAudits: SiteAuditReport[];
  auditScanLogs?: AuditScanLog[];
  agentActionLogs?: AiAgentActionLog[];
  trackedKeywords: TrackedKeyword[];
  backlinks?: BacklinkItem[];
}


class DatabaseService {
  private isStorageAvailable(): boolean {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Generic localStorage fallback with key prefixes
  private getFromLocal<T>(key: string, defaultValue: T): T {
    if (!this.isStorageAvailable()) return defaultValue;
    try {
      const item = localStorage.getItem(`rpp_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  }

  private saveToLocal<T>(key: string, data: T): void {
    if (!this.isStorageAvailable()) return;
    try {
      localStorage.setItem(`rpp_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`Error saving key ${key} to storage:`, e);
    }
  }

  // --- AI SEO Research Reports ---
  public saveResearchReport(report: AiSeoResearchReport): void {
    const list = this.getSavedResearchReports();
    const existingIndex = list.findIndex(r => r.id === report.id || r.input.url === report.input.url);
    if (existingIndex >= 0) {
      list[existingIndex] = report;
    } else {
      list.unshift(report);
    }
    // Limit to last 50 reports
    this.saveToLocal('research_reports', list.slice(0, 50));
  }

  public getSavedResearchReports(): AiSeoResearchReport[] {
    return this.getFromLocal<AiSeoResearchReport[]>('research_reports', []);
  }

  public deleteResearchReport(id: string): void {
    const list = this.getSavedResearchReports().filter(r => r.id !== id);
    this.saveToLocal('research_reports', list);
  }

  // --- Google Maps & Local Business Reports ---
  public saveLocalBusinessReport(report: LocalBusinessReport): void {
    const list = this.getSavedLocalBusinessReports();
    const existingIndex = list.findIndex(r => r.id === report.id || (r.businessName.toLowerCase() === report.businessName.toLowerCase() && r.city.toLowerCase() === report.city.toLowerCase()));
    if (existingIndex >= 0) {
      list[existingIndex] = report;
    } else {
      list.unshift(report);
    }
    this.saveToLocal('maps_reports', list.slice(0, 50));
  }

  public getSavedLocalBusinessReports(): LocalBusinessReport[] {
    return this.getFromLocal<LocalBusinessReport[]>('maps_reports', []);
  }

  public deleteLocalBusinessReport(id: string): void {
    const list = this.getSavedLocalBusinessReports().filter(r => r.id !== id);
    this.saveToLocal('maps_reports', list);
  }

  // --- Site Audits ---
  public saveSiteAudit(audit: SiteAuditReport): void {
    const list = this.getSavedSiteAudits();
    const filtered = list.filter(a => a.id !== audit.id && a.url !== audit.url);
    this.saveToLocal('site_audits', [audit, ...filtered].slice(0, 30));
  }

  public getSavedSiteAudits(): SiteAuditReport[] {
    return this.getFromLocal<SiteAuditReport[]>('site_audits', []);
  }

  // --- Audit Scan History & Time Logging ---
  public saveAuditLog(log: AuditScanLog): void {
    const list = this.getAuditLogs();
    // Prepend new log
    const updated = [log, ...list.filter(l => l.id !== log.id)].slice(0, 100);
    this.saveToLocal('audit_scan_logs', updated);
  }

  public getAuditLogs(domainOrClientId?: string): AuditScanLog[] {
    const all = this.getFromLocal<AuditScanLog[]>('audit_scan_logs', []);
    if (!domainOrClientId) return all;
    const cleanFilter = domainOrClientId.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    return all.filter(l => 
      l.clientId === domainOrClientId || 
      l.domain.toLowerCase().includes(cleanFilter) || 
      l.url.toLowerCase().includes(cleanFilter)
    );
  }

  public deleteAuditLog(id: string): void {
    const list = this.getAuditLogs();
    this.saveToLocal('audit_scan_logs', list.filter(l => l.id !== id));
  }

  public clearAuditLogs(domainOrClientId?: string): void {
    if (!domainOrClientId) {
      this.saveToLocal('audit_scan_logs', []);
      return;
    }
    const cleanFilter = domainOrClientId.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const remaining = this.getAuditLogs().filter(l => 
      l.clientId !== domainOrClientId && 
      !l.domain.toLowerCase().includes(cleanFilter) && 
      !l.url.toLowerCase().includes(cleanFilter)
    );
    this.saveToLocal('audit_scan_logs', remaining);
  }

  // --- AI SEO Agent Action Logs ---
  public saveAgentActionLog(log: AiAgentActionLog): void {
    const list = this.getAgentActionLogs();
    const updated = [log, ...list.filter(l => l.id !== log.id)].slice(0, 150);
    this.saveToLocal('agent_action_logs', updated);
  }

  public saveMultipleAgentActionLogs(logs: AiAgentActionLog[]): void {
    const list = this.getAgentActionLogs();
    const logIds = new Set(logs.map(l => l.id));
    const updated = [...logs, ...list.filter(l => !logIds.has(l.id))].slice(0, 150);
    this.saveToLocal('agent_action_logs', updated);
  }

  public getAgentActionLogs(clientIdOrDomain?: string): AiAgentActionLog[] {
    const all = this.getFromLocal<AiAgentActionLog[]>('agent_action_logs', []);
    if (!clientIdOrDomain) return all;
    const cleanFilter = clientIdOrDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    return all.filter(l => 
      l.clientId === clientIdOrDomain || 
      (l.clientDomain && l.clientDomain.toLowerCase().includes(cleanFilter))
    );
  }

  public clearAgentActionLogs(clientIdOrDomain?: string): void {
    if (!clientIdOrDomain) {
      this.saveToLocal('agent_action_logs', []);
      return;
    }
    const cleanFilter = clientIdOrDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const remaining = this.getAgentActionLogs().filter(l => 
      l.clientId !== clientIdOrDomain && 
      (!l.clientDomain || !l.clientDomain.toLowerCase().includes(cleanFilter))
    );
    this.saveToLocal('agent_action_logs', remaining);
  }

  // --- Backlinks Storage ---
  public saveBacklink(item: BacklinkItem): void {
    const list = this.getSavedBacklinks();
    const existingIndex = list.findIndex(b => b.id === item.id);
    if (existingIndex >= 0) {
      list[existingIndex] = item;
    } else {
      list.unshift(item);
    }
    this.saveToLocal('backlinks', list.slice(0, 200));
  }

  public saveMultipleBacklinks(items: BacklinkItem[]): void {
    const list = this.getSavedBacklinks();
    const combined = [...items, ...list.filter(b => !items.some(newItem => newItem.id === b.id))];
    this.saveToLocal('backlinks', combined.slice(0, 200));
  }

  public getSavedBacklinks(): BacklinkItem[] {
    return this.getFromLocal<BacklinkItem[]>('backlinks', []);
  }

  public deleteBacklink(id: string): void {
    const list = this.getSavedBacklinks().filter(b => b.id !== id);
    this.saveToLocal('backlinks', list);
  }

  // --- Full Database Backup & Restore ---
  public exportFullBackup(clients: ClientProject[], trackedKeywords: TrackedKeyword[]): AppDatabaseExport {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      clients,
      researchReports: this.getSavedResearchReports(),
      mapsReports: this.getSavedLocalBusinessReports(),
      siteAudits: this.getSavedSiteAudits(),
      auditScanLogs: this.getAuditLogs(),
      agentActionLogs: this.getAgentActionLogs(),
      trackedKeywords,
      backlinks: this.getSavedBacklinks()
    };
  }


  public downloadBackupJson(clients: ClientProject[], trackedKeywords: TrackedKeyword[]): void {
    const data = this.exportFullBackup(clients, trackedKeywords);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rankpulse-seo-database-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public importBackupJson(jsonString: string): AppDatabaseExport | null {
    try {
      const data = JSON.parse(jsonString) as AppDatabaseExport;
      if (Array.isArray(data.researchReports)) {
        this.saveToLocal('research_reports', data.researchReports);
      }
      if (Array.isArray(data.mapsReports)) {
        this.saveToLocal('maps_reports', data.mapsReports);
      }
      if (Array.isArray(data.siteAudits)) {
        this.saveToLocal('site_audits', data.siteAudits);
      }
      if (Array.isArray(data.auditScanLogs)) {
        this.saveToLocal('audit_scan_logs', data.auditScanLogs);
      }
      if (Array.isArray(data.agentActionLogs)) {
        this.saveToLocal('agent_action_logs', data.agentActionLogs);
      }
      if (Array.isArray(data.backlinks)) {
        this.saveToLocal('backlinks', data.backlinks);
      }
      return data;
    } catch (e) {
      console.error('Failed to import database backup:', e);
      return null;
    }
  }

  public clearAllDatabase(): void {
    if (!this.isStorageAvailable()) return;
    const keysToRemove = ['rpp_research_reports', 'rpp_maps_reports', 'rpp_site_audits', 'rpp_audit_scan_logs', 'rpp_agent_action_logs', 'rpp_backlinks'];
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}

export const dbService = new DatabaseService();

