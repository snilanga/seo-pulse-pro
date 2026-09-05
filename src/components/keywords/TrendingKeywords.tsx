import React, { useState } from 'react';
import type { ClientProject, TrackedKeyword } from '../../types/seo';
import { 
  Flame, 
  Sparkles, 
  Search, 
  Plus, 
  Check, 
  Code2 
} from 'lucide-react';

interface TrendingKeywordsProps {
  client: ClientProject;
  onAddTrackedKeyword: (kw: TrackedKeyword) => void;
  onNavigateToCodeInjector: (keywordsList: string[]) => void;
}

interface TrendingKeywordItem {
  id: string;
  keyword: string;
  trendGrowth: string; // e.g. "+240% Google Trend"
  monthlyVolume: number;
  difficulty: number; // 0-100
  cpc: number;
  intent: 'Transactional' | 'Commercial' | 'Informational';
  category: 'Breakout Viral' | 'Top Volume Ranker' | 'High Conversion';
  addedToTracker: boolean;
}

export const TrendingKeywords: React.FC<TrendingKeywordsProps> = ({
  client,
  onAddTrackedKeyword,
  onNavigateToCodeInjector
}) => {
  const [seedInput, setSeedInput] = useState(client.industry.split(' ')[0] || 'telehealth');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [trendingList, setTrendingList] = useState<TrendingKeywordItem[]>([
    {
      id: 'trend-1',
      keyword: 'same day virtual doctor prescription online',
      trendGrowth: '+310% Search Interest',
      monthlyVolume: 32500,
      difficulty: 54,
      cpc: 6.80,
      intent: 'Transactional',
      category: 'Breakout Viral',
      addedToTracker: false
    },
    {
      id: 'trend-2',
      keyword: '24 7 telehealth urgent care consultation',
      trendGrowth: '+185% Search Interest',
      monthlyVolume: 41200,
      difficulty: 62,
      cpc: 8.40,
      intent: 'Transactional',
      category: 'Top Volume Ranker',
      addedToTracker: false
    },
    {
      id: 'trend-3',
      keyword: 'affordable online doctor visit without insurance',
      trendGrowth: '+275% Search Interest',
      monthlyVolume: 28400,
      difficulty: 46,
      cpc: 4.90,
      intent: 'Commercial',
      category: 'High Conversion',
      addedToTracker: false
    },
    {
      id: 'trend-4',
      keyword: 'best telehealth app for online prescription refill',
      trendGrowth: '+195% Search Interest',
      monthlyVolume: 19800,
      difficulty: 42,
      cpc: 5.20,
      intent: 'Commercial',
      category: 'Breakout Viral',
      addedToTracker: false
    },
    {
      id: 'trend-5',
      keyword: 'how to consult licensed doctor online fast',
      trendGrowth: '+140% Search Interest',
      monthlyVolume: 15600,
      difficulty: 38,
      cpc: 3.10,
      intent: 'Informational',
      category: 'Top Volume Ranker',
      addedToTracker: false
    }
  ]);

  const handleGenerateTrending = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedInput.trim()) return;

    const term = seedInput.trim().toLowerCase();
    const generated: TrendingKeywordItem[] = [
      {
        id: `trend-${Date.now()}-1`,
        keyword: `trending ${term} online consultation 2026`,
        trendGrowth: '+420% Viral Interest',
        monthlyVolume: Math.floor(Math.random() * 25000) + 15000,
        difficulty: Math.floor(Math.random() * 35) + 35,
        cpc: parseFloat((Math.random() * 5 + 4).toFixed(2)),
        intent: 'Transactional',
        category: 'Breakout Viral',
        addedToTracker: false
      },
      {
        id: `trend-${Date.now()}-2`,
        keyword: `best ${term} services near me instant`,
        trendGrowth: '+260% Search Interest',
        monthlyVolume: Math.floor(Math.random() * 35000) + 20000,
        difficulty: Math.floor(Math.random() * 40) + 40,
        cpc: parseFloat((Math.random() * 6 + 5).toFixed(2)),
        intent: 'Commercial',
        category: 'Top Volume Ranker',
        addedToTracker: false
      },
      {
        id: `trend-${Date.now()}-3`,
        keyword: `fast ${term} prescription refill low cost`,
        trendGrowth: '+310% Search Interest',
        monthlyVolume: Math.floor(Math.random() * 18000) + 10000,
        difficulty: Math.floor(Math.random() * 30) + 30,
        cpc: parseFloat((Math.random() * 4 + 3).toFixed(2)),
        intent: 'High Conversion' as any,
        category: 'High Conversion',
        addedToTracker: false
      }
    ];

    setTrendingList([...generated, ...trendingList]);
  };

  const handleTrackKeyword = (item: TrendingKeywordItem) => {
    const created: TrackedKeyword = {
      id: `kw-trend-${Date.now()}`,
      clientId: client.id,
      keyword: item.keyword,
      searchVolume: item.monthlyVolume,
      difficulty: item.difficulty,
      cpc: item.cpc,
      intent: item.intent,
      tags: ['Trending Keyword', item.category],
      updatedAt: new Date().toISOString().split('T')[0],
      googlePosition: {
        engine: 'google',
        device: 'desktop',
        position: 3,
        previousPosition: 7,
        url: `https://${client.domain}/${item.keyword.replace(/\s+/g, '-')}`,
        serpFeatures: ['Featured Snippet'],
        page1: true
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: 2,
        previousPosition: 5,
        url: `https://${client.domain}/${item.keyword.replace(/\s+/g, '-')}`,
        serpFeatures: [],
        page1: true
      },
      history: [
        { date: 'Aug 15', googlePos: 7, bingPos: 5 },
        { date: 'Sep 1', googlePos: 3, bingPos: 2 }
      ]
    };

    onAddTrackedKeyword(created);
    setTrendingList(trendingList.map(t => t.id === item.id ? { ...t, addedToTracker: true } : t));
  };

  const handleInjectAllToClientSite = () => {
    const allKwStrings = trendingList.map(t => t.keyword);
    onNavigateToCodeInjector(allKwStrings);
  };

  const filteredTrending = trendingList.filter(t => 
    selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-red-500 rounded-2xl text-white shadow-lg shadow-amber-500/20 shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Trending Search Keywords & High-Rank Generator</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GOOGLE & BING TRENDS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Generate breakout viral search terms, high-volume keywords, and commercial intent phrases to rank on Page 1
            </p>
          </div>
        </div>

        <button
          onClick={handleInjectAllToClientSite}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xl shadow-emerald-600/20 shrink-0 transition"
        >
          <Code2 className="w-4 h-4" />
          <span>Deploy All Keywords to Client Website Code</span>
        </button>
      </div>

      {/* Generator Input Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleGenerateTrending} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder="Enter seed topic or target industry (e.g. telehealth, prescription, SaaS)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/20 shrink-0 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Trending Keywords</span>
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2">
        {['All', 'Breakout Viral', 'Top Volume Ranker', 'High Conversion'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trending Keywords Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrending.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 space-y-3 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  🔥 {item.trendGrowth}
                </span>
                <h3 className="text-sm font-bold text-white mt-2">{item.keyword}</h3>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                {item.category}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-3">
                <span className="text-slate-400">Vol: <strong className="text-white">{item.monthlyVolume.toLocaleString()}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Difficulty: <strong className="text-emerald-400">{item.difficulty}%</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-400 font-mono">CPC ${item.cpc}</span>
              </div>

              {item.addedToTracker ? (
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </span>
              ) : (
                <button
                  onClick={() => handleTrackKeyword(item)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Track Term</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
