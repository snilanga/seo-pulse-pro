export type EngineType = 'google' | 'bing';
export type DeviceType = 'desktop' | 'mobile';
export type IssueSeverity = 'critical' | 'warning' | 'info' | 'passed';

export interface ClientProject {
  id: string;
  name: string;
  domain: string;
  logo: string;
  industry: string;
  targetRegion: string;
  createdAt: string;
  healthScore: number;
  monthlyTraffic: number;
  trafficGrowth: number;
  keywordsCount: number;
  page1Keywords: number;
  top3Keywords: number;
  backlinksCount: number;
  domainRating: number;
  status: 'active' | 'paused' | 'onboarding';
}

export interface SerpPosition {
  engine: EngineType;
  device: DeviceType;
  position: number;
  previousPosition: number;
  url: string;
  serpFeatures: string[]; // e.g. ['Featured Snippet', 'People Also Ask', 'Local Pack']
  page1: boolean;
}

export interface TrackedKeyword {
  id: string;
  clientId: string;
  keyword: string;
  searchVolume: number;
  difficulty: number; // 0-100
  cpc: number;
  intent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational';
  googlePosition: SerpPosition;
  bingPosition: SerpPosition;
  updatedAt: string;
  tags: string[];
  history: { date: string; googlePos: number; bingPos: number }[];
}

export interface AuditIssue {
  id: string;
  category: 'Meta Tags' | 'Content & Headings' | 'Performance & Speed' | 'Mobile & UX' | 'Security & Tech';
  title: string;
  description: string;
  severity: IssueSeverity;
  affectedUrls: string[];
  impactScore: number; // 1-10
  recommendation: string;
  codeSnippet?: string;
  fixed: boolean;
}

export interface SiteAuditReport {
  id: string;
  clientId: string;
  url: string;
  scannedAt: string;
  overallScore: number;
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  h1Count: number;
  h2Count: number;
  imagesWithoutAlt: number;
  totalImages: number;
  loadTimeMs: number;
  pageSizeKb: number;
  issues: AuditIssue[];
}

export interface CompetitorData {
  id: string;
  clientId: string;
  name: string;
  domain: string;
  domainAuthority: number;
  organicKeywords: number;
  sharedKeywords: number;
  gapKeywords: {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    clientPos: number | null;
    competitorPos: number;
  }[];
}

export interface ClientReportConfig {
  clientId: string;
  reportTitle: string;
  agencyName: string;
  agencyLogo?: string;
  clientName: string;
  clientLogo?: string;
  dateRange: string;
  executiveSummary: string;
  includeHealthAudit: boolean;
  includeSerpRankings: boolean;
  includeKeywords: boolean;
  includeCompetitorGap: boolean;
  includeRoadmap: boolean;
  customRoadmapItems: { task: string; status: 'completed' | 'in-progress' | 'planned'; impact: string }[];
}

export interface AiAgentActionLog {
  id: string;
  timestamp: string;
  type: 'meta_optimization' | 'keyword_ingestion' | 'schema_generation' | 'alt_remediation' | 'audit_fix';
  clientDomain: string;
  actionTitle: string;
  reasoning: string;
  generatedContent?: string;
  status: 'applied' | 'pending_approval' | 'reverted';
  confidenceScore: number; // 0-100%
}

export interface AiAgentSettings {
  autoFixMetaTags: boolean;
  autoDiscoverKeywords: boolean;
  autoGenerateSchema: boolean;
  autoRemediateAltText: boolean;
  autoPublishReports: boolean;
  minConfidenceThreshold: number;
}

export interface BacklinkItem {
  id: string;
  clientId: string;
  referringDomain: string;
  referringPageTitle: string;
  targetUrl: string;
  domainRating: number;
  anchorText: string;
  linkType: 'dofollow' | 'nofollow';
  category: 'Web 2.0' | 'Tech Directory' | 'Edu/Gov Citation' | 'Niche Blog' | 'Press Release';
  status: 'indexed' | 'submitted' | 'pinged' | 'pending';
  toxicityScore: number; // 0-100 (0 = safe, >50 = toxic)
  createdAt: string;
}

export interface OutreachOpportunity {
  id: string;
  clientId: string;
  websiteName: string;
  domain: string;
  domainAuthority: number;
  niche: string;
  contactEmail: string;
  suggestedTopic: string;
  estimatedTraffic: number;
  status: 'new' | 'pitched' | 'accepted' | 'live';
}

export type UserRole = 'super_admin' | 'client_manager' | 'seo_analyst';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  clientId?: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

export interface AiKeywordCategorization {
  primary: TrackedKeyword[];
  longTail: TrackedKeyword[];
  shortTail: TrackedKeyword[];
  bestRoi: TrackedKeyword[];
}

export interface DomainVerificationState {
  domain: string;
  verificationToken: string;
  verificationFileName: string;
  status: 'unverified' | 'verifying' | 'verified' | 'failed';
  verifiedAt?: string;
}




