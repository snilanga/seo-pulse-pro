import React, { useState } from 'react';
import type { TrackedKeyword } from '../../types/seo';
import { 
  Search, 
  Award, 
  Zap, 
  Sparkles
} from 'lucide-react';

interface SerpPageInspectorProps {
  keywords: TrackedKeyword[];
  onNavigateToAuditor: () => void;
}

export const SerpPageInspector: React.FC<SerpPageInspectorProps> = ({
  keywords,
  onNavigateToAuditor
}) => {
  const [filterPage, setFilterPage] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Helper to convert position number to SERP Page Number (10 results per SERP page)
  const getSerpPageNumber = (position: number | null): { page: number; pageLabel: string; isPage1: boolean } => {
    if (!position || position > 100) {
      return { page: 0, pageLabel: 'Not in Top 100', isPage1: false };
    }
    const pageNum = Math.ceil(position / 10);
    return {
      page: pageNum,
      pageLabel: `Page ${pageNum} (#${position})`,
      isPage1: pageNum === 1
    };
  };

  const filteredKeywords = keywords.filter((kw) => {
    const textMatch = kw.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    
    const gPage = getSerpPageNumber(kw.googlePosition.position).page;
    const bPage = getSerpPageNumber(kw.bingPosition.position).page;

    let pageMatch = true;
    if (filterPage === 'Page 1') pageMatch = gPage === 1 || bPage === 1;
    if (filterPage === 'Page 2') pageMatch = gPage === 2 || bPage === 2;
    if (filterPage === 'Page 3+') pageMatch = (gPage >= 3) || (bPage >= 3);
    if (filterPage === 'Unranked') pageMatch = gPage === 0 || bPage === 0;

    return textMatch && pageMatch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Google & Bing Exact SERP Page Inspector</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                EXACT PAGE # FINDER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Check precisely which page number (Page 1, Page 2, Page 3+) and rank position your client website appears on
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToAuditor}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xl shadow-indigo-600/20 shrink-0 transition"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Audit Fixes to Push Page 2 to Page 1</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search keyword or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Page Filter Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold shrink-0">Filter by SERP Page:</span>
            {['All', 'Page 1', 'Page 2', 'Page 3+', 'Unranked'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPage(p)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                  filterPage === p
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Page Inspector Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Search Engine SERP Page Results ({filteredKeywords.length} Search Terms)
          </h3>
          <span className="text-[11px] text-slate-400">10 Search Results per Page</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Target Search Term</th>
                <th className="px-4 py-3.5 text-center">Google SERP Page #</th>
                <th className="px-4 py-3.5 text-center">Bing SERP Page #</th>
                <th className="px-4 py-3.5 text-center">Page Status</th>
                <th className="px-6 py-3.5 text-right">Page 1 Push Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKeywords.map((kw) => {
                const gInfo = getSerpPageNumber(kw.googlePosition.position);
                const bInfo = getSerpPageNumber(kw.bingPosition.position);
                const isBothPage1 = gInfo.isPage1 && bInfo.isPage1;
                const isPage2Candidate = gInfo.page === 2 || bInfo.page === 2;

                return (
                  <tr key={kw.id} className="hover:bg-slate-800/40 transition">
                    
                    {/* Keyword & Target URL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{kw.keyword}</span>
                        {isBothPage1 && (
                          <span title="Ranked on Page 1 on Both Engines">
                            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] text-slate-400">Vol: {kw.searchVolume.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] text-indigo-400 font-mono">
                          {kw.googlePosition.url.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                    </td>

                    {/* Google SERP Page # */}
                    <td className="px-4 py-4 text-center">
                      <div className={`inline-flex flex-col items-center px-3 py-1.5 rounded-xl border ${
                        gInfo.isPage1
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : gInfo.page === 2
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <span className="text-xs font-black uppercase">
                          {gInfo.page === 1 ? 'PAGE 1' : gInfo.page === 2 ? 'PAGE 2' : gInfo.page > 2 ? `PAGE ${gInfo.page}` : 'UNRANKED'}
                        </span>
                        <span className="text-[10px] font-mono">Pos #{kw.googlePosition.position}</span>
                      </div>
                    </td>

                    {/* Bing SERP Page # */}
                    <td className="px-4 py-4 text-center">
                      <div className={`inline-flex flex-col items-center px-3 py-1.5 rounded-xl border ${
                        bInfo.isPage1
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                          : bInfo.page === 2
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <span className="text-xs font-black uppercase">
                          {bInfo.page === 1 ? 'PAGE 1' : bInfo.page === 2 ? 'PAGE 2' : bInfo.page > 2 ? `PAGE ${bInfo.page}` : 'UNRANKED'}
                        </span>
                        <span className="text-[10px] font-mono">Pos #{kw.bingPosition.position}</span>
                      </div>
                    </td>

                    {/* Page Status Indicator */}
                    <td className="px-4 py-4 text-center">
                      {isBothPage1 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Page 1 Verified
                        </span>
                      ) : isPage2Candidate ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                          🔥 Page 2 Quick Win
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                          Page {Math.max(gInfo.page, bInfo.page)}
                        </span>
                      )}
                    </td>

                    {/* Action Strategy */}
                    <td className="px-6 py-4 text-right">
                      {isPage2Candidate ? (
                        <button
                          onClick={onNavigateToAuditor}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1 shadow transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Push Page 2 ➔ Page 1</span>
                        </button>
                      ) : isBothPage1 ? (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Top 10 Spot Secured
                        </span>
                      ) : (
                        <button
                          onClick={onNavigateToAuditor}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium inline-flex items-center space-x-1"
                        >
                          <span>Optimize On-Page</span>
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
