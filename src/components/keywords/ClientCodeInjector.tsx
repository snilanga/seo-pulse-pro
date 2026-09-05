import React, { useState } from 'react';
import type { ClientProject } from '../../types/seo';
import { 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  FileCode, 
  HelpCircle
} from 'lucide-react';

interface ClientCodeInjectorProps {
  client: ClientProject;
  keywordsList: string[];
}

export const ClientCodeInjector: React.FC<ClientCodeInjectorProps> = ({
  client,
  keywordsList
}) => {
  const [activeTab, setActiveTab] = useState<'head' | 'body' | 'schema' | 'guide'>('head');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const primaryKeyword = keywordsList[0] || 'virtual doctor consultation online';
  const secondaryKeyword = keywordsList[1] || 'same day telehealth appointment';
  const keywordsCommaStr = keywordsList.slice(0, 6).join(', ');

  // Head Meta Tag Package
  const headMetaCode = `<!-- ===================================================
     RANKPULSE PRO - ENTERPRISE SEO META CODE PACKAGE
     Target Client Domain: ${client.domain}
     Target Region: ${client.targetRegion}
=================================================== -->
<title>${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} | ${client.name}</title>
<meta name="description" content="Access ${primaryKeyword} with ${client.name}. Fast ${secondaryKeyword}, 24/7 certified care, and instant online prescription renewals." />
<meta name="keywords" content="${keywordsCommaStr}" />
<link rel="canonical" href="https://${client.domain}/" />

<!-- OpenGraph Social Media Tags (Google & Social CTR) -->
<meta property="og:title" content="${primaryKeyword} | ${client.name}" />
<meta property="og:description" content="Fast online appointments & telehealth care with ${client.name}. Book online today." />
<meta property="og:url" content="https://${client.domain}/" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://${client.domain}/assets/og-preview.jpg" />

<!-- Twitter Card Metadata -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${primaryKeyword} | ${client.name}" />
<meta name="twitter:description" content="Book ${secondaryKeyword} with board-certified physicians." />`;

  // Body Content Structure Snippet
  const bodyContentCode = `<!-- Page 1 Heading Hierarchy & Keyword Optimized Body Content -->
<header>
  <h1>Premier ${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}</h1>
</header>

<section className="services-overview">
  <h2>Fast ${secondaryKeyword} Services</h2>
  <p>
    Welcome to ${client.name}, your trusted portal for <strong>${primaryKeyword}</strong>. 
    We specialize in delivering immediate care and online prescriptions.
  </p>
  
  <!-- Image ALT Tag Optimization for Google & Bing Image Search -->
  <img src="/images/doctor-consultation.jpg" alt="${primaryKeyword} with certified physician" />
</section>`;

  // Schema.org Structured Data Snippet
  const schemaCode = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "${client.name}",
  "url": "https://${client.domain}",
  "logo": "${client.logo}",
  "description": "Access ${primaryKeyword} and ${secondaryKeyword} online.",
  "areaServed": "${client.targetRegion}",
  "medicalSpecialty": "Telehealth Care",
  "availableLanguage": "English"
}
</script>`;

  const copyCode = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2200);
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
                1-CLICK CODE INJECTOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              How to deploy your generated target keywords directly into your client's HTML, React, Next.js, WordPress, or Shopify site
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

      {/* Code Snippet Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('head')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'head' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>HTML &lt;head&gt; Meta Package</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Schema.org JSON-LD Code</span>
        </button>

        <button
          onClick={() => setActiveTab('body')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'body' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Body Heading Hierarchy (H1/H2)</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
            activeTab === 'guide' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>WordPress / Shopify / Next.js Guide</span>
        </button>
      </div>

      {/* Code Display Container */}
      {activeTab === 'head' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Paste inside &lt;head&gt;...&lt;/head&gt; of {client.domain}
            </h3>
            <button
              onClick={() => copyCode(headMetaCode, 'head')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              {copiedSection === 'head' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'head' ? 'Copied Head Code!' : 'Copy Head Code'}</span>
            </button>
          </div>

          <pre className="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre">
            {headMetaCode}
          </pre>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              JSON-LD Schema Markup (Google & Bing Rich Trust Snippets)
            </h3>
            <button
              onClick={() => copyCode(schemaCode, 'schema')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'schema' ? 'Copied Schema!' : 'Copy Schema Code'}</span>
            </button>
          </div>

          <pre className="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre">
            {schemaCode}
          </pre>
        </div>
      )}

      {activeTab === 'body' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Heading Hierarchy & Image Alt Text Code
            </h3>
            <button
              onClick={() => copyCode(bodyContentCode, 'body')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              {copiedSection === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'body' ? 'Copied Body Code!' : 'Copy Body Code'}</span>
            </button>
          </div>

          <pre className="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto whitespace-pre">
            {bodyContentCode}
          </pre>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* WordPress Guide */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl inline-block font-bold text-xs">
              WordPress (Yoast / RankMath)
            </div>
            <h4 className="text-sm font-bold text-white">How to Add Keywords in WordPress:</h4>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
              <li>Log in to WordPress Admin panel.</li>
              <li>Go to <strong>Pages</strong> → Edit your Homepage or Target Landing Page.</li>
              <li>Scroll down to the <strong>Rank Math / Yoast SEO</strong> metabox below page content.</li>
              <li>Paste the generated Title tag into <strong>SEO Title</strong> and Meta Description into <strong>Meta Description</strong>.</li>
              <li>Add keywords to the <strong>Focus Keyword</strong> box and click Update!</li>
            </ol>
          </div>

          {/* Shopify Guide */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl inline-block font-bold text-xs">
              Shopify E-Commerce
            </div>
            <h4 className="text-sm font-bold text-white">How to Add Keywords in Shopify:</h4>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
              <li>Log in to Shopify Admin.</li>
              <li>Go to <strong>Online Store</strong> → <strong>Preferences</strong>.</li>
              <li>Paste the Title into <strong>Homepage Title</strong> and Meta snippet into <strong>Homepage Meta Description</strong>.</li>
              <li>For Products: Go to <strong>Products</strong> → Select item → Scroll down to <strong>Search engine listing preview</strong> → Edit website SEO.</li>
            </ol>
          </div>

          {/* Custom HTML / React / Next.js Guide */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl inline-block font-bold text-xs">
              HTML5 / React / Next.js
            </div>
            <h4 className="text-sm font-bold text-white">How to Add Keywords in HTML Code:</h4>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
              <li>Open your project source code (e.g. `index.html` or `layout.tsx`).</li>
              <li>Paste the copied <strong>HTML &lt;head&gt; Code Package</strong> directly inside the &lt;head&gt; section.</li>
              <li>In Next.js: Use Next `Metadata` export or `next/head` component to inject tags.</li>
              <li>Deploy code to your web server (Vercel, Netlify, cPanel, AWS).</li>
            </ol>
          </div>

        </div>
      )}

    </div>
  );
};
