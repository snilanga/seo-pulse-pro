import React, { useState, useEffect } from 'react';
import type { ClientProject, TrackedKeyword } from '../../types/seo';
import { 
  generateOnPageSeoPackage, 
  autoDetectOnPageInputFromDomain,
  parseNaturalLanguagePrompt,
  inspectAndGenerateFromDomain,
  generateWithGeminiApi,
  ONPAGE_QUICK_PRESETS,
  BUSINESS_SERVICES_MAP,
  POPULAR_CITIES,
  POPULAR_COUNTRIES,
  PAGE_TOPIC_OPTIONS,
  type OnPageSeoPackage, 
  type OnPageSeoInput,
  type QuickPreset,
  type PresetCategoryGroup
} from '../../services/onPageEngine';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  BookmarkPlus, 
  SlidersHorizontal,
  RefreshCw,
  Code2,
  Bot,
  Globe,
  Zap,
  Settings,
  Key,
  ChevronRight,
  Send,
  X,
  Wand2,
  Search
} from 'lucide-react';

interface AiOnPageOptimizerProps {
  client: ClientProject;
  onAddTrackedKeyword?: (kw: TrackedKeyword) => void;
  onNavigateToCodeInjector?: (keywordsList: string[]) => void;
}

const CATEGORY_GROUPS: PresetCategoryGroup[] = [
  'All',
  'Health & Medical',
  'Home & Local Services',
  'Food & Hospitality',
  'Professional & Legal',
  'Automotive',
  'Tech & E-Commerce',
  'Beauty & Wellness',
  'Events & Creative'
];

export const AiOnPageOptimizer: React.FC<AiOnPageOptimizerProps> = ({
  client,
  onAddTrackedKeyword,
  onNavigateToCodeInjector
}) => {
  // Primary Universal Domain Scanner State
  const [scanDomain, setScanDomain] = useState<string>(client.domain || '');
  const [activeDomain, setActiveDomain] = useState<string>(client.domain || 'colombodental.com');

  // Input fields
  const [businessType, setBusinessType] = useState<string>('Dental Clinic');
  const [serviceOrProduct, setServiceOrProduct] = useState<string>('Teeth Cleaning & Dental Implants');
  const [targetKeyword, setTargetKeyword] = useState<string>('best dentist in Colombo');
  const [city, setCity] = useState<string>('Colombo');
  const [country, setCountry] = useState<string>('Sri Lanka');
  const [pageOrTopic, setPageOrTopic] = useState<string>('Home Page');

  // Preset Filters State
  const [selectedGroup, setSelectedGroup] = useState<PresetCategoryGroup>('All');
  const [presetSearch, setPresetSearch] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<string | null>('dentist');

  // NLP AI Bot Assistant State
  const [nlPrompt, setNlPrompt] = useState<string>('');

  // Third-Party API & Model states
  const [apiMode, setApiMode] = useState<'builtin' | 'gemini'>('builtin');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('seo_pulse_gemini_api_key') || '';
  });
  const [tempApiKey, setTempApiKey] = useState<string>('');
  const [geminiModel, setGeminiModel] = useState<string>('gemini-1.5-flash');
  const [showApiModal, setShowApiModal] = useState<boolean>(false);

  // UI Interactive states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [simulateMultiH1, setSimulateMultiH1] = useState<boolean>(false);
  const [showManualForm, setShowManualForm] = useState<boolean>(false);

  // Active On-Page Package
  const [seoPackage, setSeoPackage] = useState<OnPageSeoPackage>(() => {
    const detected = autoDetectOnPageInputFromDomain(client.domain || 'colombodental.com', client.name, client.targetRegion);
    return generateOnPageSeoPackage({
      ...detected,
      domain: client.domain || 'colombodental.com',
      simulateMultiH1: false
    });
  });

  // Re-run package generation whenever simulateMultiH1 changes
  useEffect(() => {
    setSeoPackage(prev => {
      const regenerated = generateOnPageSeoPackage({
        ...prev.input,
        domain: activeDomain,
        simulateMultiH1
      });
      regenerated.targetDomain = activeDomain;
      return regenerated;
    });
  }, [simulateMultiH1, activeDomain]);

  // Synchronize with Client changes
  useEffect(() => {
    if (client && client.domain) {
      setScanDomain(client.domain);
      handle1ClickScan(client.domain, false);
    }
  }, [client.id, client.domain]);

  // 1-CLICK UNIVERSAL DOMAIN SCAN & GENERATE
  const handle1ClickScan = async (domainToScan?: string, showToast = true) => {
    const domainStr = (domainToScan || scanDomain).trim();
    if (!domainStr) return;

    setIsScanning(true);
    setIsGenerating(true);

    try {
      // Run deep domain inspection & AI classification
      const result = await inspectAndGenerateFromDomain(domainStr, client.name, client.targetRegion);
      
      setActiveDomain(result.input.domain || domainStr);
      setBusinessType(result.input.businessType);
      setServiceOrProduct(result.input.serviceOrProduct);
      setTargetKeyword(result.input.targetKeyword);
      setCity(result.input.city);
      setCountry(result.input.country);
      setPageOrTopic(result.input.pageOrTopic);
      setActivePresetId(null);

      let finalPkg = result.pkg;
      if (apiMode === 'gemini' && geminiApiKey.trim()) {
        try {
          finalPkg = await generateWithGeminiApi(geminiApiKey.trim(), geminiModel, {
            ...result.input,
            simulateMultiH1
          });
          finalPkg.targetDomain = result.input.domain || domainStr;
        } catch {
          // fallback to deep engine
          finalPkg = result.pkg;
        }
      }

      setSeoPackage(finalPkg);

      if (showToast) {
        if (result.wasLiveFetched) {
          setNotification(`🚀 Live Site Inspected & Complete SEO Package Generated for ${domainStr}!`);
        } else {
          setNotification(`🚀 AI Bot Analyzed & Generated Complete SEO Package for ${domainStr}!`);
        }
      }
    } catch (err) {
      console.error('Scan error:', err);
      const fallbackInput = autoDetectOnPageInputFromDomain(domainStr, client.name, client.targetRegion);
      const fallbackPkg = generateOnPageSeoPackage({
        ...fallbackInput,
        domain: domainStr,
        simulateMultiH1
      });
      setSeoPackage(fallbackPkg);
      setActiveDomain(domainStr);
      if (showToast) {
        setNotification(`Generated SEO Package for ${domainStr}`);
      }
    } finally {
      setIsScanning(false);
      setIsGenerating(false);
      if (showToast) {
        setTimeout(() => setNotification(null), 3500);
      }
    }
  };

  // 1-Click Apply Quick Preset
  const handleApplyPreset = (preset: QuickPreset) => {
    setActivePresetId(preset.id);
    setBusinessType(preset.businessType);
    setServiceOrProduct(preset.serviceOrProduct);
    setTargetKeyword(preset.targetKeyword);
    setCity(preset.city);
    setCountry(preset.country);
    setPageOrTopic(preset.pageOrTopic);

    const inputData: OnPageSeoInput = {
      domain: activeDomain,
      businessType: preset.businessType,
      serviceOrProduct: preset.serviceOrProduct,
      targetKeyword: preset.targetKeyword,
      city: preset.city,
      country: preset.country,
      pageOrTopic: preset.pageOrTopic,
      simulateMultiH1
    };

    const pkg = generateOnPageSeoPackage(inputData);
    pkg.targetDomain = activeDomain;
    setSeoPackage(pkg);
    setNotification(`⚡ Applied "${preset.label}" (${preset.city}) in 1 click!`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Conversational AI Prompt Bot
  const handleAskAiBot = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nlPrompt.trim()) return;
    const parsed = parseNaturalLanguagePrompt(nlPrompt, city, country);
    setBusinessType(parsed.businessType);
    setServiceOrProduct(parsed.serviceOrProduct);
    setTargetKeyword(parsed.targetKeyword);
    setCity(parsed.city);
    setCountry(parsed.country);
    setPageOrTopic(parsed.pageOrTopic);
    setActivePresetId(null);

    const inputData: OnPageSeoInput = {
      ...parsed,
      domain: activeDomain,
      simulateMultiH1
    };

    const pkg = generateOnPageSeoPackage(inputData);
    pkg.targetDomain = activeDomain;
    setSeoPackage(pkg);
    setNotification(`🤖 AI Bot configured & generated for: "${nlPrompt.slice(0, 30)}..."`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Manual Form Submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputData: OnPageSeoInput = {
      domain: activeDomain,
      businessType,
      serviceOrProduct,
      targetKeyword,
      city,
      country,
      pageOrTopic,
      simulateMultiH1
    };
    const pkg = generateOnPageSeoPackage(inputData);
    pkg.targetDomain = activeDomain;
    setSeoPackage(pkg);
    setNotification('Custom On-Page SEO Package updated successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setGeminiApiKey(trimmed);
    localStorage.setItem('seo_pulse_gemini_api_key', trimmed);
    if (trimmed) {
      setApiMode('gemini');
      setNotification('🔮 Google Gemini API Activated! Live AI Mode Enabled.');
    } else {
      setApiMode('builtin');
      setNotification('Switched to Built-in Deep Intelligence AI Engine');
    }
    setShowApiModal(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTrackPrimary = () => {
    if (!onAddTrackedKeyword) return;
    const kw: TrackedKeyword = {
      id: `kw-onpage-${Date.now()}`,
      clientId: client.id,
      keyword: seoPackage.primaryKeyword,
      searchVolume: 18500,
      difficulty: 44,
      cpc: 4.80,
      intent: 'Commercial',
      tags: ['On-Page Target', 'Primary KW'],
      updatedAt: new Date().toISOString().split('T')[0],
      googlePosition: {
        engine: 'google',
        device: 'desktop',
        position: 3,
        previousPosition: 7,
        url: `https://${activeDomain}${seoPackage.urlSlug}`,
        serpFeatures: ['Featured Snippet'],
        page1: true
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: 2,
        previousPosition: 5,
        url: `https://${activeDomain}${seoPackage.urlSlug}`,
        serpFeatures: [],
        page1: true
      },
      history: [
        { date: 'Aug 1', googlePos: 7, bingPos: 5 },
        { date: 'Sep 1', googlePos: 3, bingPos: 2 }
      ]
    };

    onAddTrackedKeyword(kw);
    setNotification(`"${seoPackage.primaryKeyword}" added to Rank Tracker for ${activeDomain}!`);
    setTimeout(() => setNotification(null), 2500);
  };

  // Filtered Presets
  const filteredPresets = ONPAGE_QUICK_PRESETS.filter(p => {
    const matchesGroup = selectedGroup === 'All' || p.categoryGroup === selectedGroup;
    const matchesSearch = !presetSearch.trim() || 
      p.label.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.businessType.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.city.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(presetSearch.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                1-Click AI On-Page SEO Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Client: {client.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                Domain: {activeDomain}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                apiMode === 'gemini' && geminiApiKey
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {apiMode === 'gemini' && geminiApiKey ? <Bot className="w-3 h-3 text-purple-400" /> : <Zap className="w-3 h-3 text-emerald-400" />}
                {apiMode === 'gemini' && geminiApiKey ? `Google Gemini (${geminiModel})` : 'Deep Intelligence AI'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Complete AI On-Page SEO Optimization Package
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Enter any domain or choose any of 36 business categories to generate a complete, 9-module, production-ready On-Page SEO package in 1 single click.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={() => {
              setTempApiKey(geminiApiKey);
              setShowApiModal(true);
            }}
            className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 shadow-md"
            title="Configure 3rd-party Google Gemini API or Built-in Engine"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Engine Settings</span>
          </button>

          <button
            onClick={() => {
              const fullText = `ON-PAGE SEO PACKAGE FOR ${activeDomain}:\nPrimary Keyword: ${seoPackage.primaryKeyword}\nTitle: ${seoPackage.titleTag}\nMeta: ${seoPackage.metaDescription}\nH1: ${seoPackage.h1Heading}\nURL: https://${activeDomain}${seoPackage.urlSlug}`;
              copyToClipboard(fullText, 'full-package');
              setNotification('Complete On-Page SEO Package copied to clipboard!');
              setTimeout(() => setNotification(null), 2500);
            }}
            className="px-3.5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-indigo-500/40 shadow-md"
          >
            {copiedKey === 'full-package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'full-package' ? 'Copied!' : 'Copy Package'}</span>
          </button>

          {onNavigateToCodeInjector && (
            <button
              onClick={() => onNavigateToCodeInjector([seoPackage.primaryKeyword, ...seoPackage.secondaryKeywords])}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Deploy to Site Code</span>
            </button>
          )}
        </div>
      </div>

      {/* 🚀 HERO SECTION: 1-CLICK UNIVERSAL DOMAIN SCANNER */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-indigo-500/50 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>1-Click Universal Auto-Scan</span>
              </span>
              <h3 className="text-base font-black text-white">Enter Any Domain or Website URL</h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Type or paste any website: the AI Bot automatically inspects the business, detects location, and generates the entire SEO package in 1 click!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setScanDomain(client.domain);
                handle1ClickScan(client.domain);
              }}
              className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Use Current Client ({client.domain})</span>
            </button>
          </div>
        </div>

        {/* Big Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handle1ClickScan();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Globe className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={scanDomain}
              onChange={(e) => setScanDomain(e.target.value)}
              placeholder="e.g. colombodental.com, miamiroofer.com, or yoursite.com"
              className="w-full bg-slate-950/90 border-2 border-indigo-500/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 font-mono font-bold focus:outline-none focus:border-indigo-400 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning || !scanDomain.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-400 hover:to-pink-500 disabled:opacity-40 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition active:scale-98 shrink-0"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Scanning & Optimizing...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-amber-300" />
                <span>🚀 1-Click Auto Scan & Full AI SEO Generation</span>
              </>
            )}
          </button>
        </form>

        {/* Live Active Scanned Domain Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-indigo-500/20">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-400">Target Scanned Domain:</span>
            <span className="font-mono font-bold text-indigo-300 px-2.5 py-0.5 bg-indigo-950/60 rounded-lg border border-indigo-500/30">
              https://{activeDomain}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{seoPackage.liveSiteExtracted ? 'Live DOM Inspected' : 'AI Domain Classified'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Category: <strong className="text-white">{businessType}</strong></span>
            <span>•</span>
            <span>Location: <strong className="text-white">{city}, {country}</strong></span>
          </div>
        </div>
      </div>

      {/* 💬 ASK AI BOT: CONVERSATIONAL ASSISTANT */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-purple-500/30 bg-slate-900/90 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Ask AI Bot (Conversational English)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Describe your business in plain words (e.g. <span className="text-purple-300">"Cosmetic dentist in Galle for teeth whitening and veneers"</span>).
          </p>
        </div>

        <form onSubmit={handleAskAiBot} className="flex gap-2 flex-1 max-w-xl">
          <input
            type="text"
            value={nlPrompt}
            onChange={(e) => setNlPrompt(e.target.value)}
            placeholder="e.g. Luxury boutique hotel in Galle with ocean view suites"
            className="flex-1 bg-slate-950 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            disabled={isGenerating || !nlPrompt.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
        </form>
      </div>

      {/* 🏢 1-CLICK ALL BUSINESS CATEGORIES PRESETS (36 CATEGORIES) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1-Click Business Category Presets ({ONPAGE_QUICK_PRESETS.length} Industries)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click ANY business category below to instantly generate a complete, ready-to-deploy On-Page SEO package.
            </p>
          </div>

          {/* Quick Search across 36 categories */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={presetSearch}
              onChange={(e) => setPresetSearch(e.target.value)}
              placeholder="Search category (e.g. roof, legal)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category Group Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_GROUPS.map((group) => {
            const count = group === 'All' 
              ? ONPAGE_QUICK_PRESETS.length 
              : ONPAGE_QUICK_PRESETS.filter(p => p.categoryGroup === group).length;
            const isSelected = selectedGroup === group;

            return (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{group}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {filteredPresets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 rounded-2xl text-left transition flex flex-col items-start justify-between gap-2 border group relative ${
                  isActive 
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400' 
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{preset.icon}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-indigo-300 font-mono">
                    {preset.city}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-200 line-clamp-1 leading-tight">
                    {preset.label}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {preset.serviceOrProduct}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ADVANCED / MANUAL CONFIGURATION ACCORDION */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div 
          onClick={() => setShowManualForm(!showManualForm)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Inspect or Fine-Tune Parameters (Optional)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {showManualForm ? 'Click to Collapse' : 'Click to View / Edit'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showManualForm ? 'rotate-90' : ''}`} />
          </div>
        </div>

        {showManualForm && (
          <form onSubmit={handleManualSubmit} className="p-6 pt-2 border-t border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Business Type with Auto Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Business Type <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[9px] text-indigo-400 font-medium">Auto Dropdown</span>
                </div>
                <select
                  value={businessType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setBusinessType(newType);
                    const defaultServices = BUSINESS_SERVICES_MAP[newType];
                    if (defaultServices && defaultServices.length > 0) {
                      setServiceOrProduct(defaultServices[0]);
                    }
                    setTargetKeyword(`best ${newType.toLowerCase()} in ${city}`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {CATEGORY_GROUPS.filter(g => g !== 'All').map((group) => (
                    <optgroup key={group} label={group} className="bg-slate-900 text-indigo-300 font-bold">
                      {ONPAGE_QUICK_PRESETS.filter(p => p.categoryGroup === group).map((preset) => (
                        <option key={preset.id} value={preset.businessType} className="bg-slate-950 text-white font-normal">
                          {preset.icon} {preset.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="Or type custom business type..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* 2. Service or Product with Auto Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Service or Product <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[9px] text-indigo-400 font-medium">Auto Dropdown</span>
                </div>
                <select
                  value={serviceOrProduct}
                  onChange={(e) => setServiceOrProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {(BUSINESS_SERVICES_MAP[businessType] || [
                    'Specialized Consultations & Solutions',
                    'Standard Professional Services',
                    '24/7 Emergency Support',
                    'Premium Packages & Repairs'
                  ]).map((svc, idx) => (
                    <option key={idx} value={svc} className="bg-slate-950 text-white">
                      {svc}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={serviceOrProduct}
                  onChange={(e) => setServiceOrProduct(e.target.value)}
                  placeholder="Or type custom service or product..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* 3. Target Keyword with Auto Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Target Keyword
                  </label>
                  <span className="text-[9px] text-indigo-400 font-medium">Auto Dropdown</span>
                </div>
                <select
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="" className="bg-slate-950 text-slate-400">✨ Leave Blank to Auto-Pick Best Keyword</option>
                  <option value={`best ${businessType.toLowerCase()} in ${city}`}>best {businessType.toLowerCase()} in {city}</option>
                  <option value={`top rated ${businessType.toLowerCase()} in ${city}`}>top rated {businessType.toLowerCase()} in {city}</option>
                  <option value={`${serviceOrProduct.toLowerCase()} in ${city}`}>{serviceOrProduct.toLowerCase()} in {city}</option>
                  <option value={`affordable ${serviceOrProduct.toLowerCase()} in ${city}`}>affordable {serviceOrProduct.toLowerCase()} in {city}</option>
                  <option value={`emergency ${businessType.toLowerCase()} in ${city} open now`}>emergency {businessType.toLowerCase()} in {city} open now</option>
                  <option value={`trusted ${businessType.toLowerCase()} specialist in ${city}`}>trusted {businessType.toLowerCase()} specialist in {city}</option>
                </select>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="Or type custom target keyword..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* 4. City / Location with Auto Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    City / Location <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[9px] text-indigo-400 font-medium">Auto Dropdown</span>
                </div>
                <select
                  value={city}
                  onChange={(e) => {
                    const selectedCity = e.target.value;
                    setCity(selectedCity);
                    const found = POPULAR_CITIES.find(c => c.city === selectedCity);
                    if (found) {
                      setCountry(found.country);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {POPULAR_CITIES.map((c, idx) => (
                    <option key={idx} value={c.city} className="bg-slate-950 text-white">
                      📍 {c.city}, {c.country}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Or type custom city..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* 5. Country with Auto Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Country
                  </label>
                  <span className="text-[9px] text-indigo-400 font-medium">Auto Dropdown</span>
                </div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {POPULAR_COUNTRIES.map((cnt, idx) => (
                    <option key={idx} value={cnt} className="bg-slate-950 text-white">
                      🌍 {cnt}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Or type custom country..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* 6. Page / Topic with Auto Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Page / Topic
                  </label>
                  <span className="text-[9px] text-indigo-400 font-medium">Auto Dropdown</span>
                </div>
                <select
                  value={pageOrTopic}
                  onChange={(e) => setPageOrTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {PAGE_TOPIC_OPTIONS.map((topicOpt, idx) => (
                    <option key={idx} value={topicOpt} className="bg-slate-950 text-white">
                      📄 {topicOpt}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={pageOrTopic}
                  onChange={(e) => setPageOrTopic(e.target.value)}
                  placeholder="Or type custom page / topic..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateMultiH1}
                  onChange={(e) => setSimulateMultiH1(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Simulate Multiple H1 Headings Test (shows audit alert & updates checklist)</span>
              </label>

              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Regenerate Package</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 9 DEDICATED OUTPUT MODULES */}
      <div className="space-y-6">

        {/* 1. PRIMARY KEYWORD & SECONDARY KEYWORDS */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h3 className="text-base font-black text-white">Primary Keyword & Secondary Semantic Keywords</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Identified based on search intent, local relevance, and commercial search demand</p>
            </div>

            <button
              onClick={handleTrackPrimary}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto shadow-md"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Add to Rank Tracker</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Target Primary Keyword</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 flex items-center gap-2">
                <span>{seoPackage.primaryKeyword}</span>
                <button 
                  onClick={() => copyToClipboard(seoPackage.primaryKeyword, 'primary-kw')}
                  className="p-1 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition"
                >
                  {copiedKey === 'primary-kw' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-1">{seoPackage.primaryKeywordRationale}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono">
                Intent: <strong className="text-emerald-400">Commercial / Local</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono">
                Est. Demand: <strong className="text-indigo-400">High</strong>
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Related & Secondary Keywords (Naturally usable across headings & body)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {seoPackage.secondaryKeywords.map((sec, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition"
                >
                  <span className="text-xs text-slate-200 font-medium truncate">{sec}</span>
                  <button
                    onClick={() => copyToClipboard(sec, `sec-${idx}`)}
                    className="text-slate-500 hover:text-slate-200 p-1 transition"
                  >
                    {copiedKey === `sec-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. SEO TITLE TAG */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <h3 className="text-base font-black text-white">SEO Title Tag</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Optimized for 50–60 characters with primary keyword frontloaded for click encouragement</p>
            </div>

            <button
              onClick={() => copyToClipboard(seoPackage.titleTag, 'title-tag')}
              className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-blue-500/30 self-start sm:self-auto"
            >
              {copiedKey === 'title-tag' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Title</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-sm sm:text-base font-bold text-white font-mono leading-relaxed">
              {seoPackage.titleTag}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400">
                Character Count: <strong className="text-white font-mono">{seoPackage.titleCharCount}</strong>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                seoPackage.titleStatus === 'Good' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                SEO Status: {seoPackage.titleStatusIcon} {seoPackage.titleStatus} (Target: 50–60 chars)
              </span>
              <span className="text-slate-400 text-[11px]">
                {seoPackage.titleTip}
              </span>
            </div>
          </div>
        </div>

        {/* 3. META DESCRIPTION */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <h3 className="text-base font-black text-white">Meta Description</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Crafted within 120–160 characters with clear offering, location signals, and a compelling CTA</p>
            </div>

            <button
              onClick={() => copyToClipboard(seoPackage.metaDescription, 'meta-desc')}
              className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-purple-500/30 self-start sm:self-auto"
            >
              {copiedKey === 'meta-desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Meta Description</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-sm text-slate-200 font-normal leading-relaxed">
              {seoPackage.metaDescription}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400">
                Character Count: <strong className="text-white font-mono">{seoPackage.metaCharCount}</strong>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                seoPackage.metaStatus === 'Good' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                SEO Status: {seoPackage.metaStatusIcon} {seoPackage.metaStatus} (Target: 120–160 chars)
              </span>
              <span className="text-slate-400 text-[11px]">
                {seoPackage.metaTip}
              </span>
            </div>
          </div>
        </div>

        {/* 4. H1 HEADING (SINGLE H1 STANDARD & MULTIPLE H1s TEST) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-black">
                  4
                </span>
                <h3 className="text-base font-black text-white">Primary H1 Heading</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Enforces exactly one primary H1 that matches search intent</p>
            </div>

            <button
              onClick={() => copyToClipboard(seoPackage.h1Heading, 'h1-head')}
              className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-emerald-500/30 self-start sm:self-auto"
            >
              {copiedKey === 'h1-head' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy H1</span>
            </button>
          </div>

          {/* Multiple H1 Warning Banner */}
          {simulateMultiH1 && (
            <div className="p-3.5 bg-amber-950/80 border border-amber-500/50 rounded-2xl flex items-center gap-2.5 text-amber-200 text-xs font-semibold animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{seoPackage.h1WarningNotice}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Main Primary H1 Heading Tag
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              {seoPackage.h1Heading}
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Descriptive, front-loads the target keyword, and directly aligns with the user's commercial search intent.
            </p>
          </div>
        </div>

        {/* 5. H2 / H3 CONTENT STRUCTURE */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-black">
                  5
                </span>
                <h3 className="text-base font-black text-white">H2 / H3 Content Hierarchy</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Logical heading hierarchy ensuring comprehensive topical depth and scannability</p>
            </div>

            <button
              onClick={() => {
                const outline = seoPackage.headingStructure.map(h => `H2: ${h.h2}\n${(h.h3s || []).map(sub => `  H3: ${sub}`).join('\n')}`).join('\n\n');
                copyToClipboard(outline, 'headings-all');
              }}
              className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-cyan-500/30"
            >
              {copiedKey === 'headings-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Outline</span>
            </button>
          </div>

          <div className="space-y-3">
            {seoPackage.headingStructure.map((sec, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    H2
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white">{sec.h2}</span>
                </div>

                {sec.h3s && sec.h3s.length > 0 && (
                  <div className="pl-6 space-y-1.5 border-l-2 border-slate-800 ml-3">
                    {sec.h3s.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-400">
                          H3
                        </span>
                        <span className="text-xs text-slate-300">{sub}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 6. ON-PAGE SEO CHECKLIST (16 POINTS) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xs font-black">
                  6
                </span>
                <h3 className="text-base font-black text-white">16-Point On-Page SEO Checklist</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Comprehensive audit verifying search engine readiness across all key optimization factors</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400">
                Score: {seoPackage.checklistScore}% Passed ({seoPackage.checklist.filter(c => c.passed).length}/16)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${seoPackage.checklistScore}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {seoPackage.checklist.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5"
              >
                <div className="mt-0.5 shrink-0">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.passed ? (
                      <span className="text-[10px] text-emerald-400 font-normal">Passed</span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-normal">Action Required</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">{item.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. SEO URL / SLUG */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center text-xs font-black">
                  7
                </span>
                <h3 className="text-base font-black text-white">SEO URL / Permastruct Slug</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Clean, lowercase, hyphen-separated permalink with zero keyword stuffing</p>
            </div>

            <button
              onClick={() => copyToClipboard(`https://${activeDomain}${seoPackage.urlSlug}`, 'url-slug')}
              className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-rose-500/30 self-start sm:self-auto"
            >
              {copiedKey === 'url-slug' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Full URL</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-black text-white font-mono">
                https://{activeDomain}<span className="text-rose-400 font-bold">{seoPackage.urlSlug}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{seoPackage.slugRationale}</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-bold shrink-0">
              ✅ SEO Friendly
            </span>
          </div>
        </div>

        {/* 8. IMAGE ALT TEXT RECOMMENDATIONS */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-black">
                8
              </span>
              <h3 className="text-base font-black text-white">Image ALT Text Generator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Descriptive, accessibility-compliant ALT tags accurately describing images without keyword stuffing</p>
          </div>

          <div className="space-y-3">
            {seoPackage.imageAlts.map((img, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-indigo-400">{img.imageLabel}</div>
                  <div className="text-xs font-mono text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 inline-block">
                    alt="{img.recommendedAlt}"
                  </div>
                  <div className="text-[11px] text-slate-400">{img.rationale}</div>
                </div>

                <button
                  onClick={() => copyToClipboard(`alt="${img.recommendedAlt}"`, `alt-${idx}`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 self-start sm:self-auto"
                >
                  {copiedKey === `alt-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy ALT</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 9. SEO CONTENT RECOMMENDATIONS & SCORE */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center text-xs font-black">
                  9
                </span>
                <h3 className="text-base font-black text-white">SEO Content Recommendations & Content Score</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Actionable feedback focused on value, trust, and search intent (zero keyword repetition/stuffing)</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">Content Score:</span>
              <span className="text-sm font-black text-emerald-400 font-mono">{seoPackage.contentScore}/100</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Quality Standard:</strong> The recommendations below enhance topical depth, clarity, and trust signals with zero artificial keyword density inflation.
            </span>
          </div>

          <div className="space-y-2.5">
            {seoPackage.contentRecommendations.map((rec) => (
              <div 
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3"
              >
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                  rec.category === 'Critical' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : rec.category === 'Warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {rec.category}
                </span>

                <div className="space-y-0.5 flex-1">
                  <div className="text-xs font-bold text-white">{rec.text}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    <strong className="text-indigo-300">Action:</strong> {rec.actionableStep}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* THIRD-PARTY API & AI MODEL MODAL */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">AI Engine & 3rd-Party API Settings</h3>
              </div>
              <button 
                onClick={() => setShowApiModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Select Active AI Engine
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setApiMode('builtin')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      apiMode === 'builtin' 
                        ? 'bg-emerald-500/20 border-emerald-500 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>Built-in Deep AI</span>
                    </div>
                    <p className="text-[11px] text-slate-400">100% Free, instant, zero setup, built-in heuristics.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApiMode('gemini')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      apiMode === 'gemini' 
                        ? 'bg-purple-500/20 border-purple-500 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>Google Gemini API</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Live 3rd-party LLM with dynamic creative reasoning.</p>
                  </button>
                </div>
              </div>

              {apiMode === 'gemini' && (
                <div className="space-y-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                  <div>
                    <label className="block text-purple-300 font-bold mb-1 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5" />
                      <span>Google Gemini API Key</span>
                    </label>
                    <input
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-purple-400"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Saved safely in your browser's local storage. Never sent to any intermediate server.
                    </p>
                  </div>

                  <div>
                    <label className="block text-purple-300 font-bold mb-1">Gemini Model</label>
                    <select
                      value={geminiModel}
                      onChange={(e) => setGeminiModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast & Recommended)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Speed)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                Save & Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
