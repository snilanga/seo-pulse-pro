import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import type { TabType } from './components/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { SiteAuditTool } from './components/audit/SiteAuditTool';
import { SerpRankTracker } from './components/serp/SerpRankTracker';
import { KeywordExplorer } from './components/keywords/KeywordExplorer';
import { CompetitorAnalysis } from './components/competitors/CompetitorAnalysis';
import { ClientReportGenerator } from './components/reports/ClientReportGenerator';
import { ClientPortalView } from './components/portal/ClientPortalView';
import { AiSeoAgent } from './components/agent/AiSeoAgent';
import { MostSearchedKeywords } from './components/keywords/MostSearchedKeywords';
import { ClientCodeInjector } from './components/keywords/ClientCodeInjector';
import { SerpPageInspector } from './components/serp/SerpPageInspector';
import { InstantDomainAudit } from './components/audit/InstantDomainAudit';
import { AiSeoResearchAgent } from './components/research/AiSeoResearchAgent';
import { AiOnPageOptimizer } from './components/onpage/AiOnPageOptimizer';
import { GoogleMapsLocalRanker } from './components/maps/GoogleMapsLocalRanker';
import { DatabaseModal } from './components/database/DatabaseModal';
import { BacklinkGenerator } from './components/backlinks/BacklinkGenerator';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginModal } from './components/auth/LoginModal';
import { Home, ArrowLeft } from 'lucide-react';


import { 
  INITIAL_CLIENTS, 
  INITIAL_KEYWORDS, 
  INITIAL_AUDIT_REPORT, 
  getClientAuditReport,
  INITIAL_COMPETITOR_DATA, 
  INITIAL_REPORT_CONFIG,
  INITIAL_BACKLINKS,
  INITIAL_OUTREACH,
  INITIAL_USERS
} from './data/initialData';
import type { ClientProject, TrackedKeyword, SiteAuditReport, ClientReportConfig, BacklinkItem, OutreachOpportunity, UserAccount, UserRole } from './types/seo';
import { runLiveSiteAudit } from './services/seoEngine';
import { dbService } from './services/dbService';

export function App() {
  const [clients, setClients] = useState<ClientProject[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<ClientProject>(INITIAL_CLIENTS[0]);
  const [activeTab, setActiveTab] = useState<TabType>('domain-checker');
  const [isClientPortal, setIsClientPortal] = useState(false);

  // User Auth & Admin State
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState<boolean>(false);

  // Client Specific Data State
  const [keywords, setKeywords] = useState<TrackedKeyword[]>(INITIAL_KEYWORDS);
  const [auditReport, setAuditReport] = useState<SiteAuditReport>(INITIAL_AUDIT_REPORT);
  const [competitors] = useState(INITIAL_COMPETITOR_DATA);
  const [reportConfig, setReportConfig] = useState<ClientReportConfig>(INITIAL_REPORT_CONFIG);
  const [backlinks, setBacklinks] = useState<BacklinkItem[]>(INITIAL_BACKLINKS);
  const [outreachOps] = useState<OutreachOpportunity[]>(INITIAL_OUTREACH);
  const [activeKeywordsToDeploy, setActiveKeywordsToDeploy] = useState<string[]>([]);

  // Filter client data
  const currentKeywords = keywords.filter(k => k.clientId === selectedClient.id);
  const currentCompetitors = competitors.filter(c => c.clientId === selectedClient.id);

  // User Auth Handlers
  const handleSelectUser = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.clientId) {
      const matchClient = clients.find(c => c.id === user.clientId);
      if (matchClient) setSelectedClient(matchClient);
    }
  };

  const handleAddUser = (newUser: UserAccount) => {
    setUsers([newUser, ...users]);
  };

  const handleUpdateUserRole = (userId: string, role: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  // Handle client selection switch
  const handleSelectClient = (client: ClientProject) => {
    setSelectedClient(client);
    // Adjust report config for selected client
    setReportConfig({
      ...reportConfig,
      clientId: client.id,
      clientName: client.name
    });

    // Retrieve or generate accurate client audit report
    const savedAudits = dbService.getSavedSiteAudits();
    const existingAudit = savedAudits.find(a => a.clientId === client.id || a.url.includes(client.domain));
    if (existingAudit) {
      setAuditReport(existingAudit);
    } else {
      setAuditReport(getClientAuditReport(client));
    }
  };

  // Run Quick Audit from Navbar
  const handleRunQuickAudit = async (url: string) => {
    setActiveTab('domain-checker');
    const newAudit = await runLiveSiteAudit({ url, clientId: selectedClient.id });
    setAuditReport(newAudit);
    dbService.saveSiteAudit(newAudit);
  };

  // Add new client modal action
  const handleAddNewClient = () => {
    const name = prompt('Enter new Client Business Name (e.g. Acme Commerce):');
    if (!name) return;
    const domain = prompt('Enter Client Website Domain (e.g. acmecommerce.com):') || `${name.toLowerCase().replace(/\s+/g, '')}.com`;

    const newClient: ClientProject = {
      id: `client-${Date.now()}`,
      name,
      domain,
      logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=120&h=120&q=80',
      industry: 'E-Commerce & Digital Services',
      targetRegion: 'United States',
      createdAt: new Date().toISOString().split('T')[0],
      healthScore: 82,
      monthlyTraffic: 12400,
      trafficGrowth: 18.2,
      keywordsCount: 45,
      page1Keywords: 12,
      top3Keywords: 4,
      backlinksCount: 450,
      domainRating: 48,
      status: 'active'
    };

    const newAudit = getClientAuditReport(newClient);
    setClients([newClient, ...clients]);
    setSelectedClient(newClient);
    setAuditReport(newAudit);
    dbService.saveSiteAudit(newAudit);
  };

  const handleAddTrackedKeyword = (newKw: TrackedKeyword) => {
    setKeywords([newKw, ...keywords]);
  };

  const handleAddBacklink = (newBL: BacklinkItem) => {
    setBacklinks(prev => [newBL, ...prev]);
  };

  const handleAddMultipleBacklinks = (newBLs: BacklinkItem[]) => {
    setBacklinks(prev => [...newBLs, ...prev]);
  };

  const handleDeleteBacklink = (id: string) => {
    setBacklinks(prev => prev.filter(b => b.id !== id));
  };

  const criticalIssuesCount = auditReport.issues.filter(i => i.severity === 'critical' && !i.fixed).length;
  const page1KeywordsCount = currentKeywords.filter(k => k.googlePosition.page1 || k.bingPosition.page1).length;


  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        clients={clients}
        selectedClient={selectedClient}
        currentUser={currentUser}
        onSelectClient={handleSelectClient}
        isClientPortal={isClientPortal}
        onTogglePortalMode={() => setIsClientPortal(!isClientPortal)}
        onRunQuickAudit={handleRunQuickAudit}
        onAddNewClient={handleAddNewClient}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenAdminDashboard={() => setActiveTab('admin')}
        onOpenDatabaseModal={() => setShowDatabaseModal(true)}
      />


      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation (Hidden in Client Portal View or Print) */}
        {!isClientPortal && (
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            page1KeywordsCount={page1KeywordsCount}
            criticalIssuesCount={criticalIssuesCount}
            clientDomain={selectedClient.domain}
            isSuperAdmin={currentUser.role === 'super_admin'}
          />
        )}

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Universal Navigation Breadcrumbs & Back to Dashboard button */}
          {!isClientPortal && activeTab !== 'dashboard' && (
            <div className="mb-5 flex items-center justify-between bg-slate-900/90 border border-slate-800/90 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition"
                  title="Go to Home Overview Dashboard"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home Dashboard</span>
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-slate-200 capitalize font-medium">
                  {activeTab.replace('-', ' ')}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
                <span>← Back to Dashboard</span>
              </button>
            </div>
          )}

          {isClientPortal ? (
            <ClientPortalView
              client={selectedClient}
              keywords={currentKeywords}
              audit={auditReport}
              onExportReport={() => {
                setIsClientPortal(false);
                setActiveTab('reports');
              }}
            />
          ) : (
            <>
              {activeTab === 'domain-checker' && (
                <InstantDomainAudit
                  currentClient={selectedClient}
                  currentAudit={auditReport}
                  clientKeywords={currentKeywords}
                  onUpdateAudit={setAuditReport}
                  onEnterFullDashboard={() => setActiveTab('dashboard')}
                  onRunAiAgentSprint={() => setActiveTab('ai-agent')}
                  onAddTrackedKeyword={handleAddTrackedKeyword}
                />
              )}

              {activeTab === 'research-agent' && (
                <AiSeoResearchAgent
                  client={selectedClient}
                  onAddKeyword={handleAddTrackedKeyword}
                />
              )}

              {activeTab === 'onpage-optimizer' && (
                <AiOnPageOptimizer
                  client={selectedClient}
                  onAddTrackedKeyword={handleAddTrackedKeyword}
                  onNavigateToCodeInjector={(kwList) => {
                    setActiveKeywordsToDeploy(kwList);
                    setActiveTab('code-injector');
                  }}
                  onBackToHome={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'maps-checker' && (
                <GoogleMapsLocalRanker
                  initialBusinessName={selectedClient.name}
                  initialDomain={selectedClient.domain}
                  initialCity={selectedClient.targetRegion?.split(' ')[0] || 'Colombo'}
                  onBackToHome={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'dashboard' && (

                <OverviewDashboard
                  client={selectedClient}
                  keywords={currentKeywords}
                  audit={auditReport}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'ai-agent' && (
                <AiSeoAgent
                  client={selectedClient}
                  audit={auditReport}
                  onUpdateAudit={setAuditReport}
                  onAddKeyword={handleAddTrackedKeyword}
                />
              )}

              {activeTab === 'backlinks' && (
                <BacklinkGenerator
                  client={selectedClient}
                  backlinks={backlinks}
                  outreachOps={outreachOps}
                  onAddBacklink={handleAddBacklink}
                  onAddMultipleBacklinks={handleAddMultipleBacklinks}
                  onDeleteBacklink={handleDeleteBacklink}
                />
              )}


              {activeTab === 'page-inspector' && (
                <SerpPageInspector
                  keywords={currentKeywords}
                  onNavigateToAuditor={() => setActiveTab('audit')}
                />
              )}

              {activeTab === 'trending-keywords' && (
                <MostSearchedKeywords
                  client={selectedClient}
                  onAddTrackedKeyword={handleAddTrackedKeyword}
                  onNavigateToCodeInjector={(kwList) => {
                    setActiveKeywordsToDeploy(kwList);
                    setActiveTab('code-injector');
                  }}
                />
              )}

              {activeTab === 'code-injector' && (
                <ClientCodeInjector
                  client={selectedClient}
                  keywordsList={activeKeywordsToDeploy}
                  trackedKeywords={currentKeywords}
                />
              )}

              {activeTab === 'audit' && (
                <SiteAuditTool
                  auditReport={auditReport}
                  onUpdateAudit={setAuditReport}
                  clientId={selectedClient.id}
                />
              )}

              {activeTab === 'serp' && (
                <SerpRankTracker
                  keywords={currentKeywords}
                  onAddKeyword={handleAddTrackedKeyword}
                  clientId={selectedClient.id}
                />
              )}

              {activeTab === 'keywords' && (
                <KeywordExplorer
                  onAddTrackedKeyword={handleAddTrackedKeyword}
                  clientId={selectedClient.id}
                />
              )}

              {activeTab === 'competitors' && (
                <CompetitorAnalysis
                  client={selectedClient}
                  competitors={currentCompetitors}
                  onAddTrackedKeyword={handleAddTrackedKeyword}
                />
              )}

              {activeTab === 'admin' && (
                <AdminDashboard
                  currentUser={currentUser}
                  users={users}
                  clients={clients}
                  onAddUser={handleAddUser}
                  onUpdateUserRole={handleUpdateUserRole}
                  onToggleUserStatus={handleToggleUserStatus}
                />
              )}

              {activeTab === 'reports' && (
                <ClientReportGenerator
                  client={selectedClient}
                  keywords={currentKeywords}
                  audit={auditReport}
                  reportConfig={reportConfig}
                  onUpdateConfig={setReportConfig}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Central Database Storage Modal */}
      <DatabaseModal
        isOpen={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
        clients={clients}
        keywords={keywords}
      />

      {/* Login / Auth Switch Modal */}
      {showLoginModal && (
        <LoginModal
          users={users}
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onClose={() => setShowLoginModal(false)}
        />
      )}


    </div>
  );
}

export default App;

