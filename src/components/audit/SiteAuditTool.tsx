import React, { useState } from 'react';
import type { SiteAuditReport } from '../../types/seo';
import { runLiveSiteAudit } from '../../services/seoEngine';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Globe, 
  Code2, 
  Copy, 
  Check, 
  Monitor
} from 'lucide-react';

interface SiteAuditToolProps {
  auditReport: SiteAuditReport;
  onUpdateAudit: (newReport: SiteAuditReport) => void;
  clientId: string;
}

export const SiteAuditTool: React.FC<SiteAuditToolProps> = ({
  auditReport,
  onUpdateAudit,
  clientId
}) => {
  const [targetUrl, setTargetUrl] = useState(auditReport.url);
  const [isScanning, setIsScanning] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<string>('All');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [serpEngine, setSerpEngine] = useState<'google' | 'bing'>('google');

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsScanning(true);
    try {
      const newAudit = await runLiveSiteAudit({ url: targetUrl.trim(), clientId });
      onUpdateAudit(newAudit);
    } catch (err) {
      console.error('Audit scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleIssueFixed = (issueId: string) => {
    const updatedIssues = auditReport.issues.map(iss => 
      iss.id === issueId ? { ...iss, fixed: !iss.fixed } : iss
    );
    const fixedCount = updatedIssues.filter(i => i.fixed).length;
    const newScore = Math.min(99, Math.round(auditReport.overallScore + (fixedCount * 2)));

    onUpdateAudit({
      ...auditReport,
      overallScore: newScore,
      issues: updatedIssues
    });
  };

  const copyCodeSnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Filter issues
  const filteredIssues = auditReport.issues.filter(issue => {
    const categoryMatch = activeCategoryFilter === 'All' || issue.category === activeCategoryFilter;
    const severityMatch = activeSeverityFilter === 'All' || issue.severity === activeSeverityFilter;
    return categoryMatch && severityMatch;
  });

  const categories = ['All', 'Meta Tags', 'Content & Headings', 'Performance & Speed', 'Mobile & UX', 'Security & Tech'];

  return (
    <div className="space-y-6">
      
      {/* Live Audit Scanner Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Search className="w-5 h-5 text-indigo-400" />
              <span>Real-Time Technical SEO & On-Page Auditor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Crawl metadata, H1-H6 headings, OpenGraph, Schema markup & speed metrics for Page 1 optimization
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Last Scanned: <span className="text-indigo-300 font-semibold">{auditReport.scannedAt}</span>
          </div>
        </div>

        <form onSubmit={handleScanSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter web page URL (e.g. https://client.com/landing)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <Globe className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 shrink-0 transition"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Crawling Page...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Live Crawl</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Score Overview Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Overall Health</span>
          <div className="relative inline-flex items-center justify-center">
            <div className={`text-3xl font-black ${
              auditReport.overallScore >= 80 ? 'text-emerald-400' : auditReport.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {auditReport.overallScore}%
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Page 1 Readiness</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">SEO Compliance</span>
          <div className="text-3xl font-black text-indigo-400">{auditReport.seoScore}%</div>
          <span className="text-[10px] text-slate-400 block mt-1">Meta & Heading Factors</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Performance</span>
          <div className="text-3xl font-black text-emerald-400">{auditReport.performanceScore}%</div>
          <span className="text-[10px] text-slate-400 block mt-1">{auditReport.loadTimeMs}ms Response Time</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Best Practices</span>
          <div className="text-3xl font-black text-purple-400">{auditReport.bestPracticesScore}%</div>
          <span className="text-[10px] text-slate-400 block mt-1">Security & Schema.org</span>
        </div>

      </div>

      {/* Google & Bing Live SERP Snippet Preview Generator */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-indigo-400" />
              <span>Google & Bing Live SERP Snippet Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">Preview how title tag and meta description look on search engine results pages</p>
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSerpEngine('google')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                serpEngine === 'google' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Google Preview
            </button>
            <button
              onClick={() => setSerpEngine('bing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                serpEngine === 'bing' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bing Preview
            </button>
          </div>
        </div>

        {/* Snippet Card */}
        <div className={`p-5 ${serpEngine === 'google' ? 'serp-card-google' : 'serp-card-bing'}`}>
          <div className="flex items-center space-x-2 text-xs text-slate-600 mb-1">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{auditReport.canonicalUrl}</span>
          </div>

          <h4 className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer leading-snug">
            {auditReport.title || 'Untitled Page'}
          </h4>

          <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed">
            {auditReport.metaDescription || 'No meta description configured for this URL.'}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Title Length: <strong className="text-slate-800">{auditReport.title.length} chars</strong> (Target: 50-60)</span>
            <span>Meta Length: <strong className="text-slate-800">{auditReport.metaDescription.length} chars</strong> (Target: 140-160)</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Detailed Technical Issues List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold text-white">Diagnostic Audit Recommendations</h3>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeCategoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Filter Sub-pills */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xs text-slate-500 font-semibold">Filter Status:</span>
          {['All', 'critical', 'warning', 'passed'].map((sev) => (
            <button
              key={sev}
              onClick={() => setActiveSeverityFilter(sev)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition ${
                activeSeverityFilter === sev
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {sev.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No diagnostic issues match your filter criteria.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border transition ${
                  issue.fixed
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : issue.severity === 'critical'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : issue.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      issue.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-400'
                        : issue.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {issue.severity === 'critical' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : issue.severity === 'warning' ? (
                        <Info className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-xs font-bold ${issue.fixed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {issue.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                          {issue.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1">{issue.description}</p>

                      <div className="mt-2 text-xs text-indigo-300 font-medium bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
                        <strong className="text-indigo-400">Action Step: </strong>
                        {issue.recommendation}
                      </div>

                      {issue.codeSnippet && (
                        <div className="mt-3 bg-[#080c14] p-3 rounded-lg border border-slate-800 relative group">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span className="flex items-center space-x-1">
                              <Code2 className="w-3 h-3 text-indigo-400" />
                              <span>HTML / Code Fix Snippet</span>
                            </span>
                            <button
                              onClick={() => copyCodeSnippet(issue.codeSnippet!, issue.id)}
                              className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                            >
                              {copiedSnippetId === issue.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Snippet</span>
                                </>
                              )}
                            </button>
                          </div>
                          <code className="text-[11px] font-mono text-emerald-300 break-all block">
                            {issue.codeSnippet}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fix Toggle Button */}
                  <button
                    onClick={() => toggleIssueFixed(issue.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition ${
                      issue.fixed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {issue.fixed ? 'Fixed' : 'Mark as Fixed'}
                  </button>

                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
