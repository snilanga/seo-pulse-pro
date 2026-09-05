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
import { TrendingKeywords } from './components/keywords/TrendingKeywords';
import { ClientCodeInjector } from './components/keywords/ClientCodeInjector';
import { SerpPageInspector } from './components/serp/SerpPageInspector';
import { InstantDomainAudit } from './components/audit/InstantDomainAudit';
import { BacklinkGenerator } from './components/backlinks/BacklinkGenerator';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginModal } from './components/auth/LoginModal';

import { 
  INITIAL_CLIENTS, 
  INITIAL_KEYWORDS, 
  INITIAL_AUDIT_REPORT, 
  INITIAL_COMPETITOR_DATA, 
  INITIAL_REPORT_CONFIG,
  INITIAL_BACKLINKS,
  INITIAL_OUTREACH,
  INITIAL_USERS
} from './data/initialData';
import type { ClientProject, TrackedKeyword, SiteAuditReport, ClientReportConfig, BacklinkItem, OutreachOpportunity, UserAccount, UserRole } from './types/seo';
import { runLiveSiteAudit } from './services/seoEngine';

export function App() {
  const [clients, setClients] = useState<ClientProject[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<ClientProject>(INITIAL_CLIENTS[0]);
  const [activeTab, setActiveTab] = useState<TabType>('domain-checker');
  const [isClientPortal, setIsClientPortal] = useState(false);

  // User Auth & Admin State
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Client Specific Data State
  const [keywords, setKeywords] = useState<TrackedKeyword[]>(INITIAL_KEYWORDS);
  const [auditReport, setAuditReport] = useState<SiteAuditReport>(INITIAL_AUDIT_REPORT);
  const [competitors] = useState(INITIAL_COMPETITOR_DATA);
  const [reportConfig, setReportConfig] = useState<ClientReportConfig>(INITIAL_REPORT_CONFIG);
  const [backlinks, setBacklinks] = useState<BacklinkItem[]>(INITIAL_BACKLINKS);
  const [outreachOps] = useState<OutreachOpportunity[]>(INITIAL_OUTREACH);
  const [activeKeywordsToDeploy, setActiveKeywordsToDeploy] = useState<string[]>([
    'virtual doctor consultation online',
    'same day telehealth appointment',
    'online prescription renewal clinic'
  ]);

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
  };

  // Run Quick Audit from Navbar
  const handleRunQuickAudit = async (url: string) => {
    setActiveTab('audit');
    const newAudit = await runLiveSiteAudit({ url, clientId: selectedClient.id });
    setAuditReport(newAudit);
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

    setClients([newClient, ...clients]);
    setSelectedClient(newClient);
  };

  const handleAddTrackedKeyword = (newKw: TrackedKeyword) => {
    setKeywords([newKw, ...keywords]);
  };

  const handleAddBacklink = (newBL: BacklinkItem) => {
    setBacklinks([newBL, ...backlinks]);
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
                  onUpdateAudit={setAuditReport}
                  onEnterFullDashboard={() => setActiveTab('dashboard')}
                  onRunAiAgentSprint={() => setActiveTab('ai-agent')}
                  onAddTrackedKeyword={handleAddTrackedKeyword}
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
                />
              )}

              {activeTab === 'page-inspector' && (
                <SerpPageInspector
                  keywords={currentKeywords}
                  onNavigateToAuditor={() => setActiveTab('audit')}
                />
              )}

              {activeTab === 'trending-keywords' && (
                <TrendingKeywords
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

