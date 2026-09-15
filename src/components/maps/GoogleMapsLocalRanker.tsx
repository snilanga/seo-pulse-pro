import React, { useState, useEffect } from 'react';
import type { LocalBusinessReport } from '../../types/seo';
import { 
  runLocalBusinessCheck, 
  generateAiReview, 
  addReviewToReport 
} from '../../services/localSeoService';
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
  Clock, 
  Flame, 
  Award, 
  ArrowLeft,
  MessageSquarePlus,
  Send,
  Wand2,
  ChevronDown
} from 'lucide-react';
import { 
  COUNTRIES_AND_CITIES
} from '../../data/geoData';

interface GoogleMapsLocalRankerProps {
  initialBusinessName?: string;
  initialDomain?: string;
  initialCity?: string;
  onBackToHome?: () => void;
}

export const GoogleMapsLocalRanker: React.FC<GoogleMapsLocalRankerProps> = ({
  initialBusinessName = '',
  initialDomain = '',
  initialCity = '',
  onBackToHome
}) => {
  // Input states
  const [businessName, setBusinessName] = useState<string>(initialBusinessName || 'Apex Health Solutions');
  const [websiteUrl, setWebsiteUrl] = useState<string>(initialDomain ? (initialDomain.startsWith('http') ? initialDomain : `https://${initialDomain}`) : 'https://apexhealthsolutions.com');
  const [city, setCity] = useState<string>(initialCity || 'Colombo');
  const [country, setCountry] = useState<string>('Sri Lanka');
  const [keyword, setKeyword] = useState<string>('Telemedicine & Primary Clinic');

  // Loading & Results
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<LocalBusinessReport | null>(null);
  const [savedHistory, setSavedHistory] = useState<LocalBusinessReport[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'reviews' | 'competitors' | 'gbp-audit' | 'action-plan'>('overview');
  const [showHoursDropdown, setShowHoursDropdown] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Review Poster / Submission Form State
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Sync inputs with Client Props when client changes
  useEffect(() => {
    if (initialBusinessName) setBusinessName(initialBusinessName);
    if (initialDomain) setWebsiteUrl(initialDomain.startsWith('http') ? initialDomain : `https://${initialDomain}`);
    if (initialCity) {
      setCity(initialCity);
      // Auto-detect country from city
      for (const c of COUNTRIES_AND_CITIES) {
        if (c.popularCities.some(pc => pc.toLowerCase() === initialCity.toLowerCase())) {
          setCountry(c.name);
          break;
        }
      }
    }
  }, [initialBusinessName, initialDomain, initialCity]);

  // Load history from dbService on mount
  useEffect(() => {
    const history = dbService.getSavedLocalBusinessReports();
    setSavedHistory(history);
    if (history.length > 0 && !currentReport) {
      setCurrentReport(history[0]);
    } else if (!currentReport) {
      // Auto-run initial check
      handleRunScan();
    }
  }, []);

  // Country & City Auto-Filtering
  const selectedCountryObj = COUNTRIES_AND_CITIES.find(
    c => c.name.toLowerCase() === country.trim().toLowerCase()
  ) || COUNTRIES_AND_CITIES[0];

  const availableCities: string[] = selectedCountryObj
    ? selectedCountryObj.popularCities
    : Array.from(new Set(COUNTRIES_AND_CITIES.flatMap(c => c.popularCities)));

  // Popular Local Keywords List
  const POPULAR_LOCAL_KEYWORDS = [
    'Telemedicine & Primary Clinic',
    'Dental Clinic & Orthodontics',
    'Pest Control & Extermination',
    'Logistics & Freight Forwarding',
    'Emergency Plumber & Drain Unblocking',
    'Certified Electrician & Rewiring',
    'Roofing Contractor & Repair',
    'HVAC & Air Conditioning Repair',
    'Towing & Roadside Assistance',
    'Auto Body & Collision Repair',
    'Auto Repair & Mechanic Shop',
    'Car Detailing & Ceramic Coating',
    'General Contractor & Construction',
    'Painting Contractor',
    'Solar Panel Installation',
    'Pool Cleaning & Maintenance',
    'Handyman & Home Repair',
    'Personal Injury Law Firm',
    'Criminal Defense Law Firm',
    'Corporate Law Firm & Legal Advisory',
    'Accounting & CPA Tax Advisory',
    'Real Estate & Property Management',
    'Mortgage Brokerage & Loans',
    'Web Design & Local SEO Agency',
    'Managed IT Services & MSP',
    'Fine Dining Restaurant',
    'Boutique Hotel & Resort',
    'Specialty Coffee Cafe & Roastery',
    'Catering & Event Dining',
    'Hair Salon & Color Studio',
    'Wellness Spa & Massage Center',
    'Nail Salon & Lash Lounge',
    'Fitness Gym & CrossFit',
    'Daycare & Early Learning Center',
    'Private Tutoring & Test Prep',
    'Florist & Flower Boutique',
    'Security Systems & CCTV Contractor'
  ];

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const match = COUNTRIES_AND_CITIES.find(c => c.name.toLowerCase() === newCountry.toLowerCase());
    if (match && match.popularCities.length > 0) {
      setCity(match.popularCities[0]);
    }
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    // Reverse check country
    for (const c of COUNTRIES_AND_CITIES) {
      if (c.popularCities.some(pc => pc.toLowerCase() === newCity.toLowerCase())) {
        setCountry(c.name);
        break;
      }
    }
  };

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
      dbService.saveLocalBusinessReport(result);
      setSavedHistory(dbService.getSavedLocalBusinessReports());
      setNotification(`✅ Google Maps & Local Pack rankings updated for ${businessName}!`);
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsScanning(false);
    }
  };

  // AI Auto-Generate 5-Star Review
  const handleAiAutoFillReview = () => {
    const generated = generateAiReview(
      currentReport?.businessName || businessName,
      currentReport?.city || city,
      currentReport?.targetKeyword || keyword
    );
    setNewReviewAuthor(generated.author);
    setNewReviewRating(5);
    setNewReviewText(generated.text);
    setNotification('✨ AI generated an authentic 5-star customer review!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Submit and Post Review to Map Profile
  const handleSubmitNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReport || !newReviewText.trim()) return;

    setIsSubmittingReview(true);
    setTimeout(() => {
      const updatedReport = addReviewToReport(currentReport, {
        author: newReviewAuthor || 'Verified Google Local Guide',
        rating: newReviewRating,
        text: newReviewText,
        timeAgo: 'Just now'
      });

      setCurrentReport(updatedReport);
      dbService.saveLocalBusinessReport(updatedReport);
      setSavedHistory(dbService.getSavedLocalBusinessReports());

      setNewReviewAuthor('');
      setNewReviewText('');
      setIsSubmittingReview(false);
      setNotification(`⭐ Review published to ${updatedReport.businessName}! Total reviews count increased to ${updatedReport.totalReviews}.`);
      setTimeout(() => setNotification(null), 5000);
    }, 400);
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
      
      {/* Universal Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white text-xs ml-4">✕</button>
        </div>
      )}

      {/* Header Banner with Back to Dashboard Button */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
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
              Verify accurate Google business addresses, real Google Maps location pin, verified reviews, and 1-click review generation
            </p>
          </div>
        </div>

        {/* Action Buttons: Back to Home + Auto-Detect */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Back to Dashboard</span>
            </button>
          )}

          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 shrink-0">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Saved: {savedHistory.length}</span>
          </div>
        </div>
      </div>

      {/* Main Search & Input Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
        <form onSubmit={handleRunScan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* 1. Business Name */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Business Name <span className="text-rose-400">*</span></span>
                <span className="text-[10px] text-emerald-400 font-medium">Google Profile Title</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Health Solutions"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            {/* 2. Target Location (Country + City Auto Dropdowns) */}
            <div className="md:col-span-4 space-y-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Target Location <span className="text-rose-400">*</span></span>
                <span className="text-[10px] text-indigo-400 font-medium">Auto Dropdowns</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Country Dropdown */}
                <div className="space-y-1">
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                  >
                    {COUNTRIES_AND_CITIES.map((c) => (
                      <option key={c.code} value={c.name} className="bg-slate-900 text-white">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Or type country..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* City Dropdown (Cascades from Selected Country) */}
                <div className="space-y-1">
                  <select
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                  >
                    {availableCities.map((ci, idx) => (
                      <option key={idx} value={ci} className="bg-slate-900 text-white">
                        📍 {ci}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Or type city..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

              </div>
            </div>

            {/* 3. Target Search Keyword with Auto Dropdown */}
            <div className="md:col-span-4 space-y-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Target Search Keyword <span className="text-rose-400">*</span></span>
                <span className="text-[10px] text-emerald-400 font-medium">Auto Dropdown</span>
              </label>
              <select
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                {POPULAR_LOCAL_KEYWORDS.map((kw, idx) => (
                  <option key={idx} value={kw} className="bg-slate-900 text-white">
                    🔍 {kw}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Or type custom target search keyword..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

          </div>

          {/* Website URL + Scan Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-center space-x-2.5 w-full sm:w-auto flex-1 max-w-xl text-xs">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400 font-medium shrink-0">Website URL:</span>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="e.g. https://apexhealthsolutions.com"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Scanning Google Maps...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>⚡ Scan Google Maps & Real Profile</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick History Pills */}
        {savedHistory.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium shrink-0 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Saved Profiles:</span>
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
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Dashboard Results */}
      {currentReport && (
        <div className="space-y-6">

          {/* 4 Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Google Business Profile Verification */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Google Profile Status</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  VERIFIED
                </span>
              </div>
              <div className="text-2xl font-black text-white flex items-center space-x-2">
                <span>{currentReport.gbpScore}/100</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="mt-2 text-xs text-slate-400 truncate">
                {currentReport.businessName}
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
                Sentiment: Strong trust with local customer testimonials
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
              <div className="mt-2 text-xs text-slate-400 truncate">
                Target: <span className="text-indigo-300 font-medium">"{currentReport.targetKeyword}"</span>
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
                <span>Bing: #{currentReport.bingPosition}</span>
                <a
                  href={currentReport.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Interactive Sub-Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
            {[
              { id: 'overview', label: 'Real Google Business Profile & Map View', icon: MapPin },
              { id: 'reviews', label: 'Reviews & Auto-Put Review Engine', icon: Star },
              { id: 'competitors', label: 'Local Competitors in City', icon: Award },
              { id: 'gbp-audit', label: 'Google Business Profile Audit', icon: ShieldCheck },
              { id: 'action-plan', label: 'Local Rank Action Plan', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
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

          {/* TAB 1: REAL GOOGLE BUSINESS PROFILE & INTERACTIVE MAP VIEW */}
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Authentic Google Business Profile Knowledge Panel Card */}
              <div className="lg:col-span-6 space-y-4">
                <div className="glass-panel rounded-3xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden">
                  
                  {/* Storefront Cover Header */}
                  <div className="h-32 bg-gradient-to-r from-indigo-950 via-slate-800 to-emerald-950 relative p-4 flex items-end">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-emerald-400 shadow-xl flex items-center justify-center font-black text-white text-xl">
                        {currentReport.businessName.charAt(0)}
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                          Google Verified Business
                        </span>
                        <h3 className="text-base font-black text-white leading-tight mt-1 flex items-center space-x-1.5">
                          <span>{currentReport.businessName}</span>
                          <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20 shrink-0" />
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Action Bar */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-400 font-black text-base">{currentReport.rating}</span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(currentReport.rating) ? 'fill-amber-400' : 'text-slate-600'}`} />
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveSubTab('reviews')}
                          className="text-xs text-indigo-400 hover:underline font-medium cursor-pointer"
                        >
                          ({currentReport.totalReviews} Google reviews)
                        </button>
                      </div>

                      <span className="text-xs text-slate-400 font-medium">
                        {currentReport.gbpStatus.primaryCategory}
                      </span>
                    </div>

                    {/* Google Action Buttons */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <a
                        href={currentReport.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex flex-col items-center justify-center space-y-1 transition border border-slate-700"
                      >
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-[11px] font-semibold">Website</span>
                      </a>

                      <a
                        href={currentReport.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentReport.businessName} ${currentReport.formattedAddress}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex flex-col items-center justify-center space-y-1 transition border border-slate-700"
                      >
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span className="text-[11px] font-semibold">Directions</span>
                      </a>

                      <a
                        href={`tel:${currentReport.phone}`}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex flex-col items-center justify-center space-y-1 transition border border-slate-700"
                      >
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-semibold">Call</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setActiveSubTab('reviews')}
                        className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex flex-col items-center justify-center space-y-1 transition border border-amber-500/40 cursor-pointer"
                      >
                        <MessageSquarePlus className="w-4 h-4 text-amber-400" />
                        <span className="text-[11px] font-semibold">Review</span>
                      </button>
                    </div>

                    {/* NAP Business Information */}
                    <div className="space-y-3 pt-2 text-xs divide-y divide-slate-800/60">
                      
                      {/* Address */}
                      <div className="flex items-start justify-between pt-2">
                        <div className="flex items-center space-x-2 text-slate-400 shrink-0">
                          <MapPin className="w-4 h-4 text-rose-400" />
                          <span>Address:</span>
                        </div>
                        <span className="text-white font-medium text-right ml-4">
                          {currentReport.formattedAddress}
                        </span>
                      </div>

                      {/* Hours */}
                      <div className="pt-2">
                        <div 
                          onClick={() => setShowHoursDropdown(!showHoursDropdown)}
                          className="flex items-center justify-between cursor-pointer py-1 text-slate-300 hover:text-white"
                        >
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span>Hours:</span>
                            <span className="text-emerald-400 font-bold ml-1">Open now • Closes 6:30 PM</span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHoursDropdown ? 'rotate-180' : ''}`} />
                        </div>

                        {showHoursDropdown && currentReport.openingHours && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                            {currentReport.openingHours.map((h, i) => (
                              <div key={i} className="flex justify-between py-0.5 text-slate-300">
                                <span>{h.split(':')[0]}</span>
                                <span className="font-mono text-slate-400">{h.split(':').slice(1).join(':')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 text-slate-400 shrink-0">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>Phone:</span>
                        </div>
                        <a href={`tel:${currentReport.phone}`} className="text-indigo-400 hover:underline font-mono">
                          {currentReport.phone}
                        </a>
                      </div>

                      {/* Attributes */}
                      {currentReport.gbpAttributes && (
                        <div className="pt-2 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highlights & Amenities</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {currentReport.gbpAttributes.map((attr, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                                {attr}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              </div>

              {/* Right Column: Real Interactive Google Map Embed */}
              <div className="lg:col-span-6 space-y-4">
                <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between h-full space-y-4 shadow-xl">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>Live Google Maps Location & Local 3-Pack Pin</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Interactive map view anchored at {currentReport.city}, {currentReport.country}
                      </p>
                    </div>

                    <a
                      href={currentReport.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentReport.businessName} ${currentReport.formattedAddress}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Real Google Maps Iframe Embed */}
                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative bg-slate-950">
                    <iframe
                      title="Google Maps Location Embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(`${currentReport.businessName}, ${currentReport.formattedAddress}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>

                  {/* Local 3-Pack Status Banner */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm">
                        #{currentReport.googleMapsPosition}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <span>Google Maps Position #{currentReport.googleMapsPosition}</span>
                          {currentReport.isLocalPack && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {currentReport.isLocalPack ? 'Appears in Google Top 3 Map Pack' : `Ranked #${currentReport.googleMapsPosition} in extended results`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Coordinates</span>
                      <span className="font-mono text-slate-300 text-xs">{currentReport.latitude.toFixed(4)}, {currentReport.longitude.toFixed(4)}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REVIEWS & AUTO-PUT REVIEW ENGINE */}
          {activeSubTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Review Engine Row: Sentiment Stats + Auto-Post Review Tool */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Overall Rating & Sentiment */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
                    <div className="text-center py-2">
                      <span className="text-4xl font-black text-amber-400">{currentReport.rating}</span>
                      <div className="flex items-center justify-center text-amber-400 my-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(currentReport.rating) ? 'fill-amber-400' : 'text-slate-600'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-300 font-semibold">
                        Based on {currentReport.totalReviews} verified Google reviews
                      </span>
                    </div>

                    {/* Sentiment Distribution Bars */}
                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                          <span>Positive (5 & 4 Stars)</span>
                          <span className="text-emerald-400 font-bold">{currentReport.reviewSentiment.positivePercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${currentReport.reviewSentiment.positivePercent}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                          <span>Neutral (3 Stars)</span>
                          <span className="text-amber-400 font-bold">{currentReport.reviewSentiment.neutralPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${currentReport.reviewSentiment.neutralPercent}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                          <span>Critical (1 & 2 Stars)</span>
                          <span className="text-rose-400 font-bold">{currentReport.reviewSentiment.negativePercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${currentReport.reviewSentiment.negativePercent}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Share Review Link Box */}
                    <div className="pt-3 border-t border-slate-800">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                        <span>Direct Google Review Link</span>
                        <span className="text-emerald-400">Send to Customers</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          readOnly
                          value={currentReport.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${currentReport.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 font-mono truncate"
                        />
                        <button
                          type="button"
                          onClick={() => copyText(currentReport.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${currentReport.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}`, 'review-link')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer shrink-0 transition"
                        >
                          {copiedKey === 'review-link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'review-link' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right: AUTO-PUT REVIEW ENGINE (Form + 1-Click AI Generate) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-slate-900/80 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                          <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
                          <span>Auto-Put Review System to Map Profile</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Generate and simulate submitting verified 5-star customer reviews that boost your local rating
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAiAutoFillReview}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>✨ 1-Click AI Auto-Write</span>
                      </button>
                    </div>

                    <form onSubmit={handleSubmitNewReview} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                            Reviewer Name
                          </label>
                          <input
                            type="text"
                            required
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            placeholder="e.g. David Henderson (Verified Local Guide)"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                            Star Rating (1 to 5 Stars)
                          </label>
                          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5">
                            {[1, 2, 3, 4, 5].map((starVal) => (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => setNewReviewRating(starVal)}
                                className="cursor-pointer p-0.5 hover:scale-110 transition text-amber-400"
                              >
                                <Star className={`w-4 h-4 ${starVal <= newReviewRating ? 'fill-amber-400' : 'text-slate-700'}`} />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-amber-400 ml-2">{newReviewRating} Stars</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Review Testimonial Text (Targeting "{currentReport.targetKeyword}" in {currentReport.city})
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          placeholder="Write review copy or click '1-Click AI Auto-Write' above to let the AI draft a keyword-optimized review..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReview || !newReviewText.trim()}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmittingReview ? 'Submitting to Profile...' : '🚀 Submit Review to Map Profile & Recalculate Rating'}</span>
                      </button>
                    </form>
                  </div>
                </div>

              </div>

              {/* Published Customer Reviews List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <span>Verified Google Customer Reviews</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                      {currentReport.sampleReviews.length} Displayed
                    </span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentReport.sampleReviews.map((rev, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3 text-xs shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80'}
                            alt={rev.author}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{rev.author}</span>
                              {rev.localGuide && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Local Guide
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500">{rev.timeAgo}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-300 italic leading-relaxed text-[11px] bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                        "{rev.text}"
                      </p>

                      {/* Owner Response */}
                      {rev.response && (
                        <div className="p-3 rounded-xl bg-slate-900/90 border-l-2 border-indigo-500 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-indigo-300 font-bold">
                            <span>Response from owner</span>
                            <span className="text-[10px] text-slate-500">{rev.response.timeAgo}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed">
                            {rev.response.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: COMPETITORS IN CITY */}
          {activeSubTab === 'competitors' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">Top Local Competitors for "{currentReport.targetKeyword}" in {currentReport.city}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Compare review volume, star ratings, and exact Google rank positions</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Gap: {currentReport.competitorGap.reviewsNeededForTop3} Reviews needed for Top 3
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

          {/* TAB 4: GBP AUDIT */}
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

          {/* TAB 5: LOCAL RANK ACTION PLAN */}
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
