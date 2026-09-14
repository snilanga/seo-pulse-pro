import React, { useState, useEffect } from 'react';
import type { LocalBusinessReport } from '../../types/seo';
import { runLocalBusinessCheck } from '../../services/localSeoService';
import { dbService } from '../../services/dbService';
import { 
  MapPin, 
  Search, 
  Star, 
  Globe, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  TrendingUp, 
  ShieldCheck, 
  Copy, 
  Check, 
  Database,
  Trash2,
  Clock,
  Flame,
  Award
} from 'lucide-react';


interface GoogleMapsLocalRankerProps {
  initialBusinessName?: string;
  initialDomain?: string;
  initialCity?: string;
}

export const GoogleMapsLocalRanker: React.FC<GoogleMapsLocalRankerProps> = ({
  initialBusinessName = '',
  initialDomain = '',
  initialCity = ''
}) => {
  // Input states
  const [businessName, setBusinessName] = useState<string>(initialBusinessName || 'Apex Health Solutions');
  const [websiteUrl, setWebsiteUrl] = useState<string>(initialDomain ? `https://${initialDomain}` : 'https://apexhealthsolutions.com');
  const [city, setCity] = useState<string>(initialCity || 'Colombo');
  const [country, setCountry] = useState<string>('Sri Lanka');
  const [keyword, setKeyword] = useState<string>('Telemedicine & Primary Clinic');

  // Loading & Results
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<LocalBusinessReport | null>(null);
  const [savedHistory, setSavedHistory] = useState<LocalBusinessReport[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'reviews' | 'competitors' | 'gbp-audit' | 'action-plan'>('overview');

  // Load history from dbService on mount
  useEffect(() => {
    const history = dbService.getSavedLocalBusinessReports();
    setSavedHistory(history);
    if (history.length > 0 && !currentReport) {
      setCurrentReport(history[0]);
      setBusinessName(history[0].businessName);
      setCity(history[0].city);
      setWebsiteUrl(history[0].websiteUrl);
      setKeyword(history[0].targetKeyword);
    }
  }, []);

  const handleRunScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!businessName.trim()) return;

    setIsScanning(true);
    try {
      const result = await runLocalBusinessCheck({
        businessName,
        websiteUrl,
        city,
        country,
        keyword
      });

      setCurrentReport(result);
      // Save directly to persistent database
      dbService.saveLocalBusinessReport(result);
      setSavedHistory(dbService.getSavedLocalBusinessReports());
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dbService.deleteLocalBusinessReport(id);
    const updated = dbService.getSavedLocalBusinessReports();
    setSavedHistory(updated);
    if (currentReport?.id === id) {
      setCurrentReport(updated.length > 0 ? updated[0] : null);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Google Maps & Local Business Rank Checker</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LOCAL 3-PACK & REVIEWS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verify any business address, verified website, Google review stars, total reviews count, and exact Google Page # rank
            </p>
          </div>
        </div>

        {/* Database Sync Status Badge */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Auto-Saved to Database ({savedHistory.length} checked)</span>
        </div>
      </div>

      {/* Main Search & Input Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
        <form onSubmit={handleRunScan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Business Name */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Business Name *</span>
                <span className="text-[10px] text-slate-500">Google Listing Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Health Solutions"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Target City & Country */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Target City & Country *</span>
                <span className="text-[10px] text-slate-500">Geo Location</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Colombo"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Sri Lanka"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Target Keyword / Service */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Target Search Keyword *</span>
                <span className="text-[10px] text-slate-500">What users search</span>
              </label>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Telemedicine Clinic"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Submit */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isScanning}
                className="w-full h-[41px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check Maps & Rank</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Website URL Optional Input */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400 shrink-0 flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Website URL:</span>
            </span>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. https://apexhealthsolutions.com"
              className="flex-1 max-w-lg bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Used to match GBP listing with verified domain
            </span>
          </div>
        </form>

        {/* Quick History Pills */}
        {savedHistory.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium shrink-0 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Saved Businesses:</span>
            </span>
            {savedHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentReport(item);
                  setBusinessName(item.businessName);
                  setCity(item.city);
                  setCountry(item.country);
                  setKeyword(item.targetKeyword);
                  setWebsiteUrl(item.websiteUrl);
                }}
                className={`group flex items-center space-x-2 px-3 py-1 rounded-lg text-xs cursor-pointer border transition shrink-0 ${
                  currentReport?.id === item.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span>{item.businessName}</span>
                <span className="text-[10px] text-amber-400 flex items-center">
                  <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                  {item.rating} ({item.totalReviews})
                </span>
                <button
                  onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                  title="Remove from saved database"
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Dashboard Results */}
      {currentReport && (
        <div className="space-y-6">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Address & Physical Location */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Physical Address</span>
                </span>
                <button 
                  onClick={() => copyText(currentReport.formattedAddress, 'addr')}
                  className="hover:text-white"
                  title="Copy address"
                >
                  {copiedKey === 'addr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-sm font-bold text-white line-clamp-2">
                {currentReport.formattedAddress}
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentReport.phone}</span>
              </div>
            </div>

            {/* KPI 2: Review Stars & Total Volume */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Google Reviews</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  {currentReport.reviewSentiment.positivePercent}% Positive
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-amber-400">{currentReport.rating}</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(currentReport.rating) ? 'fill-amber-400' : 'text-slate-600'}`} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  ({currentReport.totalReviews} total)
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Sentiment: High trust & active local customer citations
              </div>
            </div>

            {/* KPI 3: Google Maps Rank & Local 3-Pack */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Google Maps Rank</span>
                </span>
                {currentReport.isLocalPack ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    TOP 3 LOCAL PACK
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    OUTSIDE PACK
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white">#{currentReport.googleMapsPosition}</span>
                <span className="text-xs text-slate-400">in {currentReport.city} Maps</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Keyword: <span className="text-indigo-300 font-medium">"{currentReport.targetKeyword}"</span>
              </div>
            </div>

            {/* KPI 4: Google Organic SERP Page # */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Google Search Rank</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentReport.googlePageNumber === 1 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  PAGE {currentReport.googlePageNumber}
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white">#{currentReport.googleOrganicPosition}</span>
                <span className="text-xs text-slate-400">
                  ({currentReport.googlePageNumber === 1 ? 'Page 1 Result' : `Page ${currentReport.googlePageNumber} Result`})
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Bing Rank: #{currentReport.bingPosition}</span>
                <a
                  href={currentReport.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <span>Visit Web</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Interactive Sub-Navigation */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
            {[
              { id: 'overview', label: 'Local Business & Map View', icon: MapPin },
              { id: 'reviews', label: 'Reviews & Customer Feedback', icon: Star },
              { id: 'competitors', label: 'Local Competitors in City', icon: Award },
              { id: 'gbp-audit', label: 'Google Business Profile Audit', icon: ShieldCheck },
              { id: 'action-plan', label: 'Local Rank Action Plan', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Overview & Map View */}
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Business Card & Verification Details */}
              <div className="lg:col-span-6 space-y-4">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{currentReport.businessName}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </h3>
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">
                        {currentReport.gbpStatus.primaryCategory} • {currentReport.city}, {currentReport.country}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      GBP Score: {currentReport.gbpScore}/100
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Exact Address:</span>
                      <span className="text-white font-medium text-right">{currentReport.formattedAddress}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Phone Number:</span>
                      <span className="text-white font-medium">{currentReport.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Official Website:</span>
                      <a href={currentReport.websiteUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center space-x-1">
                        <span>{currentReport.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">SSL Security:</span>
                      <span className={`font-semibold ${currentReport.hasSsl ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {currentReport.hasSsl ? 'Verified HTTPS' : 'Insecure HTTP'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Google Maps Coordinate:</span>
                      <span className="text-slate-300 font-mono text-[11px]">{currentReport.latitude}, {currentReport.longitude}</span>
                    </div>
                  </div>

                  {/* Direct Link to Google Search & Maps */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentReport.businessName} ${currentReport.city}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition border border-slate-700"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Open on Google Maps</span>
                    </a>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(`${currentReport.targetKeyword} ${currentReport.city}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition border border-indigo-500/30"
                    >
                      <Search className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Live Google SERP</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Map Simulation & Ranking Diagnostic */}
              <div className="lg:col-span-6 space-y-4">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Google Local 3-Pack Status</span>
                    </h3>

                    {currentReport.isLocalPack ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Ranked #{currentReport.googleMapsPosition} in Google Local 3-Pack</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Congratulations! Your business currently enjoys prime visibility on Google Search and Maps when users search for "{currentReport.targetKeyword}" in {currentReport.city}.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
                          <Flame className="w-5 h-5 text-amber-400" />
                          <span>Currently Outside Google Local 3-Pack (Rank #{currentReport.googleMapsPosition})</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Your business appears on Google Maps Page 2 or extended listing. You need approximately <strong className="text-amber-300">{currentReport.competitorGap.reviewsNeededForTop3} more 5-star reviews</strong> and NAP citation consistency to break into the Top 3 Local Pack.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Visual Map Pin representation */}
                  <div className="h-44 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
                    
                    {/* Simulated Radar Ring */}
                    <div className="absolute w-28 h-28 rounded-full border border-emerald-500/30 animate-ping" />
                    
                    {/* Center Pin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full text-white shadow-xl shadow-emerald-500/40 border-2 border-white">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="mt-2 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 text-white border border-slate-700 shadow-lg">
                        {currentReport.businessName} (Rank #{currentReport.googleMapsPosition})
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        {currentReport.city}, {currentReport.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Reviews & Sentiment */}
          {activeSubTab === 'reviews' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-amber-400">{currentReport.rating}</span>
                  <div className="flex items-center text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(currentReport.rating) ? 'fill-amber-400' : 'text-slate-600'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">Based on {currentReport.totalReviews} verified Google reviews</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 md:col-span-2 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Review Sentiment Distribution</h4>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                        <span>Positive (5 & 4 Stars)</span>
                        <span className="text-emerald-400 font-bold">{currentReport.reviewSentiment.positivePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentReport.reviewSentiment.positivePercent}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                        <span>Neutral (3 Stars)</span>
                        <span className="text-amber-400 font-bold">{currentReport.reviewSentiment.neutralPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${currentReport.reviewSentiment.neutralPercent}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                        <span>Critical (1 & 2 Stars)</span>
                        <span className="text-rose-400 font-bold">{currentReport.reviewSentiment.negativePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${currentReport.reviewSentiment.negativePercent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Reviews Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recent Google Customer Reviews</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentReport.sampleReviews.map((rev, idx) => (
                    <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-2 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white">{rev.author}</span>
                          <span className="text-[10px] text-slate-500">{rev.timeAgo}</span>
                        </div>
                        <div className="flex items-center text-amber-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                          ))}
                        </div>
                        <p className="text-slate-300 italic text-[11px] leading-relaxed">
                          "{rev.text}"
                        </p>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Google Review</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Competitors in City */}
          {activeSubTab === 'competitors' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Top Local Competitors for "{currentReport.targetKeyword}" in {currentReport.city}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Compare review volume, star ratings, and exact Google rank positions</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Gap: {currentReport.competitorGap.reviewsNeededForTop3} Reviews needed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 font-semibold">Rank</th>
                        <th className="pb-2 font-semibold">Business Name</th>
                        <th className="pb-2 font-semibold">Address</th>
                        <th className="pb-2 font-semibold">Google Stars</th>
                        <th className="pb-2 font-semibold">Reviews Count</th>
                        <th className="pb-2 font-semibold">Google Page #</th>
                        <th className="pb-2 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {/* Current Business Row */}
                      <tr className="bg-emerald-500/10 text-white font-medium">
                        <td className="py-3 px-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                            #{currentReport.googleMapsPosition} (You)
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-emerald-300">{currentReport.businessName}</div>
                          <div className="text-[10px] text-slate-400">{currentReport.websiteUrl}</div>
                        </td>
                        <td className="py-3 text-slate-300 max-w-xs truncate">{currentReport.formattedAddress}</td>
                        <td className="py-3 text-amber-400 font-bold">{currentReport.rating} ★</td>
                        <td className="py-3 text-white font-bold">{currentReport.totalReviews}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            Page {currentReport.googlePageNumber}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-[10px] text-emerald-400 font-bold">Current Target</span>
                        </td>
                      </tr>

                      {/* Competitor Rows */}
                      {currentReport.competitorGap.topCompetitors.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 text-slate-300">
                          <td className="py-3 px-1 font-bold text-slate-400">
                            #{comp.mapRank}
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-white">{comp.name}</div>
                            <div className="text-[10px] text-slate-500">{comp.website}</div>
                          </td>
                          <td className="py-3 text-slate-400">{comp.address}</td>
                          <td className="py-3 text-amber-400 font-semibold">{comp.rating} ★</td>
                          <td className="py-3 text-white font-semibold">{comp.reviewCount}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                              Page {comp.googlePageNumber}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <a
                              href={comp.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:underline flex items-center justify-end space-x-1 text-[11px]"
                            >
                              <span>Inspect</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: GBP Audit */}
          {activeSubTab === 'gbp-audit' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Google Business Profile (GBP) Audit & Optimization Checklist</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Key signals analyzed by Google's Local Map Pack ranking algorithm</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{currentReport.gbpScore}/100</span>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Optimization Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                {[
                  { label: 'Claimed & Verified Listing', status: currentReport.gbpStatus.isClaimed, note: 'Ownership confirmed with Google verification pin' },
                  { label: 'Accurate Business Hours & Holidays', status: currentReport.gbpStatus.hasHours, note: 'Open hours match physical office schedule' },
                  { label: `High-Res Photos Uploaded (${currentReport.gbpStatus.photoCount} photos)`, status: currentReport.gbpStatus.hasPhotos, note: 'Interior, exterior, and team photos uploaded' },
                  { label: `Primary Category: "${currentReport.gbpStatus.primaryCategory}"`, status: currentReport.gbpStatus.hasCategory, note: 'Aligned with high-intent commercial keywords' },
                  { label: 'Google Q&A Pre-Populated', status: currentReport.gbpStatus.hasQnA, note: 'Customer FAQs answered directly on the profile' },
                  { label: 'Weekly Google Profile Posts Active', status: currentReport.gbpStatus.regularPosts, note: 'Fresh offers and company updates posted monthly' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                    {item.status ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Local Rank Action Plan */}
          {activeSubTab === 'action-plan' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Action Plan to Rank #{currentReport.isLocalPack ? '1' : '3 or Higher'} in {currentReport.city} Maps</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Priority steps to push Page 2 rankings directly into Page 1 and the Local 3-Pack</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {currentReport.actionPlan.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          step.priority === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {step.priority} Priority
                        </span>
                        <span className="text-xs font-bold text-white">{step.action}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        <strong className="text-slate-300">Expected Result:</strong> {step.expectedImpact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
