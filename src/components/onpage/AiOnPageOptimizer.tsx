import React, { useState } from 'react';
import type { ClientProject, TrackedKeyword } from '../../types/seo';
import { 
  generateOnPageSeoPackage, 
  type OnPageSeoPackage 
} from '../../services/onPageEngine';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ListChecks, 
  BookmarkPlus, 
  SlidersHorizontal,
  RefreshCw,
  Code2
} from 'lucide-react';

interface AiOnPageOptimizerProps {
  client: ClientProject;
  onAddTrackedKeyword?: (kw: TrackedKeyword) => void;
  onNavigateToCodeInjector?: (keywordsList: string[]) => void;
}

export const AiOnPageOptimizer: React.FC<AiOnPageOptimizerProps> = ({
  client,
  onAddTrackedKeyword,
  onNavigateToCodeInjector
}) => {
  // Input fields
  const [businessType, setBusinessType] = useState<string>(client.industry || 'Dental Clinic');
  const [serviceOrProduct, setServiceOrProduct] = useState<string>('Teeth Cleaning & Dental Implants');
  const [targetKeyword, setTargetKeyword] = useState<string>('best dentist in Colombo');
  const [city, setCity] = useState<string>('Colombo');
  const [country, setCountry] = useState<string>(client.targetRegion?.split(' ')[0] || 'Sri Lanka');
  const [pageOrTopic, setPageOrTopic] = useState<string>('Home Page / Services');

  // Interactive UI state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [simulateMultiH1, setSimulateMultiH1] = useState<boolean>(false);

  // Active On-Page Package
  const [seoPackage, setSeoPackage] = useState<OnPageSeoPackage>(() => {
    return generateOnPageSeoPackage({
      businessType: client.industry || 'Dental Clinic',
      serviceOrProduct: 'Teeth Cleaning & Dental Implants',
      targetKeyword: 'best dentist in Colombo',
      city: 'Colombo',
      country: client.targetRegion?.split(' ')[0] || 'Sri Lanka',
      pageOrTopic: 'Home Page / Services'
    });
  });

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateOnPageSeoPackage({
        businessType,
        serviceOrProduct,
        targetKeyword,
        city,
        country,
        pageOrTopic
      });
      setSeoPackage(generated);
      setIsGenerating(false);
      setNotification('AI On-Page SEO Package generated successfully!');
      setTimeout(() => setNotification(null), 3000);
    }, 250);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
        url: `https://${client.domain}${seoPackage.urlSlug}`,
        serpFeatures: ['Featured Snippet'],
        page1: true
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: 2,
        previousPosition: 5,
        url: `https://${client.domain}${seoPackage.urlSlug}`,
        serpFeatures: [],
        page1: true
      },
      history: [
        { date: 'Aug 1', googlePos: 7, bingPos: 5 },
        { date: 'Sep 1', googlePos: 3, bingPos: 2 }
      ]
    };

    onAddTrackedKeyword(kw);
    setNotification(`"${seoPackage.primaryKeyword}" added to Rank Tracker!`);
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
                AI On-Page SEO Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Client: {client.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                16-Point Checklist Validated
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Complete AI On-Page SEO Optimization Package
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Generates high-CTR Title tags, Meta descriptions, single H1 headings, structured H2/H3 outlines, descriptive Image ALT texts, clean URL slugs, and actionable content recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={() => {
              const fullText = `ON-PAGE SEO PACKAGE:\nPrimary Keyword: ${seoPackage.primaryKeyword}\nTitle: ${seoPackage.titleTag}\nMeta: ${seoPackage.metaDescription}\nH1: ${seoPackage.h1Heading}\nSlug: ${seoPackage.urlSlug}`;
              copyToClipboard(fullText, 'full-package');
              setNotification('Complete On-Page SEO Package copied to clipboard!');
              setTimeout(() => setNotification(null), 2500);
            }}
            className="px-4 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-indigo-500/40 shadow-md"
          >
            {copiedKey === 'full-package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'full-package' ? 'Copied Package!' : 'Copy Full Package'}</span>
          </button>

          {onNavigateToCodeInjector && (
            <button
              onClick={() => onNavigateToCodeInjector([seoPackage.primaryKeyword, ...seoPackage.secondaryKeywords])}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Deploy to Site Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Generator Input Form */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              On-Page SEO Configuration
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Enter business details to synthesize a tailored On-Page SEO package
          </span>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Business Type <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Dental Clinic, Hotel, Lawyer, Restaurant"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Service or Product <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={serviceOrProduct}
              onChange={(e) => setServiceOrProduct(e.target.value)}
              placeholder="e.g. Teeth Cleaning, Implants, Luxury Suites"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Target Keyword (or Leave Blank to Auto-Pick)
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g. best dentist in Colombo"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              City / Location <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Colombo, Austin, Toronto"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Sri Lanka, United States"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Page / Topic
            </label>
            <input
              type="text"
              value={pageOrTopic}
              onChange={(e) => setPageOrTopic(e.target.value)}
              placeholder="e.g. Home Page, Service Landing Page"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="lg:col-span-3 flex items-center justify-between pt-2">
            <label className="inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateMultiH1}
                onChange={(e) => setSimulateMultiH1(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Simulate Multiple H1 Headings Test (shows audit alert)</span>
            </label>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-98"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Generate On-Page Package</span>
            </button>
          </div>
        </form>
      </div>

      {/* 9 Core On-Page Output Modules */}
      <div className="space-y-6">
        
        {/* Module 1: Primary Keyword & Related Keywords */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                Module 1: Primary Target Keyword
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                <span>{seoPackage.primaryKeyword}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Top Search Demand
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(seoPackage.primaryKeyword, 'primary-kw')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition border border-slate-700"
              >
                {copiedKey === 'primary-kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Keyword</span>
              </button>
              <button
                onClick={handleTrackPrimary}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <BookmarkPlus className="w-3 h-3" />
                <span>Track Term</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            <strong className="text-white">Why Selected: </strong> {seoPackage.primaryKeywordRationale}
          </p>

          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2">
              Related / Secondary Keywords (Use naturally throughout headings and body):
            </span>
            <div className="flex flex-wrap gap-2">
              {seoPackage.secondaryKeywords.map((sk, idx) => (
                <button
                  key={idx}
                  onClick={() => copyToClipboard(sk, `sec-${idx}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                  title="Click to copy"
                >
                  <span>{sk}</span>
                  {copiedKey === `sec-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Module 2 & 3: SEO Title Tag & Meta Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Module 2: SEO Title Tag */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Module 2: SEO Title Tag (50–60 Chars)
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                  seoPackage.titleStatus === 'Good'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {seoPackage.titleStatusIcon} SEO Status: {seoPackage.titleStatus}
                </span>
              </div>

              <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-white text-sm font-bold">
                {seoPackage.titleTag}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Character Count: <strong className="text-white font-mono">{seoPackage.titleCharCount} chars</strong></span>
                <span className="text-emerald-400 font-medium">Ideal Range: 50–60 chars</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{seoPackage.titleTip}</p>
            </div>

            <button
              onClick={() => copyToClipboard(seoPackage.titleTag, 'title-tag')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              {copiedKey === 'title-tag' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'title-tag' ? 'Title Copied!' : 'Copy Title'}</span>
            </button>
          </div>

          {/* Module 3: Meta Description */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Module 3: Meta Description (120–160 Chars)
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                  seoPackage.metaStatus === 'Good'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {seoPackage.metaStatusIcon} SEO Status: {seoPackage.metaStatus}
                </span>
              </div>

              <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-slate-200 text-xs sm:text-sm leading-relaxed">
                {seoPackage.metaDescription}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Character Count: <strong className="text-white font-mono">{seoPackage.metaCharCount} chars</strong></span>
                <span className="text-emerald-400 font-medium">Ideal Range: 120–160 chars</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{seoPackage.metaTip}</p>
            </div>

            <button
              onClick={() => copyToClipboard(seoPackage.metaDescription, 'meta-desc')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              {copiedKey === 'meta-desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'meta-desc' ? 'Meta Copied!' : 'Copy Meta Description'}</span>
            </button>
          </div>
        </div>

        {/* Module 4 & 5: H1 Heading & H2/H3 Structure */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
          {/* Module 4: Single H1 Heading */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Module 4: Primary H1 Heading
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                1 H1 Recommended
              </span>
            </div>

            {/* Multiple H1 Warning Alert if detected */}
            {simulateMultiH1 && (
              <div className="p-3.5 mb-3 bg-amber-950/60 border border-amber-500/50 rounded-2xl text-amber-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{seoPackage.h1WarningNotice}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="font-extrabold text-white text-base sm:text-lg">
                &lt;h1&gt; {seoPackage.h1Heading} &lt;/h1&gt;
              </div>
              <button
                onClick={() => copyToClipboard(seoPackage.h1Heading, 'h1-heading')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto border border-slate-700 transition"
              >
                {copiedKey === 'h1-heading' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy H1</span>
              </button>
            </div>
          </div>

          {/* Module 5: H2 / H3 Content Structure */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Module 5: Recommended H2 / H3 Heading Structure
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {seoPackage.headingStructure.length} Main H2 Sections
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {seoPackage.headingStructure.map((sec, i) => (
                <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">H2</span>
                    <span className="text-white text-sm">{sec.h2}</span>
                  </div>

                  {sec.h3s && sec.h3s.length > 0 && (
                    <div className="pl-6 space-y-1.5 pt-1 border-l border-slate-800">
                      {sec.h3s.map((h3, j) => (
                        <div key={j} className="flex items-center gap-2 text-slate-300 text-xs">
                          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono">H3</span>
                          <span>{h3}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module 6: On-Page SEO Checklist (16 verification points) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Module 6: Comprehensive 16-Point On-Page SEO Checklist
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                <ListChecks className="w-5 h-5 text-emerald-400" />
                <span>On-Page Quality Verification</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-400">{seoPackage.checklistScore}%</span>
              <span className="text-xs text-slate-400 font-semibold">Audit Passed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {seoPackage.checklist.map((item) => (
              <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block">{item.label}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2" title={item.explanation}>
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 7 & 8: SEO URL Slug & Image ALT Texts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Module 7: SEO URL / Slug */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Module 7: SEO URL / Slug
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Clean Permalinks
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-emerald-400 text-sm font-bold truncate">
                https://{client.domain}{seoPackage.urlSlug}
              </span>
              <button
                onClick={() => copyToClipboard(seoPackage.urlSlug, 'slug-copy')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg shrink-0 border border-slate-700 transition"
              >
                {copiedKey === 'slug-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Requirements: </strong> Short, lowercase, hyphen-separated, avoids stopwords, zero keyword stuffing.
            </p>
          </div>

          {/* Module 8: Image ALT Text */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Module 8: Descriptive Image ALT Text
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                No Keyword Stuffing
              </span>
            </div>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {seoPackage.imageAlts.map((img, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold block">{img.imageLabel}</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-white font-bold">{img.recommendedAlt}</span>
                    <button
                      onClick={() => copyToClipboard(img.recommendedAlt, `alt-${i}`)}
                      className="text-slate-500 hover:text-white"
                      title="Copy ALT Text"
                    >
                      {copiedKey === `alt-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{img.rationale}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module 9: SEO Content Recommendations (Content Score 82/100) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Module 9: SEO Content Recommendations
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                <span>Page Content Audit &amp; Action Plan</span>
              </h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{seoPackage.contentScore}</span>
              <span className="text-xs text-slate-500 font-bold">/ 100 Content Score</span>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Actionable editorial improvements to increase search intent fit without keyword stuffing:
          </p>

          <div className="space-y-2.5">
            {seoPackage.contentRecommendations.map((rec) => (
              <div key={rec.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                      rec.category === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : rec.category === 'Warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {rec.category}
                    </span>
                    <span className="text-xs font-bold text-white">{rec.text}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-0 sm:pl-16">
                    👉 <strong className="text-slate-300">Fix:</strong> {rec.actionableStep}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
