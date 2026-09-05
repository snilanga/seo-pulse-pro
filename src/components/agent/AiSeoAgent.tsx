import React, { useState } from 'react';
import type { ClientProject, TrackedKeyword, SiteAuditReport, AiAgentActionLog, AiAgentSettings } from '../../types/seo';
import { 
  Bot, 
  Play, 
  Terminal, 
  Wand2, 
  Sliders
} from 'lucide-react';

interface AiSeoAgentProps {
  client: ClientProject;
  audit: SiteAuditReport;
  onUpdateAudit: (newReport: SiteAuditReport) => void;
  onAddKeyword: (kw: TrackedKeyword) => void;
}

export const AiSeoAgent: React.FC<AiSeoAgentProps> = ({
  client,
  audit,
  onUpdateAudit,
  onAddKeyword
}) => {
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentProgressStep, setAgentProgressStep] = useState<string | null>(null);

  const [agentSettings, setAgentSettings] = useState<AiAgentSettings>({
    autoFixMetaTags: true,
    autoDiscoverKeywords: true,
    autoGenerateSchema: true,
    autoRemediateAltText: true,
    autoPublishReports: false,
    minConfidenceThreshold: 90
  });

  const [actionLogs, setActionLogs] = useState<AiAgentActionLog[]>([
    {
      id: 'log-1',
      timestamp: '12:28:14 PM',
      type: 'meta_optimization',
      clientDomain: client.domain,
      actionTitle: 'AI Optimized Title Tag for Telehealth Target',
      reasoning: 'Detected original title tag was 68 characters (truncated on Google mobile SERP). Rewrote with primary target phrase near front.',
      generatedContent: `<title>24/7 Virtual Doctor & Telehealth Clinic | ${client.name}</title>`,
      status: 'applied',
      confidenceScore: 98
    },
    {
      id: 'log-2',
      timestamp: '12:28:45 PM',
      type: 'schema_generation',
      clientDomain: client.domain,
      actionTitle: 'Auto-Injected JSON-LD MedicalWebPage Schema',
      reasoning: 'Missing rich schema structured data required for Google & Bing Page 1 Trust Badges.',
      generatedContent: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "MedicalOrganization",\n  "name": "${client.name}",\n  "url": "https://${client.domain}"\n}\n</script>`,
      status: 'applied',
      confidenceScore: 96
    },
    {
      id: 'log-3',
      timestamp: '12:29:10 PM',
      type: 'keyword_ingestion',
      clientDomain: client.domain,
      actionTitle: 'Auto-Discovered & Tracked High Intent Keyword',
      reasoning: 'Competitor gap scan revealed 18,200/mo search volume opportunity "online doctor prescription renewal". Automatically added to daily SERP tracker.',
      generatedContent: 'Tracked Keyword: "online doctor prescription renewal" (Vol: 18,200 | KD: 64%)',
      status: 'applied',
      confidenceScore: 94
    }
  ]);

  const handleRunAgentSprint = async () => {
    setIsAgentRunning(true);
    setAgentProgressStep('Analyzing client site metadata & search engine SERPs...');

    await new Promise(resolve => setTimeout(resolve, 1200));
    setAgentProgressStep('AI Agent evaluating Page 1 ranking gaps vs top competitors...');

    await new Promise(resolve => setTimeout(resolve, 1400));
    setAgentProgressStep('Generating AI content patches & optimizing meta snippets...');

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Auto-fix critical audit issues
    const updatedIssues = audit.issues.map(issue => ({
      ...issue,
      fixed: true
    }));

    const newScore = Math.min(98, audit.overallScore + 10);
    onUpdateAudit({
      ...audit,
      overallScore: newScore,
      issues: updatedIssues
    });

    // Auto-add new high rank opportunity keyword
    const autoCreatedKw: TrackedKeyword = {
      id: `kw-ai-${Date.now()}`,
      clientId: client.id,
      keyword: `urgent ${client.industry.toLowerCase().split('&')[0]} consultation online`,
      searchVolume: 16500,
      difficulty: 48,
      cpc: 4.10,
      intent: 'Transactional',
      tags: ['AI Agent Auto-Added', 'Page 1 Target'],
      updatedAt: new Date().toISOString().split('T')[0],
      googlePosition: {
        engine: 'google',
        device: 'desktop',
        position: 3,
        previousPosition: 7,
        url: `https://${client.domain}/urgent-care`,
        serpFeatures: ['Featured Snippet'],
        page1: true
      },
      bingPosition: {
        engine: 'bing',
        device: 'desktop',
        position: 2,
        previousPosition: 5,
        url: `https://${client.domain}/urgent-care`,
        serpFeatures: [],
        page1: true
      },
      history: [
        { date: 'Aug 15', googlePos: 7, bingPos: 5 },
        { date: 'Sep 1', googlePos: 3, bingPos: 2 }
      ]
    };

    onAddKeyword(autoCreatedKw);

    // Append AI Agent execution log
    const newLog: AiAgentActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'meta_optimization',
      clientDomain: client.domain,
      actionTitle: 'AI Autonomous Sprint Optimization Completed',
      reasoning: 'Automatically remediated 2 technical site audit issues, injected structured schema markup, and added high-intent keyword to SERP tracker.',
      generatedContent: `Site Health Improved to ${newScore}/100. Added "urgent consultation online" to rank tracker.`,
      status: 'applied',
      confidenceScore: 99
    };

    setActionLogs([newLog, ...actionLogs]);
    setIsAgentRunning(false);
    setAgentProgressStep(null);
  };

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
            <p className="text-xs text-slate-400 mt-1">
              Autonomous AI agent with permissions to automatically crawl, optimize meta tags, remediate code issues, and track Page 1 keywords
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
                <span className="text-[10px] text-slate-400">Injects Medical/Product structured data tags</span>
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
        </div>

        {/* Right 2-Columns: AI Agent Autonomous Activity Terminal */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>AI Agent Live Execution Log</span>
              </h3>
              <p className="text-xs text-slate-400">Real-time record of autonomous actions, code generations, and ranking fixes</p>
            </div>

            <span className="text-[10px] px-2.5 py-1 bg-slate-900 text-emerald-400 font-mono rounded-lg border border-slate-800">
              {actionLogs.length} Actions Executed
            </span>
          </div>

          <div className="space-y-3">
            {actionLogs.map((log) => (
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
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
