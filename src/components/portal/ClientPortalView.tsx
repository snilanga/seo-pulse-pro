import React from 'react';
import type { ClientProject, TrackedKeyword, SiteAuditReport } from '../../types/seo';
import { Award, TrendingUp, Search, ShieldCheck, Printer } from 'lucide-react';

interface ClientPortalViewProps {
  client: ClientProject;
  keywords: TrackedKeyword[];
  audit: SiteAuditReport;
  onExportReport: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  client,
  keywords,
  audit,
  onExportReport
}) => {
  const page1Keywords = keywords.filter(k => k.googlePosition.page1 || k.bingPosition.page1);
  const top3Keywords = keywords.filter(k => k.googlePosition.position <= 3 || k.bingPosition.position <= 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Client Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img src={client.logo} alt={client.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40" />
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-white">{client.name}</h1>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Page 1 Verified</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Google & Bing Organic Performance • Managed by Apex SEO Growth Agency
            </p>
          </div>
        </div>

        <button
          onClick={onExportReport}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xl shadow-amber-500/20 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Download PDF Monthly Report</span>
        </button>
      </div>

      {/* Primary Client Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
          <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Organic Visitors</h3>
          <div className="text-3xl font-black text-white mt-2">{client.monthlyTraffic.toLocaleString()}</div>
          <span className="text-xs font-semibold text-emerald-400 block mt-1">+{client.trafficGrowth}% Growth this month</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
          <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Page 1 SERP Rankings</h3>
          <div className="text-3xl font-black text-emerald-400 mt-2">{page1Keywords.length} Keywords</div>
          <span className="text-xs text-slate-400 block mt-1">{top3Keywords.length} in Top 3 (#1-#3 Spot)</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
          <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 rounded-2xl mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website Technical Grade</h3>
          <div className="text-3xl font-black text-amber-400 mt-2">{audit.overallScore}/100</div>
          <span className="text-xs text-slate-400 block mt-1">Mobile & Speed Optimized</span>
        </div>

      </div>

      {/* Page 1 Google & Bing Rankings Showcase */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Your Top Page 1 Search Engine Positions</span>
            </h3>
            <p className="text-xs text-slate-400">Target keywords actively generating organic traffic for your business</p>
          </div>
        </div>

        <div className="space-y-3">
          {keywords.slice(0, 5).map((kw) => (
            <div key={kw.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{kw.keyword}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Est. {kw.searchVolume.toLocaleString()} monthly searches</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-center px-3 py-1.5 bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase">Google Rank</span>
                  <span className="text-sm font-black text-emerald-400">#{kw.googlePosition.position}</span>
                </div>
                <div className="text-center px-3 py-1.5 bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase">Bing Rank</span>
                  <span className="text-sm font-black text-indigo-400">#{kw.bingPosition.position}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
