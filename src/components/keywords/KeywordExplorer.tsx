import React, { useState } from 'react';
import type { TrackedKeyword } from '../../types/seo';
import { KeyRound, Search, Sparkles, Plus, Check } from 'lucide-react';

interface KeywordExplorerProps {
  onAddTrackedKeyword: (kw: TrackedKeyword) => void;
  clientId: string;
}

interface DiscoveredKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: 'Transactional' | 'Commercial' | 'Informational' | 'Navigational';
  topCompetitorDomain: string;
  tracked: boolean;
}

export const KeywordExplorer: React.FC<KeywordExplorerProps> = ({
  onAddTrackedKeyword,
  clientId
}) => {
  const [seedSearch, setSeedSearch] = useState('telehealth online prescription');

  const [discoveredList, setDiscoveredList] = useState<DiscoveredKeyword[]>([
    {
      keyword: 'best virtual doctor consultation app',
      volume: 18500,
      difficulty: 62,
      cpc: 5.80,
      intent: 'Commercial',
      topCompetitorDomain: 'teladochealth.com',
      tracked: false
    },
    {
      keyword: 'same day online prescription refill',
      volume: 24200,
      difficulty: 58,
      cpc: 4.90,
      intent: 'Transactional',
      topCompetitorDomain: 'goodrx.com',
      tracked: false
    },
    {
      keyword: 'urgent care telemedicine cost without insurance',
      volume: 14100,
      difficulty: 47,
      cpc: 3.40,
      intent: 'Transactional',
      topCompetitorDomain: 'amwell.com',
      tracked: false
    },
    {
      keyword: 'how to renew prescription online legally',
      volume: 9800,
      difficulty: 39,
      cpc: 2.10,
      intent: 'Informational',
      topCompetitorDomain: 'healthline.com',
      tracked: false
    },
    {
      keyword: 'board certified online primary care doctor',
      volume: 11500,
      difficulty: 51,
      cpc: 6.10,
      intent: 'Commercial',
      topCompetitorDomain: 'plushcare.com',
      tracked: false
    }
  ]);

  const handleSearchDiscovered = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedSearch.trim()) return;

    // Generate new keyword ideas based on seed
    const cleanSeed = seedSearch.toLowerCase().trim();
    const newItems: DiscoveredKeyword[] = [
      {
        keyword: `${cleanSeed} 24/7 service`,
        volume: Math.floor(Math.random() * 15000) + 5000,
        difficulty: Math.floor(Math.random() * 40) + 35,
        cpc: parseFloat((Math.random() * 5 + 2).toFixed(2)),
        intent: 'Transactional',
        topCompetitorDomain: 'topcompetitor.com',
        tracked: false
      },
      {
        keyword: `best ${cleanSeed} near me`,
        volume: Math.floor(Math.random() * 20000) + 8000,
        difficulty: Math.floor(Math.random() * 45) + 40,
        cpc: parseFloat((Math.random() * 6 + 3).toFixed(2)),
        intent: 'Commercial',
        topCompetitorDomain: 'localhealth.com',
        tracked: false
      },
      {
        keyword: `affordable ${cleanSeed} cost`,
        volume: Math.floor(Math.random() * 10000) + 3000,
        difficulty: Math.floor(Math.random() * 30) + 25,
        cpc: parseFloat((Math.random() * 3 + 1.5).toFixed(2)),
        intent: 'Informational',
        topCompetitorDomain: 'pricingguide.org',
        tracked: false
      }
    ];

    setDiscoveredList([...newItems, ...discoveredList]);
  };

  const handleTrackDiscovered = (item: DiscoveredKeyword) => {
    const created: TrackedKeyword = {
      id: `kw-disc-${Date.now()}`,
      clientId,
      keyword: item.keyword,
      searchVolume: item.volume,
      difficulty: item.difficulty,
      cpc: item.cpc,
      intent: item.intent,
      tags: ['Keyword Discovery', 'Page 1 Target'],
      updatedAt: new Date().toISOString().split('T')[0],
      googlePosition: {
        engine: 'google',
        device: 'desktop',
        position: 4,
        previousPosition: 8,
        url: `https://clientdomain.com/${item.keyword.replace(/\s+/g, '-')}`,
        serpFeatures: ['Featured Snippet'],
        page1: true
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: 3,
        previousPosition: 7,
        url: `https://clientdomain.com/${item.keyword.replace(/\s+/g, '-')}`,
        serpFeatures: [],
        page1: true
      },
      history: [
        { date: 'Aug 1', googlePos: 12, bingPos: 10 },
        { date: 'Sep 1', googlePos: 4, bingPos: 3 }
      ]
    };

    onAddTrackedKeyword(created);
    setDiscoveredList(discoveredList.map(d => d.keyword === item.keyword ? { ...d, tracked: true } : d));
  };

  return (
    <div className="space-y-6">
      
      {/* Keyword Discovery Input */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            <span>Keyword Intelligence & Search Intent Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Discover high-intent Page 1 opportunities with estimated search volume, CPC, and keyword difficulty scores
          </p>
        </div>

        <form onSubmit={handleSearchDiscovered} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              value={seedSearch}
              onChange={(e) => setSeedSearch(e.target.value)}
              placeholder="Enter seed keyword or industry topic (e.g. telehealth, cloud security)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 shrink-0 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Keywords</span>
          </button>
        </form>
      </div>

      {/* Discovered Keywords Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            High Potential Page 1 Opportunities ({discoveredList.length})
          </h3>
          <span className="text-[11px] text-slate-400">Sorted by Search Volume</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Keyword Candidate</th>
                <th className="px-4 py-3.5 text-center">Monthly Volume</th>
                <th className="px-4 py-3.5 text-center">Difficulty (KD%)</th>
                <th className="px-4 py-3.5 text-center">Est. CPC</th>
                <th className="px-4 py-3.5">Search Intent</th>
                <th className="px-4 py-3.5">Top #1 Competitor</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {discoveredList.map((item) => (
                <tr key={item.keyword} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <span className="font-bold text-white text-xs">{item.keyword}</span>
                  </td>

                  <td className="px-4 py-4 text-center font-bold text-slate-200">
                    {item.volume.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.difficulty >= 60 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {item.difficulty}%
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center font-mono text-indigo-400">
                    ${item.cpc}
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.intent}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {item.topCompetitorDomain}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {item.tracked ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                        <Check className="w-4 h-4" />
                        <span>Tracked</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTrackDiscovered(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 ml-auto shadow-md transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to SERP Tracker</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
