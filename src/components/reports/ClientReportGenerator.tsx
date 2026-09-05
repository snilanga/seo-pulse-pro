import React, { useState } from 'react';
import type { ClientProject, TrackedKeyword, SiteAuditReport, ClientReportConfig } from '../../types/seo';
import { 
  FileSpreadsheet, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Edit3
} from 'lucide-react';

interface ClientReportGeneratorProps {
  client: ClientProject;
  keywords: TrackedKeyword[];
  audit: SiteAuditReport;
  reportConfig: ClientReportConfig;
  onUpdateConfig: (config: ClientReportConfig) => void;
}

export const ClientReportGenerator: React.FC<ClientReportGeneratorProps> = ({
  client,
  keywords,
  audit,
  reportConfig,
  onUpdateConfig
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSummary, setTempSummary] = useState(reportConfig.executiveSummary);
  const [tempAgencyName, setTempAgencyName] = useState(reportConfig.agencyName);
  const [tempReportTitle, setTempReportTitle] = useState(reportConfig.reportTitle);

  const handleSaveConfig = () => {
    onUpdateConfig({
      ...reportConfig,
      agencyName: tempAgencyName,
      reportTitle: tempReportTitle,
      executiveSummary: tempSummary
    });
    setIsEditing(false);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const page1Keywords = keywords.filter(k => k.googlePosition.page1 || k.bingPosition.page1);
  const top3Keywords = keywords.filter(k => k.googlePosition.position <= 3 || k.bingPosition.position <= 3);

  return (
    <div className="space-y-6">
      
      {/* Top Action Header (Hidden in Print) */}
      <div className="no-print glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <span>White-Label Executive Client SEO Report</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate client-ready PDF reports with Google/Bing Page 1 rank gains, site health score, and strategy roadmaps
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <span>{isEditing ? 'Close Customizer' : 'Edit Report Content'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Export Client PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Editor Modal Drawer (Hidden in Print) */}
      {isEditing && (
        <div className="no-print glass-panel p-6 rounded-2xl border border-indigo-500/40 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Report Customization & Agency Branding</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Agency Brand Name</label>
              <input
                type="text"
                value={tempAgencyName}
                onChange={(e) => setTempAgencyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Report Title</label>
              <input
                type="text"
                value={tempReportTitle}
                onChange={(e) => setTempReportTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Executive Summary for Client</label>
            <textarea
              rows={4}
              value={tempSummary}
              onChange={(e) => setTempSummary(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveConfig}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow"
            >
              Save Custom Report
            </button>
          </div>
        </div>
      )}

      {/* Actual Printable Client Document (Styled for screen & print) */}
      <div className="bg-[#131b2e] print:bg-white text-white print:text-slate-900 p-8 rounded-3xl border border-slate-800 print:border-none shadow-2xl space-y-8 max-w-4xl mx-auto">
        
        {/* Report Header Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-6">
          <div className="flex items-center space-x-4">
            <img
              src={client.logo}
              alt={client.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30 print:border-slate-300"
            />
            <div>
              <h1 className="text-xl font-extrabold text-white print:text-slate-900">{reportConfig.reportTitle}</h1>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Prepared for <strong className="text-indigo-300 print:text-indigo-600">{client.name}</strong> ({client.domain})
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-amber-400 print:text-amber-600 uppercase tracking-widest block">
              {reportConfig.agencyName}
            </span>
            <span className="text-[11px] text-slate-400 print:text-slate-500">{reportConfig.dateRange}</span>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-slate-900/90 print:bg-slate-50 p-6 rounded-2xl border border-slate-800 print:border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-700 mb-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Executive Performance Summary</span>
          </h3>
          <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed font-medium">
            {reportConfig.executiveSummary}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-800 print:border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block mb-1">Organic Visitors</span>
            <span className="text-2xl font-black text-white print:text-slate-900">{client.monthlyTraffic.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 print:text-emerald-600 block mt-0.5">+{client.trafficGrowth}% Growth</span>
          </div>

          <div className="p-4 bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-800 print:border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block mb-1">Page 1 Keywords</span>
            <span className="text-2xl font-black text-emerald-400 print:text-emerald-600">{page1Keywords.length}</span>
            <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-0.5">Google & Bing SERP</span>
          </div>

          <div className="p-4 bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-800 print:border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block mb-1">Top 3 Rankings</span>
            <span className="text-2xl font-black text-indigo-400 print:text-indigo-600">{top3Keywords.length}</span>
            <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-0.5">#1-#3 Positions</span>
          </div>

          <div className="p-4 bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-800 print:border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block mb-1">Site Health</span>
            <span className="text-2xl font-black text-amber-400 print:text-amber-600">{audit.overallScore}/100</span>
            <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-0.5">Technical Grade</span>
          </div>
        </div>

        {/* Page 1 Google & Bing Ranking Wins */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white print:text-slate-900 flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
            <span>Page 1 Search Engine Ranking Wins</span>
          </h3>

          <div className="border border-slate-800 print:border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 print:bg-slate-200 text-slate-400 print:text-slate-700 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3">Search Term</th>
                  <th className="px-3 py-3 text-center">Volume</th>
                  <th className="px-3 py-3 text-center">Google Rank</th>
                  <th className="px-3 py-3 text-center">Bing Rank</th>
                  <th className="px-4 py-3 text-right">Target URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {keywords.slice(0, 5).map((kw) => (
                  <tr key={kw.id}>
                    <td className="px-4 py-3 font-semibold text-white print:text-slate-900">{kw.keyword}</td>
                    <td className="px-3 py-3 text-center text-slate-300 print:text-slate-700">{kw.searchVolume.toLocaleString()}</td>
                    <td className="px-3 py-3 text-center font-bold text-emerald-400 print:text-emerald-600">#{kw.googlePosition.position}</td>
                    <td className="px-3 py-3 text-center font-bold text-indigo-400 print:text-indigo-600">#{kw.bingPosition.position}</td>
                    <td className="px-4 py-3 text-right text-[11px] text-slate-400 print:text-slate-600 truncate max-w-[150px]">
                      {kw.googlePosition.url.replace(/^https?:\/\//, '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Strategy Roadmap */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white print:text-slate-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 print:text-indigo-600" />
            <span>Completed Fixes & Next Month Growth Roadmap</span>
          </h3>

          <div className="space-y-2">
            {reportConfig.customRoadmapItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900/60 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${
                    item.status === 'completed' ? 'bg-emerald-400' : item.status === 'in-progress' ? 'bg-amber-400' : 'bg-indigo-400'
                  }`}></span>
                  <span className="font-semibold text-slate-200 print:text-slate-800">{item.task}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-indigo-300 print:text-indigo-700 font-mono">{item.impact}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 print:bg-slate-200 text-slate-300 print:text-slate-700">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-[10px] text-slate-400 print:text-slate-600">
          <span>Generated by RankPulse Pro Enterprise Suite</span>
          <span>Confidential Client Report • {client.name}</span>
        </div>

      </div>

    </div>
  );
};
