import React, { useState } from 'react';
import { dbService } from '../../services/dbService';
import type { ClientProject, TrackedKeyword } from '../../types/seo';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  MapPin, 
  Search, 
  AlertCircle
} from 'lucide-react';


interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientProject[];
  keywords: TrackedKeyword[];
  onDataRestored?: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  clients,
  keywords,
  onDataRestored
}) => {
  if (!isOpen) return null;

  const [notification, setNotification] = useState<string | null>(null);
  const [importText, setImportText] = useState<string>('');
  const [showImportArea, setShowImportArea] = useState<boolean>(false);

  const researchReports = dbService.getSavedResearchReports();
  const mapsReports = dbService.getSavedLocalBusinessReports();
  const siteAudits = dbService.getSavedSiteAudits();

  const handleExportBackup = () => {
    dbService.downloadBackupJson(clients, keywords);
    setNotification('Database backup JSON successfully downloaded!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImportBackup = () => {
    if (!importText.trim()) return;
    const result = dbService.importBackupJson(importText.trim());
    if (result) {
      setNotification('Database backup successfully restored!');
      setImportText('');
      setShowImportArea(false);
      if (onDataRestored) onDataRestored();
    } else {
      setNotification('Failed to parse backup JSON. Please check formatting.');
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all stored reports and cache? Initial client projects will remain.')) {
      dbService.clearAllDatabase();
      setNotification('All database records cleared.');
      if (onDataRestored) onDataRestored();
      setTimeout(() => setNotification(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-indigo-500/40 bg-[#0d1322] shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Central SEO Database & Storage</h3>
              <p className="text-xs text-slate-400">Manage all saved reports, local maps records, audits, and backups</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification banner */}
        {notification && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Storage Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex justify-center mb-1 text-pink-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-white">{researchReports.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">AI Keyword Reports</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex justify-center mb-1 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-white">{mapsReports.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Maps & Review Scans</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="flex justify-center mb-1 text-indigo-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-white">{siteAudits.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Site Audit Scans</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportBackup}
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              onClick={() => setShowImportArea(!showImportArea)}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition border border-slate-700 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Restore from Backup</span>
            </button>
          </div>

          {/* Import Textarea Area */}
          {showImportArea && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fadeIn">
              <label className="block text-xs font-semibold text-slate-300">
                Paste exported database backup JSON:
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"version": 1, "clients": [...], "researchReports": [...]}'
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowImportArea(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportBackup}
                  disabled={!importText.trim()}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition"
                >
                  Confirm Restore
                </button>
              </div>
            </div>
          )}

          {/* Clear Storage Danger */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Persistent in browser localStorage & memory</span>
            </span>
            <button
              onClick={handleClearAll}
              className="text-rose-400 hover:text-rose-300 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Saved History</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
