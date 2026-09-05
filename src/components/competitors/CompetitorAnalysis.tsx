import React from 'react';
import type { CompetitorData, ClientProject, TrackedKeyword } from '../../types/seo';
import { Users, ShieldAlert, Award, ExternalLink, Sparkles } from 'lucide-react';

interface CompetitorAnalysisProps {
  client: ClientProject;
  competitors: CompetitorData[];
  onAddTrackedKeyword: (kw: TrackedKeyword) => void;
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
  client,
  competitors,
  onAddTrackedKeyword
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Competitor Keyword Gap & Page 1 Theft Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Identify search terms where competitors dominate Page 1 of Google & Bing so your client can overtake them
            </p>
          </div>

          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-500/30">
            {competitors.length} Competitors Analyzed
          </span>
        </div>
      </div>

      {/* Domain Authority Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Client Domain Card */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-indigo-500/40 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">YOUR CLIENT DOMAIN</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-white">{client.domain}</h3>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">DR {client.domainRating}</span>
            <span className="text-xs text-slate-400">{client.keywordsCount} Keywords</span>
          </div>
        </div>

        {/* Competitor Cards */}
        {competitors.map((comp) => (
          <div key={comp.id} className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COMPETITOR</span>
              <a href={`https://${comp.domain}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <h3 className="text-sm font-bold text-white">{comp.domain}</h3>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-200">DR {comp.domainAuthority}</span>
              <span className="text-xs text-slate-400">{comp.sharedKeywords} Shared Terms</span>
            </div>
          </div>
        ))}

      </div>

      {/* Competitor Keyword Gap Tables */}
      <div className="space-y-6">
        {competitors.map((comp) => (
          <div key={comp.id} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Page 1 Rank Opportunities vs. <span className="text-amber-400">{comp.domain}</span>
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">{comp.gapKeywords.length} High Intent Gaps Found</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Gap Search Term</th>
                    <th className="px-4 py-3.5 text-center">Monthly Volume</th>
                    <th className="px-4 py-3.5 text-center">Difficulty</th>
                    <th className="px-4 py-3.5 text-center">Competitor Rank</th>
                    <th className="px-4 py-3.5 text-center">Client Rank</th>
                    <th className="px-6 py-3.5 text-right">Overtake Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {comp.gapKeywords.map((gap) => (
                    <tr key={gap.keyword} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-bold text-white">
                        {gap.keyword}
                      </td>

                      <td className="px-4 py-4 text-center font-bold text-slate-200">
                        {gap.searchVolume.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300">
                          {gap.difficulty}%
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs">
                          #{gap.competitorPos} Page 1
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        {gap.clientPos ? (
                          <span className="px-2 py-1 rounded-lg bg-slate-800 text-amber-400 font-bold text-xs">
                            #{gap.clientPos} Page 2
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">Unranked</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            onAddTrackedKeyword({
                              id: `kw-gap-${Date.now()}`,
                              clientId: client.id,
                              keyword: gap.keyword,
                              searchVolume: gap.searchVolume,
                              difficulty: gap.difficulty,
                              cpc: 4.20,
                              intent: 'Transactional',
                              tags: ['Competitor Gap', 'Target #1'],
                              updatedAt: new Date().toISOString().split('T')[0],
                              googlePosition: {
                                engine: 'google',
                                device: 'desktop',
                                position: gap.clientPos || 15,
                                previousPosition: gap.clientPos ? gap.clientPos + 3 : 20,
                                url: `https://${client.domain}/${gap.keyword.replace(/\s+/g, '-')}`,
                                serpFeatures: [],
                                page1: (gap.clientPos || 15) <= 10
                              },
                              bingPosition: {
                                engine: 'bing',
                                device: 'desktop',
                                position: gap.clientPos ? gap.clientPos - 1 : 14,
                                previousPosition: gap.clientPos ? gap.clientPos + 2 : 18,
                                url: `https://${client.domain}/${gap.keyword.replace(/\s+/g, '-')}`,
                                serpFeatures: [],
                                page1: (gap.clientPos || 14) <= 10
                              },
                              history: [
                                { date: 'Aug 1', googlePos: 20, bingPos: 18 },
                                { date: 'Sep 1', googlePos: gap.clientPos || 15, bingPos: gap.clientPos ? gap.clientPos - 1 : 14 }
                              ]
                            });
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-1 shadow transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Target Page 1 Spot</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
