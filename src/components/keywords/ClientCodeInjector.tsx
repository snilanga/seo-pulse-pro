import React, { useState, useMemo } from 'react';
import type { ClientProject, TrackedKeyword } from '../../types/seo';
import { 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  FileCode, 
  HelpCircle,
  Globe,
  Tag,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface ClientCodeInjectorProps {
  client: ClientProject;
  keywordsList?: string[];
  trackedKeywords?: TrackedKeyword[];
}

// Maps client industry to accurate Schema.org structure & descriptive context
function getSchemaOrgDetails(industry: string) {
  const ind = (industry || '').toLowerCase();
  
  if (ind.includes('health') || ind.includes('telehealth') || ind.includes('telemedicine') || ind.includes('medical') || ind.includes('clinic')) {
    return {
      schemaType: 'MedicalBusiness',
      secondaryFieldKey: 'medicalSpecialty',
      secondaryFieldValue: 'Telehealth & Clinical Care',
      contextLabel: 'Healthcare & Clinical Services',
      leadVerb: 'Discover certified care with'
    };
  }
  if (ind.includes('decor') || ind.includes('commerce') || ind.includes('retail') || ind.includes('shop') || ind.includes('fashion')) {
    return {
      schemaType: 'OnlineStore',
      secondaryFieldKey: 'priceRange',
      secondaryFieldValue: '$$',
      contextLabel: 'E-Commerce & Retail Products',
      leadVerb: 'Shop premium collections at'
    };
  }
  if (ind.includes('tech') || ind.includes('saas') || ind.includes('cloud') || ind.includes('software') || ind.includes('security') || ind.includes('it')) {
    return {
      schemaType: 'Corporation',
      secondaryFieldKey: 'knowsAbout',
      secondaryFieldValue: 'Cloud Infrastructure & Enterprise Security',
      contextLabel: 'Technology & Enterprise Solutions',
      leadVerb: 'Accelerate digital transformation with'
    };
  }
  if (ind.includes('local') || ind.includes('clean') || ind.includes('plumb') || ind.includes('repair') || ind.includes('construct') || ind.includes('legal')) {
    return {
      schemaType: 'LocalBusiness',
      secondaryFieldKey: 'priceRange',
      secondaryFieldValue: '$$',
      contextLabel: 'Local Professional Services',
      leadVerb: 'Trusted certified local specialists at'
    };
  }

  return {
    schemaType: 'Organization',
    secondaryFieldKey: 'knowsAbout',
    secondaryFieldValue: `${industry || 'Professional Services'}`,
    contextLabel: 'Professional Enterprise & Services',
    leadVerb: 'Explore premier solutions from'
  };
}

export const ClientCodeInjector: React.FC<ClientCodeInjectorProps> = ({
  client,
  keywordsList = [],
  trackedKeywords = []
}) => {
  const [activeTab, setActiveTab] = useState<'head' | 'body' | 'schema' | 'guide'>('head');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Available keyword pool derived dynamically from client's tracked keywords and props
  const availableKeywords = useMemo(() => {
    const list: string[] = [];
    
    // 1. First priority: explicit keywordsList passed down
    if (keywordsList && keywordsList.length > 0) {
      keywordsList.forEach(k => {
        if (k && !list.includes(k.trim())) list.push(k.trim());
      });
    }

    // 2. Tracked keywords for this client
    if (trackedKeywords && trackedKeywords.length > 0) {
      trackedKeywords.forEach(tk => {
        if (tk.keyword && !list.includes(tk.keyword.trim())) {
          list.push(tk.keyword.trim());
        }
      });
    }

    // 3. Fallback smart keywords based on client industry & brand
    if (list.length === 0) {
      const brandLower = client.name.toLowerCase();
      const indLower = client.industry.toLowerCase();
      list.push(`${brandLower} ${indLower}`);
      list.push(`best ${indLower} in ${client.targetRegion || 'US'}`);
      list.push(`top rated ${indLower} solutions`);
    }

    return list;
  }, [keywordsList, trackedKeywords, client]);

  // Selected primary & secondary keywords
  const [selectedPrimary, setSelectedPrimary] = useState<string>('');
  const [customKeyword, setCustomKeyword] = useState<string>('');
  const [targetLandingPage, setTargetLandingPage] = useState<string>('');

  // Synchronize default selected keywords when client changes
  React.useEffect(() => {
    if (availableKeywords.length > 0) {
      setSelectedPrimary(availableKeywords[0]);
    } else {
      setSelectedPrimary(`${client.name} ${client.industry}`);
    }
  }, [client.id, availableKeywords]);

  const activePrimaryKeyword = (selectedPrimary || availableKeywords[0] || `${client.name} ${client.industry}`).trim();
  const activeSecondaryKeyword = availableKeywords.find(k => k !== activePrimaryKeyword) || `top rated ${client.industry} provider`;
  const activeKeywordsCommaStr = availableKeywords.slice(0, 6).join(', ');

  const schemaInfo = useMemo(() => getSchemaOrgDetails(client.industry), [client.industry]);

  const slug = targetLandingPage.trim() 
    ? (targetLandingPage.startsWith('/') ? targetLandingPage : `/${targetLandingPage}`)
    : '';

  const fullCanonicalUrl = `https://${client.domain}${slug}`;

  // Capitalize helpers
  const capPrimary = activePrimaryKeyword.charAt(0).toUpperCase() + activePrimaryKeyword.slice(1);
  const capSecondary = activeSecondaryKeyword.charAt(0).toUpperCase() + activeSecondaryKeyword.slice(1);

  // Dynamic Head Meta Tag Package
  const headMetaCode = `<!-- ===================================================
     RANKPULSE PRO - ENTERPRISE SEO META CODE PACKAGE
     Target Client: ${client.name} (${client.domain})
     Industry: ${client.industry} | Schema: ${schemaInfo.schemaType}
     Target Region: ${client.targetRegion}
=================================================== -->
<title>${capPrimary} | ${client.name}</title>
<meta name="description" content="${schemaInfo.leadVerb} ${client.name}. High-ranking ${activePrimaryKeyword} and ${activeSecondaryKeyword} engineered for ${client.targetRegion}." />
<meta name="keywords" content="${activeKeywordsCommaStr || activePrimaryKeyword}" />
<link rel="canonical" href="${fullCanonicalUrl}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

<!-- OpenGraph Social Media Tags (Google Discover & Social CTR) -->
<meta property="og:title" content="${capPrimary} | ${client.name}" />
<meta property="og:description" content="${schemaInfo.leadVerb} ${client.name}. Premier ${activePrimaryKeyword} solutions with proven results in ${client.targetRegion}." />
<meta property="og:url" content="${fullCanonicalUrl}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${client.name}" />
<meta property="og:image" content="https://${client.domain}/assets/og-preview.jpg" />
<meta property="og:locale" content="en_US" />

<!-- Twitter Card Metadata -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${capPrimary} | ${client.name}" />
<meta name="twitter:description" content="${schemaInfo.leadVerb} ${client.name} - ${capSecondary}." />
<meta name="twitter:image" content="https://${client.domain}/assets/twitter-card.jpg" />`;

  // Dynamic Body Content Structure Snippet
  const bodyContentCode = `<!-- Page 1 Heading Hierarchy & Keyword Optimized Body Content -->
<header class="hero-section">
  <!-- Primary H1 tag front-loading client keyword -->
  <h1>${capPrimary} — ${client.name}</h1>
  <p class="lead-description">
    Welcome to <strong>${client.name}</strong>, your leading provider for 
    <strong>${activePrimaryKeyword}</strong> in ${client.targetRegion}.
  </p>
</header>

<section class="services-overview">
  <!-- Secondary H2 tag targeting supporting search query -->
  <h2>Premier ${capSecondary} Solutions</h2>
  <p>
    We specialize in verified ${client.industry.toLowerCase()} strategies tailored to meet your standards. 
    Explore how our <strong>${activePrimaryKeyword}</strong> delivers maximum value and competitive edge.
  </p>
  
  <!-- Image ALT Tag Optimization for Google & Bing Visual Search -->
  <img 
    src="/images/${activePrimaryKeyword.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-preview.jpg" 
    alt="${capPrimary} offered by ${client.name}" 
    loading="lazy"
    width="800"
    height="450"
  />
</section>`;

  // Dynamic Schema.org Structured Data Snippet
  const schemaCode = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${schemaInfo.schemaType}",
  "name": "${client.name}",
  "url": "${fullCanonicalUrl}",
  "logo": "${client.logo || `https://${client.domain}/logo.png`}",
  "description": "${schemaInfo.leadVerb} ${client.name}. ${capPrimary} and ${capSecondary} serving ${client.targetRegion}.",
  "areaServed": "${client.targetRegion}",
  "${schemaInfo.secondaryFieldKey}": "${schemaInfo.secondaryFieldValue}",
  "availableLanguage": "English",
  "keywords": "${activeKeywordsCommaStr || activePrimaryKeyword}"
}
</script>`;

  const copyCode = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2200);
  };

  const handleAddCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKeyword.trim()) return;
    const kw = customKeyword.trim();
    setSelectedPrimary(kw);
    setCustomKeyword('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Client Site Code Exporter & Installation Guide</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CLIENT-SYNCED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>Active Client: <strong className="text-white">{client.name}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono text-[11px]">{client.domain}</span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold">{client.industry}</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400 text-[11px]">Schema: {schemaInfo.schemaType}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => copyCode(`${headMetaCode}\n\n${schemaCode}\n\n${bodyContentCode}`, 'all')}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xl shadow-emerald-600/20 shrink-0 transition"
        >
          {copiedSection === 'all' ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>All Code Packages Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Complete HTML SEO Package</span>
            </>
          )}
        </button>
      </div>

      {/* Target Keyword & Landing Page Customizer Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Keyword & Page Customization Engine
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Selected target: <strong className="text-emerald-300 font-mono">{activePrimaryKeyword}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Quick Keyword Selector Dropdown */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Select Target Keyword from Client Pool:
            </label>
            <select
              value={selectedPrimary}
              onChange={(e) => setSelectedPrimary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/70 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {availableKeywords.map((kw, idx) => (
                <option key={idx} value={kw}>
                  {kw} {idx === 0 ? '(Top Focus)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Keyword Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Or Enter Custom Keyword:
            </label>
            <form onSubmit={handleAddCustomKeyword} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. enterprise zero trust software"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700/70 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Apply
              </button>
            </form>
          </div>

          {/* Target URL Path */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              Target Page Slug (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. /services/consultation"
              value={targetLandingPage}
              onChange={(e) => setTargetLandingPage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/70 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Quick Keyword Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-800/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Client Keywords:</span>
          {availableKeywords.slice(0, 6).map((kw, i) => (
            <button
              key={i}
              onClick={() => setSelectedPrimary(kw)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 ${
                activePrimaryKeyword === kw
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {activePrimaryKeyword === kw && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>{kw}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Snippet Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('head')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
            activeTab === 'head' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>HTML &lt;head&gt; Meta Package</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
            activeTab === 'schema' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Schema.org JSON-LD ({schemaInfo.schemaType})</span>
        </button>

        <button
          onClick={() => setActiveTab('body')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
            activeTab === 'body' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Body Heading Hierarchy (H1/H2)</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shrink-0 ${
            activeTab === 'guide' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>WordPress / Shopify / Next.js Guide</span>
        </button>
      </div>

      {/* Code Display Container */}
      {activeTab === 'head' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Paste inside &lt;head&gt;...&lt;/head&gt; of {client.domain}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically incorporates title, meta description, Google canonical link, and OpenGraph/Twitter social cards.
              </p>
            </div>
            <button
              onClick={() => copyCode(headMetaCode, 'head')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition"
            >
              {copiedSection === 'head' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'head' ? 'Copied Head Code!' : 'Copy Head Code'}</span>
            </button>
          </div>

          <pre className="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
            {headMetaCode}
          </pre>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                JSON-LD Schema Markup (Google & Bing Rich Trust Snippets)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Type: <strong className="text-indigo-300 font-mono">{schemaInfo.schemaType}</strong> for industry: <span className="text-white">{client.industry}</span>
              </p>
            </div>
            <button
              onClick={() => copyCode(schemaCode, 'schema')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition"
            >
              {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'schema' ? 'Copied Schema!' : 'Copy Schema Code'}</span>
            </button>
          </div>

          <pre className="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
            {schemaCode}
          </pre>
        </div>
      )}

      {activeTab === 'body' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Heading Hierarchy & Image Alt Text Code
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Front-loads H1 and H2 with {client.name}'s target keyword ({activePrimaryKeyword}).
              </p>
            </div>
            <button
              onClick={() => copyCode(bodyContentCode, 'body')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition"
            >
              {copiedSection === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'body' ? 'Copied Body Code!' : 'Copy Body Code'}</span>
            </button>
          </div>

          <pre className="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto whitespace-pre leading-relaxed">
            {bodyContentCode}
          </pre>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* WordPress Guide */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl inline-block font-bold text-xs">
              WordPress (Rank Math / Yoast / AIOSEO)
            </div>
            <h4 className="text-sm font-bold text-white">How to Add Keywords in WordPress:</h4>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
              <li>Log in to WordPress Admin panel for <code className="text-slate-300">{client.domain}</code>.</li>
              <li>Go to <strong>Pages</strong> → Edit your Homepage or Target Landing Page.</li>
              <li>Scroll down to the <strong>Rank Math / Yoast SEO</strong> metabox below page content.</li>
              <li>Paste the generated Title tag into <strong>SEO Title</strong>: <span className="text-emerald-300 font-mono text-[11px] block mt-1">"{capPrimary} | {client.name}"</span></li>
              <li>Paste the meta description into <strong>Meta Description</strong>.</li>
              <li>Add <strong className="text-indigo-300">{activePrimaryKeyword}</strong> to the <strong>Focus Keyword</strong> input and click Update!</li>
            </ol>
          </div>

          {/* Shopify Guide */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl inline-block font-bold text-xs">
              Shopify E-Commerce
            </div>
            <h4 className="text-sm font-bold text-white">How to Add Keywords in Shopify:</h4>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
              <li>Log in to Shopify Admin for <code className="text-slate-300">{client.domain}</code>.</li>
              <li>Go to <strong>Online Store</strong> → <strong>Preferences</strong>.</li>
              <li>Paste the Title into <strong>Homepage Title</strong> and Meta snippet into <strong>Homepage Meta Description</strong>.</li>
              <li>For Products/Collections: Go to <strong>Products</strong> → Select item → Scroll down to <strong>Search engine listing preview</strong> → Edit website SEO.</li>
              <li>Inject the JSON-LD Schema code into your <code className="text-slate-300">theme.liquid</code> file before <code className="text-slate-300">&lt;/head&gt;</code>.</li>
            </ol>
          </div>

          {/* Custom HTML / React / Next.js Guide */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl inline-block font-bold text-xs">
              HTML5 / React / Next.js
            </div>
            <h4 className="text-sm font-bold text-white">How to Add Keywords in HTML Code:</h4>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
              <li>Open your project source code (e.g. <code className="text-slate-300">index.html</code> or <code className="text-slate-300">app/layout.tsx</code>).</li>
              <li>Paste the copied <strong>HTML &lt;head&gt; Code Package</strong> directly inside the &lt;head&gt; section.</li>
              <li>In Next.js App Router: Export the metadata object containing title, description, openGraph, and twitter.</li>
              <li>Deploy code to your web host (Vercel, Netlify, cPanel, Cloudflare Pages, AWS).</li>
            </ol>
          </div>

        </div>
      )}

    </div>
  );
};

