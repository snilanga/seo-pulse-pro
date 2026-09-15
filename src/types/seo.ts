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

export interface AuditScanLog {
  id: string;
  clientId: string;
  domain: string;
  url: string;
  timestamp: string; // ISO string e.g. "2026-09-14T11:30:00.000Z"
  formattedTime: string; // e.g. "Sep 14, 2026, 04:58 PM"
  overallScore: number;
  seoScore: number;
  performanceScore: number;
  loadTimeMs: number;
  pageSizeKb: number;
  googleRank: { page: number; position: number; keyword?: string };
  bingRank: { page: number; position: number; keyword?: string };
  issuesCount: { critical: number; warning: number; passed: number };
  status: 'passed' | 'warning' | 'critical';
  auditSnapshot?: SiteAuditReport;
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
  clientId?: string;
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

// ---------------------------------------------------------------------------
// AI SEO Research & Keyword Analysis Agent Types
// ---------------------------------------------------------------------------

export interface ResearchAgentInput {
  url: string;
  targetCountry?: string;
  targetCity?: string;
  businessType?: string;
  targetAudience?: string;
}

export interface BusinessUnderstanding {
  category: string;
  subcategory: string;
  mainServices: string[];
  targetCustomer: string[];
  targetLocation: string;
  reasoningWhy: {
    categoryReason: string;
    audienceReason: string;
    locationReason: string;
  };
}

export interface CrawledPageData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string;
  h2Headings: string[];
  h3Headings: string[];
  visibleTextSnippet: string;
  identifiedServices: string[];
  identifiedEntities: string[];
  existingKeywords: string[];
  missingElements: string[];
  urlStructureGrade: string;
  internalLinkOpportunities: string[];
  callsToAction: string[];
}

export interface ResearchPrimaryKeyword {
  keyword: string;
  intent: 'Informational' | 'Navigational' | 'Commercial Investigation' | 'Transactional' | 'Local' | string;
  relevance: number; // 0-100%
  estimatedCompetition: 'Low' | 'Medium' | 'High' | 'Very High';
  businessValue: 'High' | 'Very High';
  locationRelevance: string;
  reasonForSelection: string;
}

export interface ResearchSupportingKeyword {
  keyword: string;
  intent: 'Informational' | 'Navigational' | 'Commercial Investigation' | 'Transactional' | 'Local';
  relevanceScore: number;
  competition: 'Low' | 'Medium' | 'High';
  businessValue: 'High' | 'Medium';
  suggestedPlacement?: string;
  note?: string;
}

export interface ResearchShortTailKeyword {
  keyword: string;
  searchDemand: string;
  competition: 'High' | 'Very High' | 'Extreme';
  isRealisticTarget: boolean;
  aiVerdict: string;
}

export interface ResearchLocalKeyword {
  keyword: string;
  patternType: 'Service + City' | 'Service + Country' | 'Service + Near Me' | 'Service + Area';
  location: string;
  localIntentScore: number;
}

export interface TitleOption {
  title: string;
  charCount: number;
  primaryKeywordIncluded: boolean;
  seoScore: number;
  ctrPotential: 'High' | 'Very High' | 'Medium';
  isWarning: boolean;
}

export interface MetaDescriptionOption {
  description: string;
  charCount: number;
  primaryKeywordIncluded: boolean;
  valuePropIncluded: boolean;
  ctaIncluded: boolean;
  isRecommendedRange: boolean;
}

export interface FirstSentenceOptimization {
  sentence: string;
  hasPrimaryKeyword: boolean;
  naturalLanguage: boolean;
  clearValue: boolean;
  matchesSearchIntent: boolean;
  noKeywordStuffing: boolean;
}

export interface CompetitorResearchItem {
  url: string;
  title: string;
  mainKeyword: string;
  h1: string;
  servicesCovered: string[];
  contentStrengths: string[];
  contentWeaknesses: string[];
  keywordOpportunities: string[];
}

export interface ContentGapItem {
  contentGap: string;
  category: 'Topics' | 'Questions' | 'Services' | 'Keywords' | 'Trust Signals' | 'FAQs' | 'Local Info' | 'Conversion Elements';
  whyItMatters: string;
  recommendedAction: string;
}

export interface SeoContentBrief {
  targetKeyword: string;
  searchIntent: string;
  recommendedTitle: string;
  recommendedH1: string;
  metaDescription: string;
  urlSlug: string;
  introduction: string;
  h2Structure: string[];
  h3Structure: { h2Parent: string; h3s: string[] }[];
  supportingKeywords: string[];
  longTailKeywords: string[];
  faqs: { question: string; answer: string }[];
  recommendedCta: string;
  internalLinks: string[];
  contentGapsToAddress: string[];
}

export interface HomePageSeoRating {
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  status: 'Excellent' | 'Good - Needs Optimization' | 'Poor - Critical Fixes Needed';
  technicalScore: number;
  contentScore: number;
  onPageScore: number;
  mobileUxScore: number;
  homePageTitle: string;
  metaDescriptionPresent: boolean;
  h1TagStatus: 'Optimal' | 'Multiple Found' | 'Missing';
  coreWebVitalsGrade: 'Passed (Good)' | 'Needs Improvement' | 'Failed';
  sslSecured: boolean;
  schemaMarkupDetected: boolean;
  ratingExecutiveSummary: string;
}

export interface GoogleIndexationStatus {
  isIndexed: boolean;
  indexationLabel: 'Fully Indexed & Crawled' | 'Partially Indexed' | 'Noindex / Blocked' | 'Pending Discovery';
  googleCacheStatus: 'Active & Cached Recently' | 'Not Cached' | 'Pending';
  mobileFirstIndexing: boolean;
  robotsTxtStatus: 'Allowed (Robots.txt Valid)' | 'Blocked (Disallow)' | 'Missing Robots.txt';
  sitemapDetected: boolean;
  sitemapUrl?: string;
  canonicalCompliant: boolean;
  inspectionVerdict: string;
}

export interface BusinessRankingTrend {
  direction: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number; // e.g. +18.4% or -6.8%
  periodLabel: string; // e.g. "Past 30 Days"
  visibilityIndex: number; // e.g. 74/100
  momentumStatus: 'Strong Upward Momentum' | 'Accelerating Growth' | 'Slight Decline' | 'Critical Downturn';
  positionsGained: number;
  positionsLost: number;
  page1KeywordsCount: number;
  projectedPage1Positions: number;
  businessImpactSummary: string;
}

export interface AiSeoResearchReport {
  id: string;
  generatedAt: string;
  input: ResearchAgentInput;
  crawledPage: CrawledPageData;
  businessUnderstanding: BusinessUnderstanding;
  primaryKeyword: ResearchPrimaryKeyword;
  secondaryKeywords: ResearchSupportingKeyword[];
  longTailKeywords: ResearchSupportingKeyword[];
  shortTailKeywords: ResearchShortTailKeyword[];
  localKeywords: ResearchLocalKeyword[];
  questionKeywords: string[];
  keywordOpportunityScore: number;
  opportunityScoreExplanation: {
    relevance: number;
    intentFit: number;
    businessValue: number;
    competitionEase: number;
    localFit: number;
    summary: string;
  };
  currentSeoScore: number;
  potentialSeoScore: number;
  titleOptions: TitleOption[];
  metaOptions: MetaDescriptionOption[];
  firstSentence: FirstSentenceOptimization;
  pageRecommendations: {
    h1: string;
    h2s: string[];
    h3s: string[];
    introduction: string;
    cta: string;
    internalLinks: string[];
  };
  competitors: CompetitorResearchItem[];
  contentGaps: ContentGapItem[];
  contentBrief: SeoContentBrief;

  // Real-Time Home Page SEO & Google Indexation Rating + Business Trend
  homePageSeo: HomePageSeoRating;
  googleIndexation: GoogleIndexationStatus;
  businessTrend: BusinessRankingTrend;
}

export interface LocalCompetitorBusiness {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  mapRank: number;
  googlePageNumber: number;
  website: string;
}

export interface LocalBusinessReport {
  id: string;
  businessName: string;
  targetKeyword: string;
  city: string;
  country: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  phone: string;
  websiteUrl: string;
  hasSsl: boolean;
  
  // Google Reviews & Ratings
  rating: number; // e.g. 4.8
  totalReviews: number;
  reviewSentiment: {
    positivePercent: number;
    neutralPercent: number;
    negativePercent: number;
  };
  sampleReviews: {
    id?: string;
    author: string;
    avatar?: string;
    localGuide?: boolean;
    rating: number;
    timeAgo: string;
    text: string;
    response?: {
      author: string;
      text: string;
      timeAgo: string;
    };
  }[];

  // Real Google Business Profile details
  openingHours?: string[];
  googleMapsUrl?: string;
  googleReviewUrl?: string;
  gbpAttributes?: string[];

  // Google Ranking Position
  googleMapsPosition: number; // 1, 2, 3...
  isLocalPack: boolean; // Top 3 local pack
  googleOrganicPosition: number; // #1 - #100
  googlePageNumber: number; // 1 for 1-10, 2 for 11-20, etc.
  bingPosition: number;

  // Google Business Profile (GBP) Audit
  gbpScore: number; // 0-100
  gbpStatus: {
    isClaimed: boolean;
    hasHours: boolean;
    hasPhotos: boolean;
    photoCount: number;
    hasCategory: boolean;
    primaryCategory: string;
    hasQnA: boolean;
    regularPosts: boolean;
  };

  competitorGap: {
    topCompetitors: LocalCompetitorBusiness[];
    reviewsNeededForTop3: number;
  };

  actionPlan: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    expectedImpact: string;
  }[];
  checkedAt: string;
}

