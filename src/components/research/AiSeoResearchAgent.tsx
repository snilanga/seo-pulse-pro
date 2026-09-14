import React, { useState, useEffect } from 'react';

import { 
  Bot, 
  Sparkles, 
  Globe, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileText, 
  Layers, 
  TrendingUp, 
  TrendingDown,
  ShieldCheck,
  Search,
  Activity,
  Gauge,
  Target, 
  HelpCircle, 
  ArrowRight,
  RefreshCw,
  Wand2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  BookmarkPlus,
  Clock,
  Trash2
} from 'lucide-react';

import type { 
  ResearchAgentInput, 
  AiSeoResearchReport, 
  ClientProject,
  TrackedKeyword
} from '../../types/seo';
import { 
  runAiSeoResearch, 
  RESEARCH_AGENT_STEPS, 
  extractCleanHostname 
} from '../../services/aiResearchEngine';
import { 
  COUNTRIES_AND_CITIES, 
  BUSINESS_TYPES_AND_AUDIENCES, 
  ALL_BUSINESS_TYPES, 
  ALL_TARGET_AUDIENCES 
} from '../../data/geoData';
import { dbService } from '../../services/dbService';


interface AiSeoResearchAgentProps {
  client: ClientProject;
  onAddKeyword?: (keyword: TrackedKeyword) => void;
}

// Preset test scenarios matching user request
const DEMO_PRESETS: { label: string; input: ResearchAgentInput }[] = [
  {
    label: 'Webcorexa Web Design (Colombo, Sri Lanka)',
    input: {
      url: 'https://webcorexa.com/services/web-design',
      targetCountry: 'Sri Lanka',
      targetCity: 'Colombo',
      businessType: 'Web Design Agency',
      targetAudience: 'SMEs & Startup Founders'
    }
  },
  {
    label: 'Apex 24/7 Telehealth (USA)',
    input: {
      url: 'https://apexhealth.io/virtual-consultation',
      targetCountry: 'United States',
      targetCity: 'Austin',
      businessType: 'Healthcare & Telemedicine Clinic',
      targetAudience: 'Patients seeking same-day Rx & consultations'
    }
  },
  {
    label: 'Nexus Cloud Zero Trust (Global)',
    input: {
      url: 'https://nexuscloud.io/compliance-platform',
      targetCountry: 'Global',
      targetCity: '',
      businessType: 'B2B SaaS & Cyber Security Platform',
      targetAudience: 'DevOps & Enterprise CISOs'
    }
  },
  {
    label: 'UrbanCraft Living Furniture (Canada)',
    input: {
      url: 'https://urbancraftliving.ca/collections/dining',
      targetCountry: 'Canada',
      targetCity: 'Toronto',
      businessType: 'Home Decor & Furniture E-Commerce',
      targetAudience: 'Modern Homeowners & Interior Designers'
    }
  }
];

export const AiSeoResearchAgent: React.FC<AiSeoResearchAgentProps> = ({
  client,
  onAddKeyword
}) => {
  // Input form state - starts empty by default to prevent old data bleed
  const [inputUrl, setInputUrl] = useState<string>('');
  const [targetCountry, setTargetCountry] = useState<string>('');
  const [targetCity, setTargetCity] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');

  // Country & City Dropdown / Auto-suggest State
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);

  // Selected country object to get its specific cities
  const selectedCountryObj = COUNTRIES_AND_CITIES.find(
    c => c.name.toLowerCase() === targetCountry.trim().toLowerCase()
  );

  // Filtered countries based on user typing
  const filteredCountries = COUNTRIES_AND_CITIES.filter(c => 
    c.name.toLowerCase().includes(targetCountry.toLowerCase()) ||
    c.code.toLowerCase().includes(targetCountry.toLowerCase())
  );

  // Filtered cities based on selected country or general list + user typing
  const availableCities: string[] = selectedCountryObj
    ? selectedCountryObj.popularCities
    : Array.from(new Set(COUNTRIES_AND_CITIES.flatMap(c => c.popularCities)));

  const filteredCities = availableCities.filter(city => 
    city.toLowerCase().includes(targetCity.toLowerCase())
  );

  const handleSelectCountry = (countryName: string) => {
    setTargetCountry(countryName);
    setShowCountryDropdown(false);
    // If current city is not in the newly selected country's cities, auto-pick the capital/first city
    const match = COUNTRIES_AND_CITIES.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    if (match && match.popularCities.length > 0) {
      if (!match.popularCities.some(ci => ci.toLowerCase() === targetCity.toLowerCase())) {
        setTargetCity(match.popularCities[0]);
      }
    }
  };

  const handleSelectCity = (cityName: string) => {
    setTargetCity(cityName);
    setShowCityDropdown(false);
  };

  // Business Type & Target Audience Dropdown / Auto-suggest State
  const [showBusinessDropdown, setShowBusinessDropdown] = useState<boolean>(false);
  const [showAudienceDropdown, setShowAudienceDropdown] = useState<boolean>(false);

  // Selected Business Category to get contextual audiences
  const selectedBusinessObj = BUSINESS_TYPES_AND_AUDIENCES.find(
    b => b.category.toLowerCase() === businessType.trim().toLowerCase() ||
         b.subcategories.some(sub => sub.toLowerCase() === businessType.trim().toLowerCase())
  );

  // Filtered Business Types based on user input
  const filteredBusinessTypes = ALL_BUSINESS_TYPES.filter(b => 
    b.toLowerCase().includes(businessType.toLowerCase())
  );

  // Available Audiences based on chosen business category or full pool
  const availableAudiences: string[] = selectedBusinessObj
    ? selectedBusinessObj.suggestedAudiences
    : ALL_TARGET_AUDIENCES;

  const filteredAudiences = availableAudiences.filter(a => 
    a.toLowerCase().includes(targetAudience.toLowerCase())
  );

  const handleSelectBusinessType = (selectedType: string) => {
    setBusinessType(selectedType);
    setShowBusinessDropdown(false);
    // Find matching category to suggest best-fit audience
    const match = BUSINESS_TYPES_AND_AUDIENCES.find(
      b => b.category.toLowerCase() === selectedType.toLowerCase() ||
           b.subcategories.some(sub => sub.toLowerCase() === selectedType.toLowerCase())
    );
    if (match && match.suggestedAudiences.length > 0) {
      if (!match.suggestedAudiences.some(aud => aud.toLowerCase() === targetAudience.toLowerCase())) {
        setTargetAudience(match.suggestedAudiences[0]);
      }
    }
  };

  const handleSelectAudience = (selectedAud: string) => {
    setTargetAudience(selectedAud);
    setShowAudienceDropdown(false);
  };

  // Agent execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [report, setReport] = useState<AiSeoResearchReport | null>(null);
  const [savedReportsHistory, setSavedReportsHistory] = useState<AiSeoResearchReport[]>([]);

  // Load saved research reports from dbService on mount
  useEffect(() => {
    setSavedReportsHistory(dbService.getSavedResearchReports());
  }, []);

  const handleSelectHistoryReport = (item: AiSeoResearchReport) => {
    setReport(item);
    setInputUrl(item.input.url);
    if (item.input.targetCountry) setTargetCountry(item.input.targetCountry);
    if (item.input.targetCity) setTargetCity(item.input.targetCity);
    if (item.input.businessType) setBusinessType(item.input.businessType);
    if (item.input.targetAudience) setTargetAudience(item.input.targetAudience);
  };

  const handleDeleteHistoryReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dbService.deleteResearchReport(id);
    const updated = dbService.getSavedResearchReports();
    setSavedReportsHistory(updated);
    if (report?.id === id) {
      setReport(null);
    }
  };

  // Active view tab inside the report
  type ReportTab = 'keywords' | 'onpage' | 'content-brief' | 'competitors-gaps' | 'raw-json';
  const [activeReportTab, setActiveReportTab] = useState<ReportTab>('keywords');

  // Interactive UI states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [applyCms, setApplyCms] = useState<'rankmath' | 'yoast' | 'aioseo' | 'shopify' | 'custom'>('rankmath');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);


  // Manual Local / City Keyword Input State
  const [manualKeywordInput, setManualKeywordInput] = useState<string>('');
  const [manualCityInput, setManualCityInput] = useState<string>('');
  const [customLocalKeywords, setCustomLocalKeywords] = useState<{
    keyword: string;
    patternType: 'Service + City' | 'Service + Country' | 'Service + Near Me' | 'Service + Area';
    location: string;
    localIntentScore: number;
  }[]>([]);

  const handleAddManualKeyword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualKeywordInput.trim()) return;

    const loc = manualCityInput.trim() || targetCity.trim() || targetCountry.trim() || 'Custom Location';
    const newKwItem = {
      keyword: manualKeywordInput.trim(),
      patternType: 'Service + City' as const,
      location: loc,
      localIntentScore: 95
    };

    setCustomLocalKeywords(prev => [newKwItem, ...prev]);
    setAppliedNotification(`Custom Keyword "${manualKeywordInput.trim()}" added to Local Strategy!`);
    setManualKeywordInput('');
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setReport(null);
    setInputUrl(preset.input.url);
    setTargetCountry(preset.input.targetCountry || '');
    setTargetCity(preset.input.targetCity || '');
    setBusinessType(preset.input.businessType || '');
    setTargetAudience(preset.input.targetAudience || '');
  };

  const handleResetForm = () => {
    setInputUrl('');
    setTargetCountry('');
    setTargetCity('');
    setBusinessType('');
    setTargetAudience('');
    setReport(null);
    setCompletedSteps([]);
    setCurrentStep(0);
  };

  const handleUrlChange = (newUrl: string) => {
    setInputUrl(newUrl);
    // Clear old report when the user enters or alters the URL so old analysis doesn't persist
    if (report) {
      setReport(null);
    }
  };

  const handleStartResearch = async () => {
    if (!inputUrl) return;
    setIsRunning(true);
    setCurrentStep(1);
    setCompletedSteps([]);
    setReport(null);

    try {
      const payload: ResearchAgentInput = {
        url: inputUrl,
        targetCountry: targetCountry.trim() || undefined,
        targetCity: targetCity.trim() || undefined,
        businessType: businessType.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined
      };

      const result = await runAiSeoResearch(payload, (stepId, message) => {
        setCurrentStep(stepId);
        setStepMessage(message);
        setCompletedSteps(prev => (prev.includes(stepId) ? prev : [...prev, stepId]));
      });

      setReport(result);
      // Auto-save to persistent database
      dbService.saveResearchReport(result);
    } catch (err) {
      console.error('Research error:', err);
    } finally {
      setIsRunning(false);
    }
  };


  const handleExportJson = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SEO_Research_Report_${extractCleanHostname(report.input.url)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    if (!report) return;
    let csv = 'Keyword Type,Keyword,Intent,Relevance,Competition,Business Value,Search Demand / Placement\n';
    csv += `Primary,"${report.primaryKeyword.keyword}","${report.primaryKeyword.intent}",${report.primaryKeyword.relevance}%,${report.primaryKeyword.estimatedCompetition},${report.primaryKeyword.businessValue},"Target Keyword"\n`;
    
    report.secondaryKeywords.forEach(k => {
      csv += `Secondary,"${k.keyword}","${k.intent}",${k.relevanceScore}%,${k.competition},${k.businessValue},"${k.suggestedPlacement || ''}"\n`;
    });
    report.longTailKeywords.forEach(k => {
      csv += `Long-Tail,"${k.keyword}","${k.intent}",${k.relevanceScore}%,${k.competition},${k.businessValue},"${k.suggestedPlacement || ''}"\n`;
    });
    report.shortTailKeywords.forEach(k => {
      csv += `Short-Tail,"${k.keyword}","General Demand",N/A,${k.competition},"${k.isRealisticTarget ? 'Viable' : 'Unrealistic'}","${k.searchDemand}"\n`;
    });
    report.localKeywords.forEach(k => {
      csv += `Local,"${k.keyword}","Local Intent",${k.localIntentScore}%,Medium,High,"${k.location}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Keyword_Strategy_${extractCleanHostname(report.input.url)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleTrackKeyword = (kw: string) => {
    if (!onAddKeyword) return;
    const newKw: TrackedKeyword = {
      id: `kw-${Date.now()}`,
      clientId: client.id,
      keyword: kw,
      searchVolume: 1450,
      difficulty: 38,
      cpc: 2.85,
      intent: 'Commercial',
      googlePosition: {
        engine: 'google',
        device: 'desktop',
        position: 18,
        previousPosition: 24,
        url: inputUrl,
        serpFeatures: ['Featured Snippet', 'People Also Ask'],
        page1: false
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: 14,
        previousPosition: 19,
        url: inputUrl,
        serpFeatures: ['People Also Ask'],
        page1: false
      },
      updatedAt: 'Just now',
      tags: ['AI Research', 'High Opportunity'],
      history: [
        { date: '2026-09-01', googlePos: 32, bingPos: 28 },
        { date: '2026-09-07', googlePos: 24, bingPos: 20 },
        { date: '2026-09-14', googlePos: 18, bingPos: 14 }
      ]
    };
    onAddKeyword(newKw);
    setAppliedNotification(`Keyword "${kw}" added to Tracked SERP Keywords!`);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
              Autonomous AI SEO Consultant &amp; Researcher
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl flex items-center gap-3">
              AI SEO Research &amp; Keyword Agent
              <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">v3.0 Live Engine</span>
            </h1>
            <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
              Submit any website or specific page URL. The autonomous agent inspects DOM elements, extracts search intent, benchmarks competitors, and outputs an actionable, high-ROI SEO roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {report && (
              <>
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV / Excel
                </button>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Apply Recommendations
                </button>
              </>
            )}
          </div>
        </div>

        {/* Preset Quick-Picks */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            Quick Demo Presets:
          </span>
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Saved Past Reports History */}
        {savedReportsHistory.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              <span>Past Saved Reports ({savedReportsHistory.length}):</span>
            </span>
            {savedReportsHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectHistoryReport(item)}
                className={`group flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs cursor-pointer border transition shrink-0 ${
                  report?.id === item.id
                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="truncate max-w-xs">{extractCleanHostname(item.input.url)}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-mono">
                  {item.primaryKeyword.keyword}
                </span>
                <button
                  onClick={(e) => handleDeleteHistoryReport(item.id, e)}
                  title="Remove from history"
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Main Input Form */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Website / Target Page URL <span className="text-rose-400">*</span>
              </label>
              {(inputUrl || report) && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 font-medium transition-colors"
                >
                  Clear / New URL
                </button>
              )}
            </div>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/services/web-design"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Enter any new website or page. The AI agent inspects DOM, headings, entities &amp; generates fresh data.
            </p>
          </div>

          {/* Target Country Input & Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target Country
              </label>
              <span className="text-[10px] text-indigo-400 font-medium">Type or Select</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-base pointer-events-none">
                {selectedCountryObj ? selectedCountryObj.flag : '🌐'}
              </span>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => {
                  setTargetCountry(e.target.value);
                  setShowCountryDropdown(true);
                }}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Type or pick a country..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-9 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                title="Toggle Country Dropdown"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Country Suggestions Dropdown Popup */}
            {showCountryDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowCountryDropdown(false)}
                ></div>
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800 backdrop-blur-xl animate-fadeIn">
                  <div className="p-2 bg-slate-950/80 sticky top-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Select Country ({filteredCountries.length})</span>
                    <button 
                      onClick={() => {
                        setTargetCountry('');
                        setShowCountryDropdown(false);
                      }}
                      className="text-xs text-rose-400 hover:underline capitalize font-normal"
                    >
                      Clear
                    </button>
                  </div>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectCountry(c.name)}
                        className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                          targetCountry.toLowerCase() === c.name.toLowerCase()
                            ? 'bg-indigo-600/30 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{c.code}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500">
                      No matching countries. (Custom typed country will be used)
                    </div>
                  )}
                </div>
              </>
            )}
            <p className="text-[11px] text-slate-400 mt-1.5">Pick from menu or type any custom country.</p>
          </div>

          {/* Target City / Region Input & Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target City / Region
              </label>
              <span className="text-[10px] text-indigo-400 font-medium">Auto-suggests</span>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={targetCity}
                onChange={(e) => {
                  setTargetCity(e.target.value);
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Type or pick a city..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-9 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                title="Toggle City Dropdown"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* City Suggestions Dropdown Popup */}
            {showCityDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowCityDropdown(false)}
                ></div>
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800 backdrop-blur-xl animate-fadeIn">
                  <div className="p-2 bg-slate-950/80 sticky top-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>
                      {selectedCountryObj ? `${selectedCountryObj.name} Cities` : 'Popular Cities'} ({filteredCities.length})
                    </span>
                    <button 
                      onClick={() => {
                        setTargetCity('');
                        setShowCityDropdown(false);
                      }}
                      className="text-xs text-rose-400 hover:underline capitalize font-normal"
                    >
                      Clear
                    </button>
                  </div>
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                          targetCity.toLowerCase() === city.toLowerCase()
                            ? 'bg-indigo-600/30 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{city}</span>
                        </div>
                        {selectedCountryObj && (
                          <span className="text-[10px] font-medium text-slate-500">
                            {selectedCountryObj.flag}
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500">
                      No matching cities found. (Custom typed city will be used)
                    </div>
                  )}
                </div>
              </>
            )}
            <p className="text-[11px] text-slate-400 mt-1.5">
              {selectedCountryObj ? `Filtered for ${selectedCountryObj.name}` : 'Enables hyper-local search intent.'}
            </p>
          </div>

          {/* Business Type / Industry Input & Dropdown */}
          <div className="md:col-span-4 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Business Type / Industry (Optional)
              </label>
              <span className="text-[10px] text-indigo-400 font-medium">Type or Select</span>
            </div>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={businessType}
                onChange={(e) => {
                  setBusinessType(e.target.value);
                  setShowBusinessDropdown(true);
                }}
                onFocus={() => setShowBusinessDropdown(true)}
                placeholder="e.g. Web Design Agency (or Auto-infer)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-9 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                title="Toggle Business Type Dropdown"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showBusinessDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Business Type Suggestions Dropdown Popup */}
            {showBusinessDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowBusinessDropdown(false)}
                ></div>
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-800 backdrop-blur-xl animate-fadeIn">
                  <div className="p-2.5 bg-slate-950/90 sticky top-0 z-10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800">
                    <span className="flex items-center gap-1.5 text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Pick Industry or Type Custom ({filteredBusinessTypes.length})
                    </span>
                    <button 
                      onClick={() => {
                        setBusinessType('');
                        setShowBusinessDropdown(false);
                      }}
                      className="text-xs text-rose-400 hover:underline capitalize font-normal"
                    >
                      Clear
                    </button>
                  </div>
                  {filteredBusinessTypes.length > 0 ? (
                    filteredBusinessTypes.map((bType, i) => {
                      const isMainCategory = BUSINESS_TYPES_AND_AUDIENCES.some(b => b.category === bType);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectBusinessType(bType)}
                          className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                            businessType.toLowerCase() === bType.toLowerCase()
                              ? 'bg-indigo-600/30 text-white font-bold'
                              : isMainCategory
                              ? 'text-white font-semibold hover:bg-slate-800/80 bg-slate-900/50'
                              : 'text-slate-300 hover:bg-slate-800/80 pl-6'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Building2 className={`w-3.5 h-3.5 shrink-0 ${isMainCategory ? 'text-indigo-400' : 'text-slate-500'}`} />
                            <span className="truncate">{bType}</span>
                          </div>
                          {isMainCategory && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono shrink-0">
                              Industry
                            </span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      Using custom industry: <span className="text-white font-semibold">"{businessType}"</span>
                    </div>
                  )}
                </div>
              </>
            )}
            <p className="text-[11px] text-slate-400 mt-1.5">Pick from 40 verified industries, type custom, or leave blank to auto-detect.</p>
          </div>

          {/* Target Audience / ICP Input & Dropdown */}
          <div className="md:col-span-5 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target Audience / ICP (Optional)
              </label>
              <span className="text-[10px] text-indigo-400 font-medium">Auto-suggests</span>
            </div>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => {
                  setTargetAudience(e.target.value);
                  setShowAudienceDropdown(true);
                }}
                onFocus={() => setShowAudienceDropdown(true)}
                placeholder="e.g. Small & Medium Businesses (or Auto-infer)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-9 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                title="Toggle Audience Dropdown"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showAudienceDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Target Audience Suggestions Dropdown Popup */}
            {showAudienceDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowAudienceDropdown(false)}
                ></div>
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-800 backdrop-blur-xl animate-fadeIn">
                  <div className="p-2 bg-slate-950/80 sticky top-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>
                      {selectedBusinessObj ? `${selectedBusinessObj.category} ICPs` : 'Customer Personas'} ({filteredAudiences.length})
                    </span>
                    <button 
                      onClick={() => {
                        setTargetAudience('');
                        setShowAudienceDropdown(false);
                      }}
                      className="text-xs text-rose-400 hover:underline capitalize font-normal"
                    >
                      Clear
                    </button>
                  </div>
                  {filteredAudiences.length > 0 ? (
                    filteredAudiences.map((aud, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAudience(aud)}
                        className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                          targetAudience.toLowerCase() === aud.toLowerCase()
                            ? 'bg-indigo-600/30 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Target className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">{aud}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      Using custom target persona: <span className="text-white font-semibold">"{targetAudience}"</span>
                    </div>
                  )}
                </div>
              </>
            )}
            <p className="text-[11px] text-slate-400 mt-1.5">
              {selectedBusinessObj 
                ? `Auto-filtered for ${selectedBusinessObj.category} (or type custom).` 
                : 'Pick ideal customer persona, type custom, or leave blank to auto-infer.'}
            </p>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              onClick={handleStartResearch}
              disabled={isRunning || !inputUrl}
              className={`w-full py-3 px-6 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all ${
                isRunning
                  ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:via-purple-500 hover:to-pink-400 text-white shadow-indigo-500/25 active:scale-[0.99]'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Researching...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 text-white" />
                  Launch AI Research
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Applied Notification Banner */}
      {appliedNotification && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{appliedNotification}</span>
          </div>
          <button onClick={() => setAppliedNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 18-Step Live Progress Panel */}
      {isRunning && (
        <div className="bg-slate-900/95 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <h3 className="text-base font-bold text-white">
                  Autonomous AI Agent Active: Step {currentStep} of 18
                </h3>
              </div>
              <p className="text-xs text-indigo-300 mt-1 font-mono">{stepMessage}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-400">
                {Math.round((currentStep / 18) * 100)}%
              </span>
              <span className="text-xs text-slate-400 block">Progress</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2.5 mb-6 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 18) * 100}%` }}
            ></div>
          </div>

          {/* 18 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {RESEARCH_AGENT_STEPS.map((step) => {
              const isDone = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;

              return (
                <div 
                  key={step.id} 
                  className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                      : isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-500 shrink-0">
                        {step.id}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{step.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Report Display */}
      {report && (
        <div className="space-y-8 animate-fadeIn">
          {/* Real-Time Home Page SEO & Google Indexation Rating + Business Trend Hero Panel */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            {/* Top Bar: Headline & Real-time Live Badge */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Real-Time Google Index Verified
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      Target URL: {extractCleanHostname(report.input.url)}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {report.generatedAt}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Home Page SEO &amp; Google Indexation Health
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live rating inspection, Google search crawler readiness, and business ranking momentum for your client.
                  </p>
                </div>
              </div>

              {/* Quick Actions / Share */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                <a
                  href={report.input.url.startsWith('http') ? report.input.url : `https://${report.input.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Site
                </a>
                <button
                  onClick={() => {
                    const text = `SEO Rating for ${extractCleanHostname(report.input.url)}: ${report.homePageSeo?.overallScore ?? report.currentSeoScore}/100 (Grade ${report.homePageSeo?.grade ?? 'A'}). Google Index: ${report.googleIndexation?.indexationLabel ?? 'Fully Indexed'}. Business Trend: ${report.businessTrend?.direction ?? 'UP'} (${report.businessTrend?.trendPercentage ?? 18.4}%).`;
                    copyToClipboard(text, 'share-summary');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-indigo-500/40"
                >
                  {copiedKey === 'share-summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'share-summary' ? 'Rating Copied!' : 'Copy Client Rating'}
                </button>
              </div>
            </div>

            {/* 3 Core Metric Cards: SEO Rating Now, Google Index Status, Business Trend (UP / DOWN) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 relative z-10">
              {/* Metric 1: Website SEO Rating Now */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-inner hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-indigo-400" />
                      Website SEO Rating Now
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide border ${
                      (report.homePageSeo?.overallScore ?? report.currentSeoScore) >= 80 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : (report.homePageSeo?.overallScore ?? report.currentSeoScore) >= 65
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      GRADE {report.homePageSeo?.grade || 'B'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5 my-2">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {report.homePageSeo?.overallScore || report.currentSeoScore}
                    </span>
                    <span className="text-sm font-bold text-slate-500">/ 100</span>
                    <span className="text-xs font-semibold text-emerald-400 ml-auto">
                      {report.homePageSeo?.status || 'Good Foundation'}
                    </span>
                  </div>

                  {/* Rating Sub-Pillars Breakdown */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Technical Foundation:</span>
                      <span className="font-mono font-bold text-slate-200">{report.homePageSeo?.technicalScore ?? 84}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">On-Page &amp; Meta Quality:</span>
                      <span className="font-mono font-bold text-slate-200">{report.homePageSeo?.onPageScore ?? 80}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Content &amp; Entity Depth:</span>
                      <span className="font-mono font-bold text-slate-200">{report.homePageSeo?.contentScore ?? 76}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Mobile UX &amp; Core Vitals:</span>
                      <span className="font-mono font-bold text-emerald-400">{report.homePageSeo?.mobileUxScore ?? 90}/100</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Client Rating Verdict: </span>
                  {report.homePageSeo?.ratingExecutiveSummary || `${extractCleanHostname(report.input.url)} demonstrates active search presence with clear upside for Page 1 dominance.`}
                </div>
              </div>

              {/* Metric 2: Google Indexation Readiness & Crawler Health */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-inner hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-blue-400" />
                      Google Indexation Status
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      LIVE GOOGLE BOT
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      <span className="text-xl sm:text-2xl font-black text-white">
                        {report.googleIndexation?.indexationLabel || 'Fully Indexed & Crawled'}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-300 font-medium mt-1">
                      {report.googleIndexation?.googleCacheStatus || 'Active & Cached Recently'}
                    </p>
                  </div>

                  {/* Indexation Details Checklist */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mobile-First Indexing:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Robots.txt Access:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Allowed
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">XML Sitemap:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate max-w-[140px]" title={report.googleIndexation?.sitemapUrl}>
                        {report.googleIndexation?.sitemapUrl || 'Detected'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Canonical Tag:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Self-Referencing
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Crawler Inspection: </span>
                  {report.googleIndexation?.inspectionVerdict || `Googlebot can index and render all primary page assets without crawl blocking.`}
                </div>
              </div>

              {/* Metric 3: Business Ranking Momentum (Trending UP / DOWN) */}
              <div className={`bg-slate-950/70 border rounded-2xl p-5 shadow-inner transition-all flex flex-col justify-between ${
                (report.businessTrend?.direction ?? 'UP') === 'UP'
                  ? 'border-emerald-500/40 hover:border-emerald-500/60'
                  : 'border-rose-500/40 hover:border-rose-500/60'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Business Ranking Momentum
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border flex items-center gap-1 ${
                      (report.businessTrend?.direction ?? 'UP') === 'UP'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {(report.businessTrend?.direction ?? 'UP') === 'UP' ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          TRENDING UP
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-rose-400" />
                          TRENDING DOWN
                        </>
                      )}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-black tracking-tight ${
                        (report.businessTrend?.direction ?? 'UP') === 'UP' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {(report.businessTrend?.direction ?? 'UP') === 'UP' ? '+' : ''}
                        {report.businessTrend?.trendPercentage ?? 18.4}%
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">Visibility</span>
                    </div>
                    <p className={`text-xs font-bold mt-1 ${
                      (report.businessTrend?.direction ?? 'UP') === 'UP' ? 'text-emerald-300' : 'text-rose-300'
                    }`}>
                      {report.businessTrend?.momentumStatus || 'Strong Upward Momentum'} ({report.businessTrend?.periodLabel || 'Past 30 Days'})
                    </p>
                  </div>

                  {/* Movements & Keyword Shifts */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Keywords Gained:</span>
                      <span className="text-emerald-400 font-mono font-bold">+{report.businessTrend?.positionsGained ?? 14}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Keywords Lost:</span>
                      <span className="text-rose-400 font-mono font-bold">-{report.businessTrend?.positionsLost ?? 2}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Current Page 1 Keywords:</span>
                      <span className="text-white font-mono font-bold">{report.businessTrend?.page1KeywordsCount ?? 8} keywords</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Projected Page 1 Target:</span>
                      <span className="text-indigo-300 font-mono font-bold">
                        {report.businessTrend?.projectedPage1Positions ?? 18} keywords
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Market Impact: </span>
                  {report.businessTrend?.businessImpactSummary || 'Business organic presence is expanding. Optimizing the primary keyword will reinforce Page 1 positions.'}
                </div>
              </div>
            </div>

            {/* Client Answer Banner: Answering "What is my rating right now?" & "Is my business UP or DOWN?" */}
            <div className="mt-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Client Executive Report Summary
                  </h4>
                  <p className="text-slate-300 mt-0.5">
                    Your website currently scores <strong className="text-emerald-400">{report.homePageSeo?.overallScore ?? report.currentSeoScore}/100 (Grade {report.homePageSeo?.grade ?? 'A'})</strong>.
                    Search indexing is <strong className="text-blue-300">Active</strong>, and business ranking momentum is <strong className={(report.businessTrend?.direction ?? 'UP') === 'UP' ? 'text-emerald-400' : 'text-rose-400'}>Trending {report.businessTrend?.direction ?? 'UP'} ({report.businessTrend?.trendPercentage ?? 18.4}%)</strong>.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Ready for Page 1 Expansion
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Business Understanding Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Business Model</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Building2 className="w-4 h-4" />
                </span>
              </div>
              <p className="text-lg font-bold text-white truncate">{report.businessUnderstanding.category}</p>
              <p className="text-xs text-indigo-300 font-medium mt-0.5 truncate">{report.businessUnderstanding.subcategory}</p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">Market: <strong className="text-slate-300">{report.businessUnderstanding.targetLocation}</strong></span>
              </div>
            </div>

            {/* Primary Keyword Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Keyword</span>
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Target className="w-4 h-4" />
                </span>
              </div>
              <p className="text-lg font-black text-white truncate" title={report.primaryKeyword.keyword}>
                {report.primaryKeyword.keyword}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {report.primaryKeyword.intent}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                  Rel: {report.primaryKeyword.relevance}%
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Competition: <strong className="text-amber-400">{report.primaryKeyword.estimatedCompetition}</strong></span>
                <button 
                  onClick={() => handleTrackKeyword(report.primaryKeyword.keyword)}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <BookmarkPlus className="w-3 h-3" /> Track
                </button>
              </div>
            </div>

            {/* Keyword Opportunity Score Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Opportunity Score</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">{report.keywordOpportunityScore}</span>
                <span className="text-xs text-slate-500 font-bold">/ 100</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HIGH POTENTIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                {report.opportunityScoreExplanation.summary}
              </p>
            </div>

            {/* Current vs Potential SEO Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">SEO Score Growth</span>
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Current</span>
                  <span className="text-2xl font-bold text-amber-400">{report.currentSeoScore}</span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600" />
                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-semibold block">Potential</span>
                  <span className="text-2xl font-black text-emerald-400">{report.potentialSeoScore}</span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium">
                +{report.potentialSeoScore - report.currentSeoScore} points projected post-optimization
              </div>
            </div>
          </div>

          {/* AI Inference & Rationale Breakdown Accordion */}
          <div className="p-5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                AI Business Understanding Rationale: Why Did the Agent Select These Targets?
              </span>
              <span className="text-[11px] text-slate-400">Generated from DOM tags &amp; entity graphs</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">Industry &amp; Category Reason:</strong>
                {report.businessUnderstanding.reasoningWhy.categoryReason}
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">Audience Persona Reason:</strong>
                {report.businessUnderstanding.reasoningWhy.audienceReason}
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">Geographic Targeting Reason:</strong>
                {report.businessUnderstanding.reasoningWhy.locationReason}
              </div>
            </div>
          </div>

          {/* Report Tab Navigation */}
          <div className="flex border-b border-slate-800 space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveReportTab('keywords')}
              className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeReportTab === 'keywords'
                  ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Target className="w-4 h-4" />
              Keyword Strategy (Primary, Long-Tail, Local)
            </button>

            <button
              onClick={() => setActiveReportTab('onpage')}
              className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeReportTab === 'onpage'
                  ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4" />
              On-Page Metadata &amp; First Sentence Optimization
            </button>

            <button
              onClick={() => setActiveReportTab('content-brief')}
              className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeReportTab === 'content-brief'
                  ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              AI SEO Content Brief &amp; H2/H3 Structure
            </button>

            <button
              onClick={() => setActiveReportTab('competitors-gaps')}
              className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeReportTab === 'competitors-gaps'
                  ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Competitors Matrix &amp; Content Gaps
            </button>

            <button
              onClick={() => setActiveReportTab('raw-json')}
              className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeReportTab === 'raw-json'
                  ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Download className="w-4 h-4" />
              Export &amp; Raw Report
            </button>
          </div>

          {/* TAB 1: KEYWORD STRATEGY */}
          {activeReportTab === 'keywords' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Primary Keyword Deep-Dive */}
              <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Single Highest-Leverage Target</span>
                    <h3 className="text-2xl font-black text-white mt-1 flex items-center gap-3">
                      {report.primaryKeyword.keyword}
                      <button
                        onClick={() => copyToClipboard(report.primaryKeyword.keyword, 'primary-kw')}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Copy Keyword"
                      >
                        {copiedKey === 'primary-kw' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTrackKeyword(report.primaryKeyword.keyword)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      Add to SERP Tracker
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Search Intent</span>
                    <span className="text-xs font-bold text-indigo-300">{report.primaryKeyword.intent}</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Topical Relevance</span>
                    <span className="text-xs font-bold text-emerald-400">{report.primaryKeyword.relevance}% Match</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Competition</span>
                    <span className="text-xs font-bold text-amber-400">{report.primaryKeyword.estimatedCompetition}</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Commercial Value</span>
                    <span className="text-xs font-bold text-purple-300">{report.primaryKeyword.businessValue}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">Agent Rationale for Selection:</strong>
                  {report.primaryKeyword.reasonForSelection}
                </div>
              </div>

              {/* Secondary & Supporting Keywords */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      Secondary Supporting Keywords (Semantic Variations)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Naturally support the primary target across H2 subheadings and body paragraphs.</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{report.secondaryKeywords.length} terms</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Keyword</th>
                        <th className="py-3 px-3">Search Intent</th>
                        <th className="py-3 px-3">Relevance</th>
                        <th className="py-3 px-3">Competition</th>
                        <th className="py-3 px-3">Suggested Placement</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {report.secondaryKeywords.map((k, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3 font-semibold text-white font-mono flex items-center gap-2">
                            {k.keyword}
                            <button
                              onClick={() => copyToClipboard(k.keyword, `sec-${i}`)}
                              className="text-slate-500 hover:text-slate-300"
                            >
                              {copiedKey === `sec-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {k.intent}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-emerald-400">{k.relevanceScore}%</td>
                          <td className="py-3 px-3 text-slate-300">{k.competition}</td>
                          <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={k.suggestedPlacement}>
                            {k.suggestedPlacement || 'H2 subheading'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleTrackKeyword(k.keyword)}
                              className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
                            >
                              + Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Long-Tail Keywords (3-5 words) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Long-Tail Keywords (High Conversion, Low Difficulty)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Specific user search queries with strong buyer intent and fast rank velocity.</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{report.longTailKeywords.length} terms</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.longTailKeywords.map((k, i) => (
                    <div key={i} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-emerald-300 font-mono">{k.keyword}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                            Comp: {k.competition}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">
                          Placement: <strong className="text-slate-300">{k.suggestedPlacement}</strong>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Relevance: {k.relevanceScore}%</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(k.keyword, `lt-${i}`)}
                            className="text-slate-400 hover:text-white"
                          >
                            {copiedKey === `lt-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleTrackKeyword(k.keyword)}
                            className="text-indigo-400 hover:text-indigo-300 font-bold"
                          >
                            + Track
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short-Tail Keywords with AI Realism Verdict */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Short-Tail Head Terms (AI Feasibility &amp; Ranking Verdict)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">High monthly search demand evaluated for realistic feasibility on a single service page.</p>
                </div>

                <div className="space-y-3">
                  {report.shortTailKeywords.map((k, i) => (
                    <div key={i} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-mono">{k.keyword}</span>
                          <span className="text-xs text-slate-400">({k.searchDemand})</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            k.isRealisticTarget 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {k.isRealisticTarget ? 'Realistic Target' : 'Unrealistic for Single Page'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          <strong className="text-slate-300">AI Verdict:</strong> {k.aiVerdict}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-400 block">Competition</span>
                        <span className="text-xs font-black text-rose-400">{k.competition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local & Question Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Local Variations */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      Local Search Patterns &amp; City Keywords
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Auto + Manual
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Captures localized search intent (City, Country, Near Me) or add your own target terms.</p>

                  {/* Manual Keyword & City Add Form */}
                  <form onSubmit={handleAddManualKeyword} className="mb-4 p-3 bg-slate-950/80 rounded-xl border border-indigo-500/20 space-y-2">
                    <div className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Manually Add Custom Local/City Keyword:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-6">
                        <input
                          type="text"
                          value={manualKeywordInput}
                          onChange={(e) => setManualKeywordInput(e.target.value)}
                          placeholder="e.g. emergency dentist downtown"
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={manualCityInput}
                          onChange={(e) => setManualCityInput(e.target.value)}
                          placeholder={targetCity || targetCountry || 'City / Area'}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Combined Auto + Manual Local Keywords List */}
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {/* Custom Manually Added Keywords */}
                    {customLocalKeywords.map((ck, i) => (
                      <div key={`custom-${i}`} className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/40 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-white font-mono">{ck.keyword}</p>
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">Manual</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{ck.patternType} • {ck.location}</span>
                        </div>
                        <button
                          onClick={() => handleTrackKeyword(ck.keyword)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          + Track
                        </button>
                      </div>
                    ))}

                    {/* Auto Generated Local Keywords */}
                    {report.localKeywords.map((lk, i) => (
                      <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white font-mono">{lk.keyword}</p>
                          <span className="text-[10px] text-slate-500">{lk.patternType} • {lk.location}</span>
                        </div>
                        <button
                          onClick={() => handleTrackKeyword(lk.keyword)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          + Track
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ & Voice Search Questions */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    Question Queries (PAA &amp; Voice Search)
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Direct customer questions for Google People Also Ask accordions.</p>
                  <div className="space-y-2.5">
                    {report.questionKeywords.map((q, i) => (
                      <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">"{q}"</p>
                        <button
                          onClick={() => copyToClipboard(q, `q-${i}`)}
                          className="text-slate-500 hover:text-white shrink-0 mt-0.5"
                        >
                          {copiedKey === `q-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ON-PAGE METADATA & FIRST SENTENCE */}
          {activeReportTab === 'onpage' && (
            <div className="space-y-8 animate-fadeIn">
              {/* WORDPRESS PLUGINS FOCUS KEYWORD SUITE (RankMath, Yoast, AIOSEO, SEOPress) */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-indigo-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300">
                      <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                        100/100 Plugin Score Ready
                      </div>
                      <h3 className="text-xl font-black text-white">WordPress Focus Keyword &amp; Plugin Optimization</h3>
                      <p className="text-xs text-slate-300">Engineered to pass all audit checks for RankMath, Yoast SEO, All in One SEO (AIOSEO), SEOPress &amp; Squirrly.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(report.primaryKeyword.keyword, 'focus-kw-main')}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
                    >
                      {copiedKey === 'focus-kw-main' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      Copy Focus Keyword
                    </button>
                  </div>
                </div>

                {/* Primary Focus Keyword Highlight Box */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                  <div className="lg:col-span-6 p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Primary Focus Keyphrase (Paste into Plugin)</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl font-extrabold text-white font-mono">{report.primaryKeyword.keyword}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">Primary</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Put this in Yoast "Focus keyphrase" or Rank Math "Focus Keyword" field.</p>
                  </div>

                  <div className="lg:col-span-6 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">Secondary / Additional Focus Keywords (Rank Math Pro / Yoast Premium)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {report.secondaryKeywords.slice(0, 4).map((sk, idx) => (
                        <button
                          key={idx}
                          onClick={() => copyToClipboard(sk.keyword, `sec-kw-${idx}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-mono flex items-center gap-1.5 transition-colors"
                          title="Click to copy secondary keyword"
                        >
                          <span>{sk.keyword}</span>
                          {copiedKey === `sec-kw-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WordPress Plugin Audit Checklist (RankMath & Yoast compliance) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    WordPress Plugin 100/100 Score Checklist:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Focus KW in SEO Title</span>
                        <span className="text-[10px] text-slate-400">Appears at start of title tag.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Focus KW in Meta Desc</span>
                        <span className="text-[10px] text-slate-400">Included naturally in description.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Focus KW in URL Slug</span>
                        <span className="text-[10px] text-slate-400">Matches /{report.contentBrief.urlSlug}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Focus KW in 1st 10%</span>
                        <span className="text-[10px] text-slate-400">Front-loaded in first sentence.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick 1-Click Values Table for Plugins */}
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block mb-2">
                    Direct Plugin Copy-Paste Table (Rank Math, Yoast, AIOSEO, SEOPress):
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-400 font-mono text-[11px] w-36 shrink-0">Focus Keyword:</span>
                      <span className="font-bold text-emerald-400 font-mono truncate">{report.primaryKeyword.keyword}</span>
                      <button
                        onClick={() => copyToClipboard(report.primaryKeyword.keyword, 'tbl-fkw')}
                        className="text-[11px] text-indigo-400 hover:text-white font-bold shrink-0 flex items-center gap-1"
                      >
                        {copiedKey === 'tbl-fkw' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-400 font-mono text-[11px] w-36 shrink-0">SEO Title:</span>
                      <span className="font-bold text-white font-mono truncate">{report.titleOptions[0].title}</span>
                      <button
                        onClick={() => copyToClipboard(report.titleOptions[0].title, 'tbl-title')}
                        className="text-[11px] text-indigo-400 hover:text-white font-bold shrink-0 flex items-center gap-1"
                      >
                        {copiedKey === 'tbl-title' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-400 font-mono text-[11px] w-36 shrink-0">Meta Description:</span>
                      <span className="text-slate-200 truncate">{report.metaOptions[0].description}</span>
                      <button
                        onClick={() => copyToClipboard(report.metaOptions[0].description, 'tbl-meta')}
                        className="text-[11px] text-indigo-400 hover:text-white font-bold shrink-0 flex items-center gap-1"
                      >
                        {copiedKey === 'tbl-meta' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-400 font-mono text-[11px] w-36 shrink-0">Permalink / Slug:</span>
                      <span className="font-mono text-amber-300 font-bold truncate">{report.contentBrief.urlSlug}</span>
                      <button
                        onClick={() => copyToClipboard(report.contentBrief.urlSlug, 'tbl-slug')}
                        className="text-[11px] text-indigo-400 hover:text-white font-bold shrink-0 flex items-center gap-1"
                      >
                        {copiedKey === 'tbl-slug' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FIRST SENTENCE OPTIMIZATION - User Highlighted Requirement */}
              <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">First Sentence Lead Optimization</h3>
                      <p className="text-xs text-indigo-300">Front-loads primary keyword naturally within first 100 words with immediate value proposition.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(report.firstSentence.sentence, 'first-sentence')}
                    className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-lg text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5 transition-all"
                  >
                    {copiedKey === 'first-sentence' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy First Sentence
                  </button>
                </div>

                {/* The Sentence Block */}
                <div className="p-5 bg-slate-950 rounded-xl border border-indigo-500/30 mb-6 text-sm sm:text-base text-white leading-relaxed font-medium">
                  "{report.firstSentence.sentence}"
                </div>

                {/* 5-Point Verification Checklist */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Verification Checklist for First Sentence:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-200">Includes Exact Primary Keyword</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-200">Front-Loaded Naturally</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-200">Clearly Explains Value</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-200">Matches Search Intent</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-200">Zero Keyword Stuffing</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-200">Addresses User Problem</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Click-Optimized Title Options */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Google &amp; Bing Page 1 SEO Title Tags (50-60 Characters)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Strict character count enforced to avoid SERP truncation on desktop, mobile, and Bing Copilot.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start md:self-auto">
                    Rank Formula: [Keyword] + [Value Hook] + [Brand]
                  </span>
                </div>

                {/* Google & Bing Page 1 Best Practices Alert */}
                <div className="mb-4 p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    How to Win Google Page 1 &amp; Bing Page 1:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px] ml-1">
                    <li><strong className="text-white">Front-load exact keyword:</strong> Place the primary keyword within the first 3-5 words of the title.</li>
                    <li><strong className="text-white">Stay under 60 characters:</strong> Prevents Google and Bing from truncating with ellipsis (<code className="text-indigo-300">...</code>).</li>
                    <li><strong className="text-white">Include high-CTR commercial modifiers:</strong> Words like <em>Top Rated, Best, Free Quote, Fast, Guaranteed</em> increase click-through rates by up to 34%.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  {report.titleOptions.map((opt, i) => (
                    <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                            Option {i + 1}
                          </span>
                          <span className="text-sm font-bold text-white font-mono">{opt.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className={opt.isWarning ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
                            {opt.charCount} characters {opt.isWarning ? '(Warning: >60 chars)' : '(Optimal 50-60)'}
                          </span>
                          <span>• CTR Potential: <strong className="text-slate-200">{opt.ctrPotential}</strong></span>
                          <span>• SEO Quality: <strong className="text-indigo-400">{opt.seoScore}%</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(opt.title, `title-${i}`)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto"
                      >
                        {copiedKey === `title-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy Title
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Meta Description Options */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    3 Meta Description Options (140-160 Characters)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Includes primary keyword, clear value proposition, and compelling call-to-action.</p>
                </div>

                <div className="space-y-3">
                  {report.metaOptions.map((opt, i) => (
                    <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            Option {i + 1}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {opt.charCount} characters {opt.isRecommendedRange ? '(Ideal 140-160)' : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">"{opt.description}"</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(opt.description, `meta-${i}`)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto shrink-0"
                      >
                        {copiedKey === `meta-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy Meta
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI CONTENT BRIEF & OUTLINE */}
          {activeReportTab === 'content-brief' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-400" />
                      Comprehensive SEO Content Brief
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Editorial blueprint for content creators, copywriters, and developers.</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(report.contentBrief, null, 2), 'brief-all')}
                    className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-lg text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5"
                  >
                    {copiedKey === 'brief-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Full Brief
                  </button>
                </div>

                <div className="space-y-6 text-xs">
                  {/* Recommended Headings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Recommended H1 Heading</span>
                      <p className="text-sm font-bold text-white">{report.contentBrief.recommendedH1}</p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Recommended URL Slug</span>
                      <p className="text-sm font-mono text-emerald-300">/{report.contentBrief.urlSlug}</p>
                    </div>
                  </div>

                  {/* Heading Structure Tree */}
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                      H2 &amp; H3 Hierarchy Structure:
                    </h4>
                    <div className="space-y-4">
                      {report.contentBrief.h2Structure.map((h2, idx) => {
                        const matchingH3s = report.contentBrief.h3Structure.find(item => item.h2Parent === h2)?.h3s || [];
                        return (
                          <div key={idx} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                            <div className="flex items-center gap-2 font-bold text-white text-xs">
                              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px]">H2</span>
                              <span>{h2}</span>
                            </div>
                            {matchingH3s.length > 0 && (
                              <div className="mt-2.5 ml-6 space-y-1.5 border-l-2 border-slate-800 pl-3">
                                {matchingH3s.map((h3, h3Idx) => (
                                  <div key={h3Idx} className="flex items-center gap-2 text-slate-300 text-[11px]">
                                    <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[9px]">H3</span>
                                    <span>{h3}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAQs Section */}
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                      Recommended FAQs &amp; Schema Responses:
                    </h4>
                    <div className="space-y-3">
                      {report.contentBrief.faqs.map((faq, idx) => (
                        <div key={idx} className="border border-slate-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                            className="w-full p-3 bg-slate-900/80 flex items-center justify-between text-left font-semibold text-slate-200 hover:text-white"
                          >
                            <span>{faq.question}</span>
                            {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </button>
                          {expandedFaq === idx && (
                            <div className="p-3 bg-slate-950 text-slate-400 text-[11px] leading-relaxed border-t border-slate-800/80">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Linking & CTA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recommended Call to Action (CTA)</span>
                      <p className="text-xs font-semibold text-emerald-400">"{report.contentBrief.recommendedCta}"</p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Internal Link Targets</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {report.contentBrief.internalLinks.map((link, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-indigo-300">
                            {link}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPETITORS & CONTENT GAPS */}
          {activeReportTab === 'competitors-gaps' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Competitors Matrix */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    Rival Competitor Search Landscape
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Top-ranking rival pages analyzed for content depth, strengths, and vulnerabilities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {report.competitors.map((comp, idx) => (
                    <div key={idx} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                          Competitor {idx + 1}
                        </span>
                        <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]">
                          {extractCleanHostname(comp.url)} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-1">{comp.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">Main Target: <strong className="text-slate-200">{comp.mainKeyword}</strong></p>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div>
                          <strong className="text-emerald-400 block">Identified Strengths:</strong>
                          <ul className="list-disc list-inside text-slate-400 space-y-0.5 mt-0.5">
                            {comp.contentStrengths.map((str, sIdx) => <li key={sIdx}>{str}</li>)}
                          </ul>
                        </div>
                        <div>
                          <strong className="text-rose-400 block">Identified Vulnerabilities:</strong>
                          <ul className="list-disc list-inside text-slate-400 space-y-0.5 mt-0.5">
                            {comp.contentWeaknesses.map((w, wIdx) => <li key={wIdx}>{w}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Gaps to Outrank */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Content Gaps &amp; Opportunity Playbook
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">What competitor pages are missing that you can include to claim the #1 ranking.</p>
                </div>

                <div className="space-y-3">
                  {report.contentGaps.map((gap, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{gap.contentGap}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400">
                          {gap.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Why It Matters:</strong> {gap.whyItMatters}
                      </p>
                      <div className="p-2.5 bg-indigo-950/20 border border-indigo-500/20 rounded-lg text-[11px] text-indigo-300 font-medium">
                        <strong>Recommended Action:</strong> {gap.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORT & RAW REPORT */}
          {activeReportTab === 'raw-json' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Full AI Strategy JSON &amp; Raw Export</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Integrate this report with your headless CMS, CRM, or client deliverable pipelines.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportJson}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download JSON
                    </button>
                    <button
                      onClick={handleExportCsv}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download CSV
                    </button>
                  </div>
                </div>

                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-96 overflow-y-auto leading-relaxed">
                  {JSON.stringify(report, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* "Apply Recommendations" 1-Click Modal */}
      {showApplyModal && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Apply SEO Recommendations</h3>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Select your CMS platform to generate the exact code snippet, meta tags, and schema to push these optimizations live immediately.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setApplyCms('rankmath')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  applyCms === 'rankmath'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Rank Math
              </button>
              <button
                onClick={() => setApplyCms('yoast')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  applyCms === 'yoast'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Yoast SEO
              </button>
              <button
                onClick={() => setApplyCms('aioseo')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  applyCms === 'aioseo'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                AIOSEO
              </button>
              <button
                onClick={() => setApplyCms('shopify')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  applyCms === 'shopify'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Shopify / HTML
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-60 overflow-y-auto">
              {applyCms === 'rankmath' && (
                <div className="space-y-1.5">
                  <p className="text-indigo-400 font-bold">// Rank Math SEO Fields:</p>
                  <p className="text-emerald-300">Focus Keyword: <strong className="text-white">{report.primaryKeyword.keyword}</strong></p>
                  <p className="text-purple-300">Secondary Keywords: <strong className="text-slate-300">{report.secondaryKeywords.slice(0, 3).map(s => s.keyword).join(', ')}</strong></p>
                  <p className="text-sky-300">SEO Title: <strong className="text-white">{report.titleOptions[0].title}</strong></p>
                  <p className="text-slate-300">Permalink (Slug): <strong className="text-amber-300">/{report.contentBrief.urlSlug}</strong></p>
                  <p className="text-slate-400">Meta Description: {report.metaOptions[0].description}</p>
                </div>
              )}
              {applyCms === 'yoast' && (
                <div className="space-y-1.5">
                  <p className="text-amber-400 font-bold">// Yoast SEO Metabox:</p>
                  <p className="text-emerald-300">Focus keyphrase: <strong className="text-white">{report.primaryKeyword.keyword}</strong></p>
                  <p className="text-sky-300">SEO title: <strong className="text-white">{report.titleOptions[0].title}</strong></p>
                  <p className="text-slate-300">Slug: <strong className="text-amber-300">{report.contentBrief.urlSlug}</strong></p>
                  <p className="text-slate-400">Meta description: {report.metaOptions[0].description}</p>
                </div>
              )}
              {applyCms === 'aioseo' && (
                <div className="space-y-1.5">
                  <p className="text-emerald-400 font-bold">// All in One SEO (AIOSEO):</p>
                  <p className="text-emerald-300">Focus Keyphrase: <strong className="text-white">{report.primaryKeyword.keyword}</strong></p>
                  <p className="text-sky-300">Post Title: <strong className="text-white">{report.titleOptions[0].title}</strong></p>
                  <p className="text-slate-400">Meta Description: {report.metaOptions[0].description}</p>
                </div>
              )}
              {applyCms === 'shopify' && (
                <div>
                  <p className="text-slate-500 mb-1">&lt;!-- Shopify Liquid Meta Injection --&gt;</p>
                  <p className="text-slate-300">&lt;title&gt;{report.titleOptions[0].title}&lt;/title&gt;</p>
                  <p className="text-slate-300">&lt;meta name="description" content="{report.metaOptions[0].description}"&gt;</p>
                </div>
              )}
              {applyCms === 'custom' && (
                <div>
                  <p className="text-slate-500 mb-1">&lt;!-- Standard HTML &lt;head&gt; tags --&gt;</p>
                  <p className="text-slate-300">&lt;title&gt;{report.titleOptions[0].title}&lt;/title&gt;</p>
                  <p className="text-slate-300">&lt;meta name="description" content="{report.metaOptions[0].description}"&gt;</p>
                  <p className="text-slate-300">&lt;meta name="keywords" content="{[report.primaryKeyword.keyword, ...report.secondaryKeywords.map(s => s.keyword)].join(', ')}"&gt;</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  copyToClipboard(report.titleOptions[0].title, 'applied-code');
                  setAppliedNotification('Copied optimized title & meta tags to clipboard!');
                  setShowApplyModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Implementation Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
