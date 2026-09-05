import React, { useState, useEffect } from 'react';
import type { TrackedKeyword, EngineType } from '../../types/seo';
import { 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Search, 
  Plus, 
  Award
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface SerpRankTrackerProps {
  keywords: TrackedKeyword[];
  onAddKeyword: (newKeyword: TrackedKeyword) => void;
  clientId: string;
}

export const SerpRankTracker: React.FC<SerpRankTrackerProps> = ({
  keywords,
  onAddKeyword,
  clientId
}) => {
  const [selectedEngine, setSelectedEngine] = useState<EngineType | 'both'>('both');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPage1Only, setShowPage1Only] = useState(false);
  const [selectedKeywordChart, setSelectedKeywordChart] = useState<TrackedKeyword | null>(keywords[0] || null);

  useEffect(() => {
    if (keywords.length > 0) {
      const match = keywords.find(k => k.id === selectedKeywordChart?.id);
      setSelectedKeywordChart(match || keywords[0]);
    } else {
      setSelectedKeywordChart(null);
    }
  }, [keywords]);

  // New Keyword Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKwText, setNewKwText] = useState('');
  const [newKwVolume, setNewKwVolume] = useState('8500');
  const [newKwDifficulty, setNewKwDifficulty] = useState('55');
  const [newKwIntent, setNewKwIntent] = useState<'Informational' | 'Transactional' | 'Commercial' | 'Navigational'>('Transactional');

  const handleCreateKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKwText.trim()) return;

    const googlePosVal = Math.floor(Math.random() * 5) + 1;
    const bingPosVal = Math.floor(Math.random() * 6) + 1;

    const created: TrackedKeyword = {
      id: `kw-${Date.now()}`,
      clientId,
      keyword: newKwText.trim(),
      searchVolume: parseInt(newKwVolume) || 5000,
      difficulty: parseInt(newKwDifficulty) || 50,
      cpc: 3.50,
      intent: newKwIntent,
      tags: ['Manual Tracked', 'Page 1 Goal'],
      updatedAt: new Date().toISOString().split('T')[0],
      googlePosition: {
        engine: 'google',
        device: 'desktop',
        position: googlePosVal,
        previousPosition: googlePosVal + 2,
        url: `https://clientdomain.com/${newKwText.toLowerCase().replace(/\s+/g, '-')}`,
        serpFeatures: ['Featured Snippet'],
        page1: googlePosVal <= 10
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: bingPosVal,
        previousPosition: bingPosVal + 3,
        url: `https://clientdomain.com/${newKwText.toLowerCase().replace(/\s+/g, '-')}`,
        serpFeatures: [],
        page1: bingPosVal <= 10
      },
      history: [
        { date: 'Aug 1', googlePos: googlePosVal + 6, bingPos: bingPosVal + 5 },
        { date: 'Aug 15', googlePos: googlePosVal + 3, bingPos: bingPosVal + 2 },
        { date: 'Sep 1', googlePos: googlePosVal, bingPos: bingPosVal }
      ]
    };

    onAddKeyword(created);
    setNewKwText('');
    setIsAddModalOpen(false);
  };

  // Filter keywords
  const filteredKeywords = keywords.filter(kw => {
    const textMatch = kw.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const page1Match = !showPage1Only || (kw.googlePosition.page1 || kw.bingPosition.page1);
    return textMatch && page1Match;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Google & Bing Page 1 SERP Rank Tracker</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live search engine position movement, SERP features (Snippets & Maps), and Page 1 ranking trajectory
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Keyword</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search tracked keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedEngine('both')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition ${
                selectedEngine === 'both' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Engines
            </button>
            <button
              onClick={() => setSelectedEngine('google')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition ${
                selectedEngine === 'google' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setSelectedEngine('bing')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition ${
                selectedEngine === 'bing' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bing
            </button>
          </div>

          <div className="flex items-center justify-end">
            <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300 font-semibold bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 w-full justify-between">
              <span>Show Page 1 Only</span>
              <input
                type="checkbox"
                checked={showPage1Only}
                onChange={(e) => setShowPage1Only(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>

        </div>
      </div>

      {/* Historical Trend Chart for Selected Keyword */}
      {selectedKeywordChart && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-indigo-400">HISTORICAL RANKING MOVEMENT</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {selectedKeywordChart.intent}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedKeywordChart.keyword}</h3>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Google Pos: #{selectedKeywordChart.googlePosition.position}</span>
              </span>
              <span className="flex items-center space-x-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                <span>Bing Pos: #{selectedKeywordChart.bingPosition.position}</span>
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedKeywordChart.history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis reversed domain={[1, 20]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="googlePos" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Google Rank" />
                <Line type="monotone" dataKey="bingPos" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="Bing Rank" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Ranks Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Target Keyword</th>
                <th className="px-4 py-3.5 text-center">Search Volume</th>
                <th className="px-4 py-3.5 text-center">Difficulty</th>
                {(selectedEngine === 'both' || selectedEngine === 'google') && (
                  <th className="px-4 py-3.5 text-center">Google Pos</th>
                )}
                {(selectedEngine === 'both' || selectedEngine === 'bing') && (
                  <th className="px-4 py-3.5 text-center">Bing Pos</th>
                )}
                <th className="px-4 py-3.5">SERP Features</th>
                <th className="px-6 py-3.5 text-right">Target Landing Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKeywords.map((kw) => {
                const gDiff = kw.googlePosition.previousPosition - kw.googlePosition.position;
                const bDiff = kw.bingPosition.previousPosition - kw.bingPosition.position;
                const isSelected = selectedKeywordChart?.id === kw.id;

                return (
                  <tr
                    key={kw.id}
                    onClick={() => setSelectedKeywordChart(kw)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition ${
                      isSelected ? 'bg-indigo-600/10 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    {/* Keyword */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{kw.keyword}</span>
                        {kw.googlePosition.position <= 3 && (
                          <span title="Top 3 #1-#3 Position">
                            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {kw.intent}
                        </span>
                        <span className="text-[10px] text-indigo-400 font-mono">CPC ${kw.cpc}</span>
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="px-4 py-4 text-center font-semibold text-slate-200">
                      {kw.searchVolume.toLocaleString()}
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        kw.difficulty >= 70
                          ? 'bg-rose-500/20 text-rose-300'
                          : kw.difficulty >= 50
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {kw.difficulty}%
                      </span>
                    </td>

                    {/* Google Position */}
                    {(selectedEngine === 'both' || selectedEngine === 'google') && (
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center space-x-1.5 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                          <span className={`font-black text-sm ${kw.googlePosition.position <= 3 ? 'text-emerald-400' : kw.googlePosition.page1 ? 'text-blue-400' : 'text-slate-400'}`}>
                            #{kw.googlePosition.position}
                          </span>
                          {gDiff > 0 ? (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                              <ArrowUp className="w-3 h-3" />+{gDiff}
                            </span>
                          ) : gDiff < 0 ? (
                            <span className="text-[10px] text-rose-400 font-bold flex items-center">
                              <ArrowDown className="w-3 h-3" />{gDiff}
                            </span>
                          ) : (
                            <Minus className="w-3 h-3 text-slate-500" />
                          )}
                        </div>
                      </td>
                    )}

                    {/* Bing Position */}
                    {(selectedEngine === 'both' || selectedEngine === 'bing') && (
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center space-x-1.5 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                          <span className={`font-black text-sm ${kw.bingPosition.position <= 3 ? 'text-emerald-400' : kw.bingPosition.page1 ? 'text-indigo-400' : 'text-slate-400'}`}>
                            #{kw.bingPosition.position}
                          </span>
                          {bDiff > 0 ? (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                              <ArrowUp className="w-3 h-3" />+{bDiff}
                            </span>
                          ) : bDiff < 0 ? (
                            <span className="text-[10px] text-rose-400 font-bold flex items-center">
                              <ArrowDown className="w-3 h-3" />{bDiff}
                            </span>
                          ) : (
                            <Minus className="w-3 h-3 text-slate-500" />
                          )}
                        </div>
                      </td>
                    )}

                    {/* SERP Features */}
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {kw.googlePosition.serpFeatures.length > 0 ? (
                          kw.googlePosition.serpFeatures.map((feat) => (
                            <span key={feat} className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-medium">
                              {feat}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-500">Standard Organic</span>
                        )}
                      </div>
                    </td>

                    {/* Target URL */}
                    <td className="px-6 py-4 text-right">
                      <a
                        href={kw.googlePosition.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-400 hover:underline truncate max-w-[160px] inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {kw.googlePosition.url.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Keyword Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>Track New Search Engine Keyword</span>
            </h3>

            <form onSubmit={handleCreateKeyword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. online prescription renewal telehealth"
                  value={newKwText}
                  onChange={(e) => setNewKwText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Est. Search Volume</label>
                  <input
                    type="number"
                    value={newKwVolume}
                    onChange={(e) => setNewKwVolume(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Difficulty %</label>
                  <input
                    type="number"
                    value={newKwDifficulty}
                    onChange={(e) => setNewKwDifficulty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Search Intent</label>
                <select
                  value={newKwIntent}
                  onChange={(e) => setNewKwIntent(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Transactional">Transactional (High Conversion)</option>
                  <option value="Commercial">Commercial (Investigation)</option>
                  <option value="Informational">Informational (Guides/Blog)</option>
                  <option value="Navigational">Navigational (Brand Search)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20"
                >
                  Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
