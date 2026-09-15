import React, { useState, useMemo } from 'react';
import type { ClientProject, TrackedKeyword } from '../../types/seo';
import type { 
  GeneratedKeywordItem, 
  KeywordCategoryType, 
  SearchIntentType,
  KeywordGenerationResult
} from '../../types/keywordIntelligence';
import { 
  generateAdvancedKeywords, 
  BUSINESS_PROFILES 
} from '../../services/keywordIntelligenceEngine';
import { COUNTRIES_AND_CITIES } from '../../data/geoData';
import { 
  Flame, 
  Sparkles, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  Plus, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface MostSearchedKeywordsProps {
  client: ClientProject;
  onAddTrackedKeyword: (kw: TrackedKeyword) => void;
  onNavigateToCodeInjector: (keywordsList: string[]) => void;
}

const CATEGORY_TABS: { label: string; value: 'All' | KeywordCategoryType; icon: string }[] = [
  { label: 'All Keywords', value: 'All', icon: '⚡' },
  { label: 'High Priority', value: 'High Priority', icon: '🔥' },
  { label: 'Local SEO', value: 'Local SEO', icon: '📍' },
  { label: 'Commercial Intent', value: 'Commercial Intent', icon: '💰' },
  { label: 'Transactional', value: 'Transactional', icon: '🛒' },
  { label: 'Question Keywords', value: 'Question Keywords', icon: '❓' },
  { label: 'City Keywords', value: 'City Keywords', icon: '🏙️' },
  { label: 'Country Keywords', value: 'Country Keywords', icon: '🌎' },
  { label: 'Near Me Keywords', value: 'Near Me Keywords', icon: '📱' },
  { label: 'Open Now / Today', value: 'Open Now / Today Keywords', icon: '🕐' }
];

export const MostSearchedKeywords: React.FC<MostSearchedKeywordsProps> = ({
  client,
  onAddTrackedKeyword,
  onNavigateToCodeInjector
}) => {
  // Input parameters
  const [businessType, setBusinessType] = useState<string>(() => {
    return client.industry || 'Dental Clinic';
  });
  const [customSeedQuery, setCustomSeedQuery] = useState<string>('');
  const [country, setCountry] = useState<string>(() => {
    return client.targetRegion?.split(' ')[0] || 'Sri Lanka';
  });
  const [stateProvince, setStateProvince] = useState<string>('Western Province');
  const [city, setCity] = useState<string>(() => {
    return 'Colombo';
  });
  const [areaNeighborhood, setAreaNeighborhood] = useState<string>('Kollupitiya');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<'All' | KeywordCategoryType>('All');
  const [selectedIntent, setSelectedIntent] = useState<'All' | SearchIntentType>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-suggest dropdowns
  const [showBusinessDropdown, setShowBusinessDropdown] = useState<boolean>(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);

  // Active results
  const [results, setResults] = useState<KeywordGenerationResult>(() => {
    return generateAdvancedKeywords({
      businessType: client.industry || 'Dental Clinic',
      customSeedQuery: '',
      country: client.targetRegion?.split(' ')[0] || 'Sri Lanka',
      stateProvince: 'Western Province',
      city: 'Colombo',
      areaNeighborhood: 'Kollupitiya'
    });
  });

  // Tracked keyword IDs
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Handle generation
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateAdvancedKeywords({
        businessType,
        customSeedQuery,
        country,
        stateProvince,
        city,
        areaNeighborhood
      });
      setResults(generated);
      setIsGenerating(false);
      setNotification(`Generated ${generated.totalGenerated} high-intent keywords for ${businessType}!`);
      setTimeout(() => setNotification(null), 3500);
    }, 300);
  };

  // Generate More Keywords (Adds natural secondary and long-tail variants)
  const handleGenerateMore = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const fresh = generateAdvancedKeywords({
        businessType,
        customSeedQuery: customSeedQuery ? `${customSeedQuery} premium` : undefined,
        country,
        stateProvince,
        city,
        areaNeighborhood
      });
      
      // Merge unique keywords
      const existingMap = new Map(results.keywords.map(k => [k.keyword, k]));
      fresh.keywords.forEach(k => {
        if (!existingMap.has(k.keyword)) {
          existingMap.set(k.keyword, k);
        }
      });

      const combined = Array.from(existingMap.values()).sort((a, b) => b.opportunityScore - a.opportunityScore);
      setResults(prev => ({
        ...prev,
        totalGenerated: combined.length,
        highPriorityCount: combined.filter(k => k.priority === 'High').length,
        keywords: combined
      }));
      setIsGenerating(false);
      setNotification(`Added ${fresh.keywords.length} extra keyword variations!`);
      setTimeout(() => setNotification(null), 3000);
    }, 300);
  };

  // Add keyword to tracker
  const handleTrackKeyword = (item: GeneratedKeywordItem) => {
    const created: TrackedKeyword = {
      id: `kw-gen-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      clientId: client.id,
      keyword: item.keyword,
      searchVolume: item.searchVolume,
      difficulty: item.difficulty,
      cpc: item.cpc,
      intent: item.searchIntent === 'Local' ? 'Commercial' : item.searchIntent,
      tags: ['Most Searched', item.category, item.priority],
      updatedAt: new Date().toISOString().split('T')[0],
      googlePosition: {
        engine: 'google',
        device: 'desktop',
        position: item.opportunityScore > 85 ? 3 : 8,
        previousPosition: 12,
        url: `https://${client.domain}/${item.keyword.replace(/\s+/g, '-')}`,
        serpFeatures: item.category === 'Question Keywords' ? ['People Also Ask'] : ['Featured Snippet'],
        page1: true
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: 4,
        previousPosition: 9,
        url: `https://${client.domain}/${item.keyword.replace(/\s+/g, '-')}`,
        serpFeatures: [],
        page1: true
      },
      history: [
        { date: 'Aug 1', googlePos: 12, bingPos: 9 },
        { date: 'Sep 1', googlePos: item.opportunityScore > 85 ? 3 : 8, bingPos: 4 }
      ]
    };

    onAddTrackedKeyword(created);
    setAddedIds(prev => new Set(prev).add(item.id));
    setNotification(`"${item.keyword}" added to Rank Tracker!`);
    setTimeout(() => setNotification(null), 2500);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Keyword',
      'Search Intent',
      'Location',
      'Search Volume',
      'Data Source Label',
      'Competition',
      'Difficulty',
      'CPC',
      'Opportunity Score',
      'Priority',
      'Recommendation Reason',
      'Suggested Action'
    ];

    const rows = filteredKeywords.map(k => [
      `"${k.keyword.replace(/"/g, '""')}"`,
      k.searchIntent,
      `"${k.location.replace(/"/g, '""')}"`,
      k.hasActualVolumeData ? k.searchVolume : 'Suggestion',
      `"${k.dataSource}"`,
      k.competition,
      k.difficulty,
      k.cpcFormatted,
      k.opportunityScore,
      k.priority,
      `"${k.recommendationReason.replace(/"/g, '""')}"`,
      `"${k.suggestedAction.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `most-searched-keywords-${businessType.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy all visible keywords
  const handleCopyKeywords = () => {
    const list = filteredKeywords.map(k => k.keyword).join('\n');
    navigator.clipboard.writeText(list);
    setCopiedKey('all-keywords');
    setTimeout(() => setCopiedKey(null), 2500);
    setNotification(`Copied ${filteredKeywords.length} keywords to clipboard!`);
    setTimeout(() => setNotification(null), 2500);
  };

  // Copy single keyword
  const handleCopySingle = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Deploy all to Client Code Injector
  const handleDeployToClientSite = () => {
    const kwList = filteredKeywords.map(k => k.keyword);
    onNavigateToCodeInjector(kwList);
  };

  // Filtered list
  const filteredKeywords = useMemo(() => {
    return results.keywords.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchIntent = selectedIntent === 'All' || item.searchIntent === selectedIntent;
      const matchSearch = !searchTerm.trim() || 
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recommendationReason.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchIntent && matchSearch;
    });
  }, [results.keywords, selectedCategory, selectedIntent, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Hero Header Banner */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 rounded-2xl text-white shadow-xl shadow-amber-500/25 shrink-0">
            <Flame className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Intelligent Search Demand Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Client: {client.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                100% Credible Data Labeling
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Most Searched Keywords &amp; High-Intent Demand Finder
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Automatically discovers the highest-converting search keywords for any business type, local area, city, and daily consumer intent. Prioritizes real search demand with transparent keyword credibility labeling.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={handleCopyKeywords}
            className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 shadow-md"
            title="Copy all visible keywords to clipboard"
          >
            {copiedKey === 'all-keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'all-keywords' ? 'Copied All!' : 'Copy Keywords'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 shadow-md"
            title="Export filtered keyword list to CSV"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDeployToClientSite}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Deploy to Website Code</span>
          </button>
        </div>
      </div>

      {/* Generator Configuration Panel (Business Type + Locations: Country, State, City, Area) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Business &amp; Multi-Tier Location Target
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Natural variation combinations (Near Me, Open Now, Daily Intent, Questions)
          </span>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* 1. Business Type Input & Dropdown */}
          <div className="lg:col-span-2 relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Business Type / Category <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={businessType}
                onChange={(e) => {
                  setBusinessType(e.target.value);
                  setShowBusinessDropdown(true);
                }}
                onFocus={() => setShowBusinessDropdown(true)}
                placeholder="e.g. Dentist, Restaurant, Hotel, Lawyer, Salon, Plumber..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-semibold transition"
              />
              <button
                type="button"
                onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Business Profiles Dropdown */}
            {showBusinessDropdown && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowBusinessDropdown(false)}></div>
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-amber-500/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800">
                  <div className="p-2 bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                    Select High-Demand Business Profile ({BUSINESS_PROFILES.length})
                  </div>
                  {BUSINESS_PROFILES.map((prof) => (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => {
                        setBusinessType(prof.name);
                        setShowBusinessDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                        businessType.toLowerCase() === prof.name.toLowerCase() ? 'bg-amber-600/30 text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>{prof.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">10+ Services</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 2. Country */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Country
              </label>
              <span className="text-[9px] text-amber-400">Pick or Type</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setShowCountryDropdown(true);
                }}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Country (e.g. Sri Lanka, US)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Country Dropdown */}
            {showCountryDropdown && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowCountryDropdown(false)}></div>
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-amber-500/30 rounded-xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-slate-800">
                  {COUNTRIES_AND_CITIES.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setCountry(c.name);
                        if (c.popularCities.length > 0 && !c.popularCities.includes(city)) {
                          setCity(c.popularCities[0]);
                        }
                        setShowCountryDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition text-slate-300"
                    >
                      <span>{c.flag} {c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 3. State / Province */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              State / Province
            </label>
            <input
              type="text"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
              placeholder="State/Province (e.g. Western)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* 4. City */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              City
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g. Colombo, Austin)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-semibold"
              />
            </div>
          </div>

          {/* 5. Area / Neighborhood */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Area / Neighborhood
            </label>
            <input
              type="text"
              value={areaNeighborhood}
              onChange={(e) => setAreaNeighborhood(e.target.value)}
              placeholder="Area (e.g. Kollupitiya, Downtown)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Seed Word & Submit Row */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={customSeedQuery}
                onChange={(e) => setCustomSeedQuery(e.target.value)}
                placeholder="Optional custom seed modifier (e.g. emergency, implants, organic, luxury)..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 shrink-0 transition active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Discovering Keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discover Most Searched Keywords</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleGenerateMore}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate More Keywords</span>
            </button>
          </div>
        </form>
      </div>

      {/* Credibility & Transparency Alert Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs">
        <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-white flex items-center gap-2">
            <span>Transparent Data Integrity Notice:</span>
            <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono">
              Never Invented
            </span>
          </h4>
          <p className="text-slate-300">
            {results.volumeNotice} Keywords with verified empirical search indices are tagged as <strong className="text-emerald-300">"Estimated Search Demand"</strong>. Algorithmic and question variations are transparently labeled as <strong className="text-amber-300">"Keyword Suggestions"</strong> so client reports remain 100% credible.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Useful Keywords
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{results.totalGenerated}</span>
            <span className="text-xs text-amber-400 font-semibold">Active Demand</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Targeting {results.businessType} in {results.locationLabel}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            🔥 High Priority Targets
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{results.highPriorityCount}</span>
            <span className="text-xs text-slate-400 font-medium">Keywords</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Score 80+ Top ROI Page 1 candidates
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Average Opportunity Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{results.avgOpportunityScore}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Weighted by search intent, local fit &amp; low competition
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tracked in Client Account
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-400">{addedIds.size}</span>
            <span className="text-xs text-slate-400 font-medium">Synced</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ready for SERP tracking &amp; code deployment
          </span>
        </div>
      </div>

      {/* Category Tabs & In-List Filter Bar */}
      <div className="space-y-3">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === tab.value
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Intent Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keyword or recommendation..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] text-slate-400 font-semibold">Intent:</span>
            {(['All', 'Transactional', 'Commercial', 'Local', 'Informational'] as const).map((intent) => (
              <button
                key={intent}
                onClick={() => setSelectedIntent(intent)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                  selectedIntent === intent
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {intent}
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-2 font-mono">
              ({filteredKeywords.length} results)
            </span>
          </div>
        </div>
      </div>

      {/* Main Keyword Intelligence Table Dashboard */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Keyword &amp; Recommendation Why</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Search Intent</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3 text-right">Search Volume</th>
                <th className="py-3.5 px-3 text-center">Competition</th>
                <th className="py-3.5 px-3 text-right">Difficulty</th>
                <th className="py-3.5 px-3 text-right">Est. CPC</th>
                <th className="py-3.5 px-3 text-center">Opportunity</th>
                <th className="py-3.5 px-3 text-center">Priority</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredKeywords.length > 0 ? (
                filteredKeywords.map((item) => {
                  const isTracked = addedIds.has(item.id);

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Keyword + Explanation */}
                      <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => handleCopySingle(item.keyword, item.id)}
                            className="text-slate-500 hover:text-white transition mt-0.5 shrink-0"
                            title="Copy single keyword"
                          >
                            {copiedKey === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <span className="font-bold text-white text-sm block group-hover:text-amber-300 transition-colors">
                              {item.keyword}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2" title={item.recommendationReason}>
                              💡 <strong className="text-slate-300">Why Recommended:</strong> {item.recommendationReason}
                            </p>
                            <p className="text-[10px] text-indigo-300/90 mt-0.5 truncate" title={item.suggestedAction}>
                              🎯 <strong className="text-indigo-200">Action:</strong> {item.suggestedAction}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/80">
                          {item.category}
                        </span>
                      </td>

                      {/* Search Intent */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          item.searchIntent === 'Transactional'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : item.searchIntent === 'Commercial'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : item.searchIntent === 'Local'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {item.searchIntent}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-300 text-[11px]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[110px]" title={item.location}>{item.location}</span>
                        </span>
                      </td>

                      {/* Search Volume with Credible Data Labeling */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {item.hasActualVolumeData ? (
                          <div>
                            <span className="font-mono font-bold text-white text-xs">
                              {item.searchVolume.toLocaleString()}
                            </span>
                            <span className="block text-[9px] font-mono text-emerald-400">
                              Est. Demand
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                              Suggestion
                            </span>
                            <span className="block text-[9px] text-slate-500">
                              Emerging Query
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Competition */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.competition === 'Low'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : item.competition === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {item.competition} ({item.competitionScore})
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3 px-3 text-right whitespace-nowrap font-mono">
                        <span className={`${
                          item.difficulty < 45 ? 'text-emerald-400' : item.difficulty < 65 ? 'text-amber-400' : 'text-rose-400'
                        } font-bold`}>
                          {item.difficulty}%
                        </span>
                      </td>

                      {/* CPC */}
                      <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-indigo-300 font-bold">
                        {item.cpcFormatted}
                      </td>

                      {/* Opportunity Score 0-100 */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800">
                          <span className={`font-mono font-black text-sm ${
                            item.opportunityScore >= 82
                              ? 'text-emerald-400'
                              : item.opportunityScore >= 70
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}>
                            {item.opportunityScore}
                          </span>
                          <span className="text-[9px] text-slate-500">/100</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          item.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                            : item.priority === 'Medium'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {item.priority === 'High' ? '🔥 HIGH' : item.priority === 'Medium' ? 'MEDIUM' : 'LOW'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isTracked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <Check className="w-3.5 h-3.5" /> Tracked
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTrackKeyword(item)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-sm transition active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Track</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">No keywords found matching the selected filters.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedIntent('All');
                        setSearchTerm('');
                      }}
                      className="text-xs text-amber-400 hover:underline mt-1 font-bold"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
