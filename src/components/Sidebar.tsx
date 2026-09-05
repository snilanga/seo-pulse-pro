import React from 'react';
import { 
  LayoutDashboard, 
  SearchCheck, 
  TrendingUp, 
  KeyRound, 
  Users, 
  FileSpreadsheet, 
  Shield,
  Bot,
  Flame,
  Code2,
  ExternalLink,
  Sparkles,
  Link2,
  ShieldCheck
} from 'lucide-react';

export type TabType = 'domain-checker' | 'dashboard' | 'audit' | 'serp' | 'keywords' | 'competitors' | 'reports' | 'ai-agent' | 'trending-keywords' | 'code-injector' | 'page-inspector' | 'backlinks' | 'admin';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  page1KeywordsCount: number;
  criticalIssuesCount: number;
  clientDomain: string;
  isSuperAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  page1KeywordsCount,
  criticalIssuesCount,
  clientDomain,
  isSuperAdmin = true
}) => {
  const menuItems = [
    {
      id: 'domain-checker' as TabType,
      label: 'Instant Domain Checker',
      icon: SearchCheck,
      badge: 'Page # & Grade',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400'
    },
    {
      id: 'dashboard' as TabType,
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'ai-agent' as TabType,
      label: 'Autonomous AI Agent',
      icon: Bot,
      badge: 'AI Active',
      badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-purple-400'
    },
    ...(isSuperAdmin ? [{
      id: 'admin' as TabType,
      label: 'Admin Control Panel',
      icon: ShieldCheck,
      badge: '👑 Admin',
      badgeColor: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400'
    }] : []),
    {
      id: 'backlinks' as TabType,
      label: 'Backlink Generator',
      icon: Link2,
      badge: 'High DA 90+',
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400'
    },
    {
      id: 'page-inspector' as TabType,
      label: 'Google/Bing Page Finder',
      icon: SearchCheck,
      badge: 'Exact Page #',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'trending-keywords' as TabType,
      label: 'Trending Key Generator',
      icon: Flame,
      badge: 'Google Trends',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'code-injector' as TabType,
      label: 'Deploy Code to Client Site',
      icon: Code2,
      badge: 'HTML/WordPress',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'audit' as TabType,
      label: 'Site SEO Auditor',
      icon: SearchCheck,
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} Fixes` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'serp' as TabType,
      label: 'Google & Bing Ranks',
      icon: TrendingUp,
      badge: `${page1KeywordsCount} Top 10`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'keywords' as TabType,
      label: 'Keyword Explorer',
      icon: KeyRound,
      badge: null
    },
    {
      id: 'competitors' as TabType,
      label: 'Competitor Gaps',
      icon: Users,
      badge: 'Page 1 Wins',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'reports' as TabType,
      label: 'Client PDF Reports',
      icon: FileSpreadsheet,
      badge: 'White-Label',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  ];

  return (
    <aside className="no-print w-full md:w-64 bg-[#0d1322] border-r border-slate-800 shrink-0 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        
        {/* Active Target Banner */}
        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>ACTIVE CLIENT DOMAIN</span>
            <Shield className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white truncate max-w-[140px]">{clientDomain}</span>
            <a
              href={`https://${clientDomain}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 p-1"
              title="Open website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Core Tools</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono border ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Agency Upgrade Card */}
      <div className="mt-8 bg-gradient-to-b from-indigo-950/60 to-slate-900 p-3.5 rounded-xl border border-indigo-500/20 text-center">
        <div className="inline-flex p-2 bg-indigo-500/20 rounded-lg text-indigo-300 mb-2">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold text-white mb-1">Google & Bing SERP Rank Engine</h4>
        <p className="text-[11px] text-slate-400 mb-3">Daily Page 1 rank tracking and automated white-label client PDF reports active.</p>
        <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Daily Sync Active</span>
        </div>
      </div>
    </aside>
  );
};
