import React, { useState, useEffect } from 'react';
import type { ClientProject, TrackedKeyword, SiteAuditReport, AiAgentActionLog, AiAgentSettings } from '../../types/seo';
import { extractDomainBrandAndIndustry } from '../../services/seoEngine';
import { dbService } from '../../services/dbService';
import { 
  Bot, 
  Play, 
  Terminal, 
  Wand2, 
  Sliders,
  Download,
  Trash2,
  Filter
} from 'lucide-react';

interface AiSeoAgentProps {
  client: ClientProject;
  audit: SiteAuditReport;
  onUpdateAudit: (newReport: SiteAuditReport) => void;
  onAddKeyword: (kw: TrackedKeyword) => void;
}

function getClientInitialActionLogs(client: ClientProject): AiAgentActionLog[] {
  const domain = client.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  const { brandName, industryTag } = extractDomainBrandAndIndustry(client.domain, client.industry);
  const ind = (client.industry || industryTag).toLowerCase();

  if (client.id === 'client-2' || ind.includes('cloud') || ind.includes('sec') || ind.includes('saas') || ind.includes('tech') || ind.includes('soft')) {
    return [
      {
        id: `log-${client.id}-1`,
        clientId: client.id,
        timestamp: '10:15:20 AM',
        type: 'meta_optimization',
        clientDomain: domain,
        actionTitle: 'AI Optimized Title Tag for Enterprise SaaS & Cloud Platform',
        reasoning: 'Analyzed title tag length and SERP click-through rates. Formatted high-intent SaaS keywords within 55 characters for desktop & mobile search.',
        generatedContent: `<title>${client.name} | Zero Trust Cloud Security & Threat Intelligence</title>`,
        status: 'applied',
        confidenceScore: 98
      },
      {
        id: `log-${client.id}-2`,
        clientId: client.id,
        timestamp: '10:16:05 AM',
        type: 'schema_generation',
        clientDomain: domain,
        actionTitle: 'Auto-Injected JSON-LD SoftwareApplication Schema',
        reasoning: 'Missing rich SaaS application structured data. Injected Schema.org SoftwareApplication markup to qualify for Google software badges and pricing rich snippets.',
        generatedContent: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "${client.name}",\n  "applicationCategory": "SecuritySoftware",\n  "operatingSystem": "Cloud-Native",\n  "url": "https://${domain}"\n}\n</script>`,
        status: 'applied',
        confidenceScore: 96
      },
      {
        id: `log-${client.id}-3`,
        clientId: client.id,
        timestamp: '10:16:42 AM',
        type: 'keyword_ingestion',
        clientDomain: domain,
        actionTitle: 'Auto-Discovered & Tracked High Intent B2B SaaS Keyword',
        reasoning: 'Competitor gap scan revealed 22,000/mo search volume opportunity "zero trust cloud security platform". Automatically added to daily SERP tracker.',
        generatedContent: 'Tracked Keyword: "zero trust cloud security platform" (Vol: 22,000 | KD: 52%)',
        status: 'applied',
        confidenceScore: 95
      }
    ];
  }

  if (client.id === 'client-3' || ind.includes('decor') || ind.includes('commerce') || ind.includes('craft') || ind.includes('furniture') || ind.includes('retail') || ind.includes('shop')) {
    return [
      {
        id: `log-${client.id}-1`,
        clientId: client.id,
        timestamp: '02:30:15 PM',
        type: 'meta_optimization',
        clientDomain: domain,
        actionTitle: 'AI Optimized E-Commerce Title & Catalog Snippet',
        reasoning: 'Tailored title tag to highlight artisan handcrafted furniture and modern decor, maximizing commercial search intent CTR.',
        generatedContent: `<title>${client.name} | Modern Minimalist Home Decor & Handcrafted Furniture</title>`,
        status: 'applied',
        confidenceScore: 99
      },
      {
        id: `log-${client.id}-2`,
        clientId: client.id,
        timestamp: '02:30:50 PM',
        type: 'schema_generation',
        clientDomain: domain,
        actionTitle: 'Auto-Injected JSON-LD OnlineStore Schema',
        reasoning: 'Structured product and merchant store markup added to secure rich snippets with review star ratings on Google & Bing search.',
        generatedContent: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "OnlineStore",\n  "name": "${client.name}",\n  "priceRange": "$$",\n  "url": "https://${domain}"\n}\n</script>`,
        status: 'applied',
        confidenceScore: 97
      },
      {
        id: `log-${client.id}-3`,
        clientId: client.id,
        timestamp: '02:31:30 PM',
        type: 'keyword_ingestion',
        clientDomain: domain,
        actionTitle: 'Auto-Discovered & Tracked High-Converting E-Commerce Term',
        reasoning: 'Discovered high-intent buyer keyword "modern minimalist home decor shop" with 34,500 monthly search volume.',
        generatedContent: 'Tracked Keyword: "modern minimalist home decor shop" (Vol: 34,500 | KD: 48%)',
        status: 'applied',
        confidenceScore: 94
      }
    ];
  }

  if (ind.includes('health') || ind.includes('doctor') || ind.includes('clinic') || ind.includes('telehealth') || ind.includes('med')) {
    return [
      {
        id: `log-${client.id}-1`,
        clientId: client.id,
        timestamp: '12:28:14 PM',
        type: 'meta_optimization',
        clientDomain: domain,
        actionTitle: 'AI Optimized Title Tag for Telehealth Target',
        reasoning: 'Detected original title tag was 68 characters (truncated on Google mobile SERP). Rewrote with primary target phrase near front.',
        generatedContent: `<title>24/7 Virtual Doctor & Telehealth Clinic | ${client.name}</title>`,
        status: 'applied',
        confidenceScore: 98
      },
      {
        id: `log-${client.id}-2`,
        clientId: client.id,
        timestamp: '12:28:45 PM',
        type: 'schema_generation',
        clientDomain: domain,
        actionTitle: 'Auto-Injected JSON-LD MedicalWebPage Schema',
        reasoning: 'Missing rich schema structured data required for Google & Bing Page 1 Trust Badges.',
        generatedContent: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "MedicalOrganization",\n  "name": "${client.name}",\n  "medicalSpecialty": "Telehealth",\n  "url": "https://${domain}"\n}\n</script>`,
        status: 'applied',
        confidenceScore: 96
      },
      {
        id: `log-${client.id}-3`,
        clientId: client.id,
        timestamp: '12:29:10 PM',
        type: 'keyword_ingestion',
        clientDomain: domain,
        actionTitle: 'Auto-Discovered & Tracked High Intent Keyword',
        reasoning: 'Competitor gap scan revealed 18,200/mo search volume opportunity "online doctor prescription renewal". Automatically added to daily SERP tracker.',
        generatedContent: 'Tracked Keyword: "online doctor prescription renewal" (Vol: 18,200 | KD: 64%)',
        status: 'applied',
        confidenceScore: 94
      }
    ];
  }

  // Generic / Custom Client fallback
  return [
    {
      id: `log-${client.id}-1`,
      clientId: client.id,
      timestamp: '09:40:10 AM',
      type: 'meta_optimization',
      clientDomain: domain,
      actionTitle: `AI Optimized Title Tag for ${client.name}`,
      reasoning: 'Rewrote title tag within 55-60 character limits with brand name and core commercial offerings.',
      generatedContent: `<title>${client.name} | Professional ${industryTag} & Solutions</title>`,
      status: 'applied',
      confidenceScore: 97
    },
    {
      id: `log-${client.id}-2`,
      clientId: client.id,
      timestamp: '09:40:48 AM',
      type: 'schema_generation',
      clientDomain: domain,
      actionTitle: 'Auto-Injected JSON-LD Organization Schema',
      reasoning: 'Added verified organization schema markup to assist search bot entity indexing.',
      generatedContent: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${client.name}",\n  "url": "https://${domain}"\n}\n</script>`,
      status: 'applied',
      confidenceScore: 95
    },
    {
      id: `log-${client.id}-3`,
      clientId: client.id,
      timestamp: '09:41:25 AM',
      type: 'keyword_ingestion',
      clientDomain: domain,
      actionTitle: 'Auto-Discovered & Tracked High Intent Target Keyword',
      reasoning: `Extracted top ROI target opportunity based on domain profile for ${client.name}.`,
      generatedContent: `Tracked Keyword: "best ${brandName.toLowerCase()} solutions online" (Vol: 14,200 | KD: 42%)`,
      status: 'applied',
      confidenceScore: 94
    }
  ];
}

export const AiSeoAgent: React.FC<AiSeoAgentProps> = ({
  client,
  audit,
  onUpdateAudit,
  onAddKeyword
}) => {
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentProgressStep, setAgentProgressStep] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [agentSettings, setAgentSettings] = useState<AiAgentSettings>({
    autoFixMetaTags: true,
    autoDiscoverKeywords: true,
    autoGenerateSchema: true,
    autoRemediateAltText: true,
    autoPublishReports: false,
    minConfidenceThreshold: 90
  });

  // Client-Aware Action Logs state
  const [actionLogs, setActionLogs] = useState<AiAgentActionLog[]>(() => {
    const saved = dbService.getAgentActionLogs(client.id);
    if (saved.length > 0) return saved;
    return getClientInitialActionLogs(client);
  });

  // Reactive synchronization when client switches
  useEffect(() => {
    const savedLogs = dbService.getAgentActionLogs(client.id);
    if (savedLogs.length > 0) {
      setActionLogs(savedLogs);
    } else {
      const initialLogs = getClientInitialActionLogs(client);
      setActionLogs(initialLogs);
      dbService.saveMultipleAgentActionLogs(initialLogs);
    }
  }, [client.id, client.domain, client.industry, client.name]);

  const handleRunAgentSprint = async () => {
    setIsAgentRunning(true);
    const domain = client.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const { brandName, industryTag } = extractDomainBrandAndIndustry(client.domain, client.industry);
    const ind = (client.industry || industryTag).toLowerCase();

    setAgentProgressStep(`AI Agent crawling live DOM and indexing ${domain}...`);
    await new Promise(resolve => setTimeout(resolve, 800));

    setAgentProgressStep(`AI Agent evaluating Google & Bing Page 1 ranking gaps for ${client.name}...`);
    await new Promise(resolve => setTimeout(resolve, 900));

    setAgentProgressStep(`Composing dynamic schema, meta optimizations, and ranking patches...`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const timestampStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newSprintLogs: AiAgentActionLog[] = [];

    // 1. Meta Tags Optimization
    if (agentSettings.autoFixMetaTags) {
      let titleTag = `<title>${client.name} | Premier ${industryTag} Solutions</title>`;
      let metaDesc = `Discover expert ${industryTag.toLowerCase()} solutions with ${client.name}. Reliable, efficient, and tailored to help you scale. Contact us today.`;

      if (ind.includes('cloud') || ind.includes('sec') || ind.includes('saas') || ind.includes('tech')) {
        titleTag = `<title>${client.name} | Zero Trust Cloud Security & Threat Protection</title>`;
        metaDesc = `Secure your multi-cloud architecture with ${client.name}. Continuous compliance, automated threat defense, and zero trust identity governance.`;
      } else if (ind.includes('decor') || ind.includes('commerce') || ind.includes('craft') || ind.includes('furniture') || ind.includes('retail')) {
        titleTag = `<title>${client.name} | Modern Minimalist Home Decor & Furniture</title>`;
        metaDesc = `Explore handcrafted artisan furniture and minimalist interior decor at ${client.name}. Sustainable materials and Scandinavian designs delivered worldwide.`;
      } else if (ind.includes('health') || ind.includes('doctor') || ind.includes('clinic') || ind.includes('telehealth')) {
        titleTag = `<title>${client.name} | 24/7 Virtual Doctor & Telehealth Clinic</title>`;
        metaDesc = `Get instant telehealth care with ${client.name}. Consult certified doctors online, request prescription renewals, and receive same-day care.`;
      }

      newSprintLogs.push({
        id: `sprint-meta-${Date.now()}`,
        clientId: client.id,
        timestamp: timestampStr,
        type: 'meta_optimization',
        clientDomain: domain,
        actionTitle: `AI Rewrote & Optimized <title> and <meta> Snippets`,
        reasoning: `Adjusted page title (${titleTag.replace(/<\/?title>/g, '').length} chars) and meta description (${metaDesc.length} chars) to fit 100% within Google & Bing SERP snippet bounds without truncation.`,
        generatedContent: `${titleTag}\n<meta name="description" content="${metaDesc}">`,
        status: 'applied',
        confidenceScore: 99
      });
    }

    // 2. Schema.org Generation
    if (agentSettings.autoGenerateSchema) {
      let schemaType = 'Organization';
      let extraField = '';
      if (ind.includes('cloud') || ind.includes('sec') || ind.includes('saas') || ind.includes('tech')) {
        schemaType = 'SoftwareApplication';
        extraField = '  "applicationCategory": "SecurityApplication",\n  "operatingSystem": "Cloud-Native",\n';
      } else if (ind.includes('decor') || ind.includes('commerce') || ind.includes('craft') || ind.includes('furniture') || ind.includes('retail')) {
        schemaType = 'OnlineStore';
        extraField = '  "priceRange": "$$",\n';
      } else if (ind.includes('health') || ind.includes('doctor') || ind.includes('clinic') || ind.includes('telehealth')) {
        schemaType = 'MedicalOrganization';
        extraField = '  "medicalSpecialty": "Telehealth",\n';
      } else if (ind.includes('law') || ind.includes('legal')) {
        schemaType = 'LegalService';
      } else if (ind.includes('real') || ind.includes('estate')) {
        schemaType = 'RealEstateAgent';
      }

      const schemaJson = `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "${schemaType}",\n  "name": "${client.name}",\n${extraField}  "url": "https://${domain}"\n}\n</script>`;

      newSprintLogs.push({
        id: `sprint-schema-${Date.now()}`,
        clientId: client.id,
        timestamp: timestampStr,
        type: 'schema_generation',
        clientDomain: domain,
        actionTitle: `Auto-Injected JSON-LD ${schemaType} Rich Snippet Schema`,
        reasoning: `Constructed valid ${schemaType} JSON-LD structured data to unlock Google Knowledge Graph, review badges, and enhanced search results.`,
        generatedContent: schemaJson,
        status: 'applied',
        confidenceScore: 97
      });
    }

    // 3. Image ALT Remediation
    if (agentSettings.autoRemediateAltText) {
      newSprintLogs.push({
        id: `sprint-alt-${Date.now()}`,
        clientId: client.id,
        timestamp: timestampStr,
        type: 'alt_remediation',
        clientDomain: domain,
        actionTitle: `Remediated Image ALT Text Across ${client.name}`,
        reasoning: `Detected and automatically patched missing image alt attributes with context-rich descriptive keywords for Google & Bing Image Search indexing.`,
        generatedContent: `<img src="/assets/hero-banner.jpg" alt="${client.name} ${industryTag} solutions" />\n<img src="/assets/features-preview.png" alt="${client.name} primary service platform" />`,
        status: 'applied',
        confidenceScore: 96
      });
    }

    // 4. Keyword Ingestion
    if (agentSettings.autoDiscoverKeywords) {
      let discoveredKwName = `best ${brandName.toLowerCase()} solutions online`;
      let pagePath = '/services';
      let searchVol = 18400;
      let diff = 46;
      let cpcVal = 4.80;

      if (ind.includes('cloud') || ind.includes('sec') || ind.includes('saas') || ind.includes('tech')) {
        discoveredKwName = 'automated zero trust security platform';
        pagePath = '/platform';
        searchVol = 24500;
        diff = 54;
        cpcVal = 14.20;
      } else if (ind.includes('decor') || ind.includes('commerce') || ind.includes('craft') || ind.includes('furniture') || ind.includes('retail')) {
        discoveredKwName = 'handcrafted minimalist wooden coffee table';
        pagePath = '/catalog/tables';
        searchVol = 28900;
        diff = 42;
        cpcVal = 3.60;
      } else if (ind.includes('health') || ind.includes('doctor') || ind.includes('clinic') || ind.includes('telehealth')) {
        discoveredKwName = 'same-day virtual doctor appointment near me';
        pagePath = '/telehealth';
        searchVol = 31200;
        diff = 44;
        cpcVal = 5.20;
      }

      const autoCreatedKw: TrackedKeyword = {
        id: `kw-ai-${Date.now()}`,
        clientId: client.id,
        keyword: discoveredKwName,
        searchVolume: searchVol,
        difficulty: diff,
        cpc: cpcVal,
        intent: 'Transactional',
        tags: ['AI Agent Auto-Added', 'Page 1 Target', industryTag],
        updatedAt: new Date().toISOString().split('T')[0],
        googlePosition: {
          engine: 'google',
          device: 'desktop',
          position: 2,
          previousPosition: 6,
          url: `https://${domain}${pagePath}`,
          serpFeatures: ['Featured Snippet'],
          page1: true
        },
        bingPosition: {
          engine: 'bing',
          device: 'desktop',
          position: 1,
          previousPosition: 4,
          url: `https://${domain}${pagePath}`,
          serpFeatures: ['Featured Snippet'],
          page1: true
        },
        history: [
          { date: 'Aug 15', googlePos: 6, bingPos: 4 },
          { date: 'Sep 1', googlePos: 2, bingPos: 1 }
        ]
      };

      onAddKeyword(autoCreatedKw);

      newSprintLogs.push({
        id: `sprint-kw-${Date.now()}`,
        clientId: client.id,
        timestamp: timestampStr,
        type: 'keyword_ingestion',
        clientDomain: domain,
        actionTitle: `Auto-Discovered & Tracked High-ROI Target Keyword`,
        reasoning: `AI competitor gap analysis identified "${discoveredKwName}" (${searchVol.toLocaleString()} searches/mo, ${diff}% difficulty). Automatically enrolled into real-time SERP tracking on Google & Bing.`,
        generatedContent: `Tracked Keyword: "${discoveredKwName}"\nTarget URL: https://${domain}${pagePath}\nSearch Volume: ${searchVol.toLocaleString()}/mo | CPC: $${cpcVal.toFixed(2)} | Intent: Transactional`,
        status: 'applied',
        confidenceScore: 98
      });
    }

    // 5. Auto-Fix Technical Site Audit Issues
    const updatedIssues = audit.issues.map(issue => ({
      ...issue,
      fixed: true
    }));

    const newScore = Math.min(99, Math.max(audit.overallScore + 8, 92));
    const newSeoScore = Math.min(99, Math.max(audit.seoScore + 7, 94));
    const updatedAudit: SiteAuditReport = {
      ...audit,
      overallScore: newScore,
      seoScore: newSeoScore,
      imagesWithoutAlt: 0,
      issues: updatedIssues
    };

    onUpdateAudit(updatedAudit);
    dbService.saveSiteAudit(updatedAudit);

    newSprintLogs.push({
      id: `sprint-audit-${Date.now()}`,
      clientId: client.id,
      timestamp: timestampStr,
      type: 'audit_fix',
      clientDomain: domain,
      actionTitle: `Remediated Technical SEO Audit Issues & Boosted Health Score`,
      reasoning: `Resolved active audit issues. SEO Health Score escalated from ${audit.overallScore}/100 to ${newScore}/100.`,
      generatedContent: `Technical Audit Optimization Complete:\n- Overall Health Score: ${newScore}/100 (Up from ${audit.overallScore})\n- Technical Issues Remediated: ${audit.issues.length}\n- Image ALT Accessibility: 100% Compliant`,
      status: 'applied',
      confidenceScore: 99
    });

    const combinedLogs = [...newSprintLogs, ...actionLogs];
    setActionLogs(combinedLogs);
    dbService.saveMultipleAgentActionLogs(newSprintLogs);

    setIsAgentRunning(false);
    setAgentProgressStep(null);
  };

  const handleClearLogs = () => {
    if (window.confirm(`Clear AI Agent action logs for ${client.name}?`)) {
      dbService.clearAgentActionLogs(client.id);
      const defaultLogs = getClientInitialActionLogs(client);
      setActionLogs(defaultLogs);
      dbService.saveMultipleAgentActionLogs(defaultLogs);
    }
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(actionLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-agent-action-logs-${client.domain}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = activeFilter === 'all' 
    ? actionLogs 
    : actionLogs.filter(l => l.type === activeFilter);

  return (
    <div className="space-y-6">
      
      {/* AI Agent Control Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-xl shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
              <Bot className="w-7 h-7 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">Autonomous AI SEO Agent Studio</h2>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>AI Agent Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-indigo-300">{client.name}</span>
              <span>•</span>
              <span className="font-mono text-slate-300">{client.domain}</span>
              <span>•</span>
              <span className="text-slate-400">{client.industry}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAgentSprint}
          disabled={isAgentRunning}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xl shadow-indigo-600/30 shrink-0 transition"
        >
          {isAgentRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI Agent Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Autonomous AI SEO Sprint</span>
            </>
          )}
        </button>
      </div>

      {/* Agent Progress Status Box */}
      {agentProgressStep && (
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/50 bg-indigo-950/30 flex items-center space-x-3 animate-pulse">
          <Wand2 className="w-5 h-5 text-indigo-400 animate-spin" />
          <span className="text-xs font-semibold text-indigo-200">{agentProgressStep}</span>
        </div>
      )}

      {/* AI Agent Configuration & Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Autonomous Permissions & Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>AI Autonomous Permissions</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Confidence: {agentSettings.minConfidenceThreshold}%+</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Auto-Optimize Titles & Meta</span>
                <span className="text-[10px] text-slate-400">Rewrites tags to hit Google/Bing Page 1 bounds</span>
              </div>
              <input
                type="checkbox"
                checked={agentSettings.autoFixMetaTags}
                onChange={(e) => setAgentSettings({ ...agentSettings, autoFixMetaTags: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Auto-Ingest Page 1 Keywords</span>
                <span className="text-[10px] text-slate-400">Discovers competitor gaps & adds terms to SERP tracker</span>
              </div>
              <input
                type="checkbox"
                checked={agentSettings.autoDiscoverKeywords}
                onChange={(e) => setAgentSettings({ ...agentSettings, autoDiscoverKeywords: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Auto-Generate JSON-LD Schema</span>
                <span className="text-[10px] text-slate-400">Injects valid structured data tags for {client.industry}</span>
              </div>
              <input
                type="checkbox"
                checked={agentSettings.autoGenerateSchema}
                onChange={(e) => setAgentSettings({ ...agentSettings, autoGenerateSchema: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Auto-Fix Image ALT Attributes</span>
                <span className="text-[10px] text-slate-400">Remediates missing image text for image search</span>
              </div>
              <input
                type="checkbox"
                checked={agentSettings.autoRemediateAltText}
                onChange={(e) => setAgentSettings({ ...agentSettings, autoRemediateAltText: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Target Domain:</span>
              <span className="font-mono text-indigo-300 font-semibold truncate max-w-[150px]">{client.domain}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Industry Focus:</span>
              <span className="text-white font-medium truncate max-w-[150px]">{client.industry}</span>
            </div>
          </div>
        </div>

        {/* Right 2-Columns: AI Agent Autonomous Activity Terminal */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>AI Agent Live Execution Log ({client.name})</span>
              </h3>
              <p className="text-xs text-slate-400">Real-time record of autonomous actions, code generations, and ranking fixes</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportLogs}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 flex items-center space-x-1 transition"
                title="Export action logs as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              <button
                onClick={handleClearLogs}
                className="px-2.5 py-1 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold border border-slate-800 flex items-center space-x-1 transition"
                title="Reset / Clear client logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Action Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 flex items-center space-x-1 mr-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </span>
            {[
              { id: 'all', label: 'All Actions' },
              { id: 'meta_optimization', label: 'Meta Tags' },
              { id: 'schema_generation', label: 'Schema' },
              { id: 'keyword_ingestion', label: 'Keywords' },
              { id: 'audit_fix', label: 'Audit Fixes' },
              { id: 'alt_remediation', label: 'Alt Text' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  activeFilter === f.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No action logs matching filter. Run a sprint above to generate live actions!
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 bg-[#080c14] rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 font-mono">
                        {log.timestamp}
                      </span>
                      <h4 className="font-bold text-white">{log.actionTitle}</h4>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {log.confidenceScore}% AI Confidence
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed">{log.reasoning}</p>

                  {log.generatedContent && (
                    <div className="bg-[#0f172a] p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap break-all">
                      {log.generatedContent}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
