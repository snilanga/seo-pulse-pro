import React from 'react';
import type { ClientProject, TrackedKeyword, SiteAuditReport } from '../../types/seo';
import { 
  TrendingUp, 
  Search, 
  Award, 
  AlertTriangle, 
  ArrowUpRight, 
  Zap, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface OverviewDashboardProps {
  client: ClientProject;
  keywords: TrackedKeyword[];
  audit: SiteAuditReport;
  onNavigateTab: (tab: any) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  client,
  keywords,
  audit,
  onNavigateTab
}) => {
  // Compute key stats
  const page1Count = keywords.filter(k => k.googlePosition.page1 || k.bingPosition.page1).length;
  const top3Count = keywords.filter(k => k.googlePosition.position <= 3 || k.bingPosition.position <= 3).length;
  const criticalCount = audit.issues.filter(i => i.severity === 'critical').length;
  const warningCount = audit.issues.filter(i => i.severity === 'warning').length;

  // Chart data: Ranking distribution
  const rankDistributionData = [
    { name: 'Top 3 (#1-#3)', count: top3Count, fill: '#10b981' },
    { name: 'Top 10 (Page 1)', count: page1Count, fill: '#3b82f6' },
    { name: 'Page 2 (#11-#20)', count: keywords.length - page1Count, fill: '#f59e0b' }
  ];

  // Chart data: Historical traffic growth
  const trafficTrendData = [
    { month: 'Apr', traffic: 24100, page1: 18 },
    { month: 'May', traffic: 28400, page1: 22 },
    { month: 'Jun', traffic: 31200, page1: 27 },
    { month: 'Jul', traffic: 36800, page1: 31 },
    { month: 'Aug', traffic: 39500, page1: 34 },
    { month: 'Sep', traffic: client.monthlyTraffic, page1: client.page1Keywords }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={client.logo} alt={client.name} className="w-14 h-14 rounded-xl object-cover border-2 border-indigo-500/30" />
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-white">{client.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Client
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
              <span>{client.domain}</span>
              <span>•</span>
              <span>{client.industry}</span>
              <span>•</span>
              <span className="text-indigo-400">{client.targetRegion}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('audit')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Run New Audit</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Client PDF Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Monthly Organic Traffic */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Organic Traffic</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{client.monthlyTraffic.toLocaleString()}</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{client.trafficGrowth}%</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Est. organic visitors from Google & Bing</p>
          </div>
        </div>

        {/* Metric 2: Page 1 SERP Rankings */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Page 1 Keywords</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{page1Count} / {keywords.length}</span>
              <span className="text-xs font-semibold text-emerald-400">
                ({Math.round((page1Count / keywords.length) * 100)}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{top3Count} keywords ranked in Top 3 (#1-#3)</p>
          </div>
        </div>

        {/* Metric 3: Technical Health Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Site Health Index</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{audit.overallScore}/100</span>
              <span className="text-xs font-semibold text-rose-400">
                {criticalCount} Critical
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{warningCount} warnings awaiting optimization</p>
          </div>
        </div>

        {/* Metric 4: Authority & Backlinks */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Domain Rating</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">DR {client.domainRating}</span>
              <span className="text-xs font-semibold text-indigo-400">{client.backlinksCount.toLocaleString()} Links</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">High equity referring domains</p>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Organic Traffic Velocity Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Organic Traffic Growth Trajectory</h3>
              <p className="text-xs text-slate-400">Estimated monthly Google & Bing search sessions</p>
            </div>
            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-medium">
              6-Month Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Page 1 Rank Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">SERP Position Breakdown</h3>
            <p className="text-xs text-slate-400">Tracked keywords in Top 3, Page 1 & Page 2</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankDistributionData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {rankDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Page 1 Keyword Winners & Priority Technical Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Page 1 Google & Bing SERP Winners */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Top Page 1 Ranking Winners</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">High volume terms driving primary client business</p>
            </div>
            <button
              onClick={() => onNavigateTab('serp')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>View All Ranks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {keywords.slice(0, 4).map((kw) => (
              <div key={kw.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">{kw.keyword}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-slate-400">Vol: {kw.searchVolume.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-indigo-400 font-mono">CPC ${kw.cpc}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-center px-2 py-1 bg-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase">Google</span>
                    <span className="text-xs font-bold text-emerald-400">#{kw.googlePosition.position}</span>
                  </div>
                  <div className="text-center px-2 py-1 bg-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase">Bing</span>
                    <span className="text-xs font-bold text-indigo-400">#{kw.bingPosition.position}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Technical Fixes for Page 1 Push */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Actionable Page 1 Optimization Fixes</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">Prioritized technical improvements for target URL</p>
            </div>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Audit Fixes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {audit.issues.filter(i => !i.fixed).slice(0, 3).map((issue) => (
              <div key={issue.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  issue.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{issue.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Impact {issue.impactScore}/10
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{issue.description}</p>
                  <p className="text-[10px] text-indigo-300 font-medium mt-1">Fix: {issue.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
