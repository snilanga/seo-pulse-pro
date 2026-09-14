import type { ClientProject, TrackedKeyword, SiteAuditReport, CompetitorData, ClientReportConfig, AuditScanLog } from '../types/seo';

export const INITIAL_CLIENTS: ClientProject[] = [
  {
    id: 'client-1',
    name: 'Apex Health Solutions',
    domain: 'apexhealthsolutions.com',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=120&h=120&q=80',
    industry: 'Healthcare & Telemedicine',
    targetRegion: 'United States',
    createdAt: '2025-01-10',
    healthScore: 88,
    monthlyTraffic: 42500,
    trafficGrowth: 24.5,
    keywordsCount: 142,
    page1Keywords: 38,
    top3Keywords: 14,
    backlinksCount: 1850,
    domainRating: 64,
    status: 'active'
  },
  {
    id: 'client-2',
    name: 'Nexus Cloud Tech',
    domain: 'nexuscloudtech.io',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
    industry: 'B2B SaaS & Cloud Security',
    targetRegion: 'Global / North America',
    createdAt: '2025-02-01',
    healthScore: 74,
    monthlyTraffic: 18900,
    trafficGrowth: 38.2,
    keywordsCount: 98,
    page1Keywords: 21,
    top3Keywords: 7,
    backlinksCount: 940,
    domainRating: 52,
    status: 'active'
  },
  {
    id: 'client-3',
    name: 'UrbanCraft Living',
    domain: 'urbancraftliving.shop',
    logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=120&h=120&q=80',
    industry: 'Home Decor E-Commerce',
    targetRegion: 'United States & Canada',
    createdAt: '2025-03-15',
    healthScore: 92,
    monthlyTraffic: 68400,
    trafficGrowth: 15.8,
    keywordsCount: 285,
    page1Keywords: 64,
    top3Keywords: 26,
    backlinksCount: 3420,
    domainRating: 71,
    status: 'active'
  }
];

export const INITIAL_KEYWORDS: TrackedKeyword[] = [
  {
    id: 'kw-1',
    clientId: 'client-1',
    keyword: 'virtual doctor consultation online',
    searchVolume: 14800,
    difficulty: 68,
    cpc: 4.85,
    intent: 'Transactional',
    tags: ['Core Service', 'Telehealth', 'High Intent'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 2,
      previousPosition: 4,
      url: 'https://apexhealthsolutions.com/virtual-consultation',
      serpFeatures: ['Featured Snippet', 'People Also Ask'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 3,
      previousPosition: 5,
      url: 'https://apexhealthsolutions.com/virtual-consultation',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 7, bingPos: 9 },
      { date: 'Aug 10', googlePos: 5, bingPos: 7 },
      { date: 'Aug 20', googlePos: 4, bingPos: 5 },
      { date: 'Sep 1', googlePos: 2, bingPos: 3 }
    ]
  },
  {
    id: 'kw-2',
    clientId: 'client-1',
    keyword: 'same day telehealth appointment',
    searchVolume: 9200,
    difficulty: 54,
    cpc: 3.90,
    intent: 'Transactional',
    tags: ['Urgent Care', 'Conversion'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 1,
      previousPosition: 2,
      url: 'https://apexhealthsolutions.com/same-day-telehealth',
      serpFeatures: ['Featured Snippet', 'Local Map Pack'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 1,
      previousPosition: 1,
      url: 'https://apexhealthsolutions.com/same-day-telehealth',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 4, bingPos: 3 },
      { date: 'Aug 10', googlePos: 3, bingPos: 2 },
      { date: 'Aug 20', googlePos: 2, bingPos: 1 },
      { date: 'Sep 1', googlePos: 1, bingPos: 1 }
    ]
  },
  {
    id: 'kw-3',
    clientId: 'client-1',
    keyword: 'online prescription renewal clinic',
    searchVolume: 18200,
    difficulty: 75,
    cpc: 6.20,
    intent: 'Commercial',
    tags: ['Rx', 'High Traffic'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 5,
      previousPosition: 8,
      url: 'https://apexhealthsolutions.com/online-prescriptions',
      serpFeatures: ['People Also Ask'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 4,
      previousPosition: 6,
      url: 'https://apexhealthsolutions.com/online-prescriptions',
      serpFeatures: [],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 12, bingPos: 14 },
      { date: 'Aug 10', googlePos: 9, bingPos: 10 },
      { date: 'Aug 20', googlePos: 8, bingPos: 6 },
      { date: 'Sep 1', googlePos: 5, bingPos: 4 }
    ]
  },
  {
    id: 'kw-4',
    clientId: 'client-1',
    keyword: 'holistic primary care telemedicine',
    searchVolume: 4400,
    difficulty: 42,
    cpc: 2.75,
    intent: 'Informational',
    tags: ['Longtail', 'Niche'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 3,
      previousPosition: 3,
      url: 'https://apexhealthsolutions.com/primary-care',
      serpFeatures: ['People Also Ask'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 2,
      previousPosition: 2,
      url: 'https://apexhealthsolutions.com/primary-care',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 5, bingPos: 4 },
      { date: 'Aug 10', googlePos: 4, bingPos: 3 },
      { date: 'Aug 20', googlePos: 3, bingPos: 2 },
      { date: 'Sep 1', googlePos: 3, bingPos: 2 }
    ]
  },
  {
    id: 'kw-5',
    clientId: 'client-1',
    keyword: 'affordable virtual healthcare plans',
    searchVolume: 12500,
    difficulty: 71,
    cpc: 5.40,
    intent: 'Commercial',
    tags: ['Plans', 'Pricing'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 11,
      previousPosition: 14,
      url: 'https://apexhealthsolutions.com/pricing',
      serpFeatures: [],
      page1: false
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 9,
      previousPosition: 12,
      url: 'https://apexhealthsolutions.com/pricing',
      serpFeatures: ['People Also Ask'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 18, bingPos: 17 },
      { date: 'Aug 10', googlePos: 16, bingPos: 15 },
      { date: 'Aug 20', googlePos: 14, bingPos: 12 },
      { date: 'Sep 1', googlePos: 11, bingPos: 9 }
    ]
  },
  // Nexus Cloud Tech Keywords
  {
    id: 'kw-6',
    clientId: 'client-2',
    keyword: 'zero trust cloud security platform',
    searchVolume: 22000,
    difficulty: 82,
    cpc: 18.50,
    intent: 'Commercial',
    tags: ['Enterprise', 'Core SaaS'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 4,
      previousPosition: 7,
      url: 'https://nexuscloudtech.io/zero-trust-platform',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 3,
      previousPosition: 5,
      url: 'https://nexuscloudtech.io/zero-trust-platform',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 11, bingPos: 9 },
      { date: 'Aug 10', googlePos: 8, bingPos: 7 },
      { date: 'Aug 20', googlePos: 7, bingPos: 5 },
      { date: 'Sep 1', googlePos: 4, bingPos: 3 }
    ]
  },
  {
    id: 'kw-7',
    clientId: 'client-2',
    keyword: 'automated cloud compliance monitoring',
    searchVolume: 8900,
    difficulty: 64,
    cpc: 12.20,
    intent: 'Transactional',
    tags: ['Compliance', 'Feature'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 2,
      previousPosition: 3,
      url: 'https://nexuscloudtech.io/compliance-monitoring',
      serpFeatures: ['People Also Ask'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 1,
      previousPosition: 2,
      url: 'https://nexuscloudtech.io/compliance-monitoring',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 5, bingPos: 4 },
      { date: 'Aug 10', googlePos: 4, bingPos: 3 },
      { date: 'Aug 20', googlePos: 3, bingPos: 2 },
      { date: 'Sep 1', googlePos: 2, bingPos: 1 }
    ]
  },
  // UrbanCraft Living Keywords (Client-3)
  {
    id: 'kw-8',
    clientId: 'client-3',
    keyword: 'modern minimalist home decor shop',
    searchVolume: 34500,
    difficulty: 66,
    cpc: 3.80,
    intent: 'Commercial',
    tags: ['E-Commerce', 'Decor'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 1,
      previousPosition: 3,
      url: 'https://urbancraftliving.shop/minimalist-decor',
      serpFeatures: ['Featured Snippet', 'Image Pack'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 2,
      previousPosition: 4,
      url: 'https://urbancraftliving.shop/minimalist-decor',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 6, bingPos: 7 },
      { date: 'Aug 10', googlePos: 4, bingPos: 5 },
      { date: 'Aug 20', googlePos: 3, bingPos: 3 },
      { date: 'Sep 1', googlePos: 1, bingPos: 2 }
    ]
  },
  {
    id: 'kw-9',
    clientId: 'client-3',
    keyword: 'handcrafted wooden furniture online',
    searchVolume: 18900,
    difficulty: 58,
    cpc: 4.50,
    intent: 'Transactional',
    tags: ['Furniture', 'High Value'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 3,
      previousPosition: 5,
      url: 'https://urbancraftliving.shop/wooden-furniture',
      serpFeatures: ['People Also Ask'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 1,
      previousPosition: 3,
      url: 'https://urbancraftliving.shop/wooden-furniture',
      serpFeatures: ['Featured Snippet'],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 8, bingPos: 6 },
      { date: 'Aug 10', googlePos: 5, bingPos: 4 },
      { date: 'Aug 20', googlePos: 4, bingPos: 2 },
      { date: 'Sep 1', googlePos: 3, bingPos: 1 }
    ]
  },
  {
    id: 'kw-10',
    clientId: 'client-3',
    keyword: 'luxury ceramic vase living room set',
    searchVolume: 12400,
    difficulty: 45,
    cpc: 2.90,
    intent: 'Transactional',
    tags: ['Vases', 'Accessories'],
    updatedAt: '2026-09-02',
    googlePosition: {
      engine: 'google',
      device: 'desktop',
      position: 2,
      previousPosition: 4,
      url: 'https://urbancraftliving.shop/vases',
      serpFeatures: ['Image Pack'],
      page1: true
    },
    bingPosition: {
      engine: 'bing',
      device: 'desktop',
      position: 2,
      previousPosition: 3,
      url: 'https://urbancraftliving.shop/vases',
      serpFeatures: [],
      page1: true
    },
    history: [
      { date: 'Aug 1', googlePos: 7, bingPos: 6 },
      { date: 'Aug 10', googlePos: 5, bingPos: 4 },
      { date: 'Aug 20', googlePos: 3, bingPos: 3 },
      { date: 'Sep 1', googlePos: 2, bingPos: 2 }
    ]
  }
];

export const CLIENT_AUDIT_REPORTS: Record<string, SiteAuditReport> = {
  'client-1': {
    id: 'audit-client-1',
    clientId: 'client-1',
    url: 'https://apexhealthsolutions.com',
    scannedAt: 'Sep 14, 2026, 09:30 AM',
    overallScore: 88,
    performanceScore: 91,
    seoScore: 89,
    accessibilityScore: 94,
    bestPracticesScore: 90,
    title: 'Apex Health Solutions | 24/7 Virtual Doctor & Telehealth Clinic',
    metaDescription: 'Access certified doctors 24/7 with Apex Health Solutions. Fast online prescription renewals, same-day appointments, and comprehensive virtual care.',
    canonicalUrl: 'https://apexhealthsolutions.com/',
    h1Count: 1,
    h2Count: 8,
    imagesWithoutAlt: 2,
    totalImages: 18,
    loadTimeMs: 840,
    pageSizeKb: 1240,
    issues: [
      {
        id: 'issue-1',
        category: 'Meta Tags',
        title: 'Meta Description Optimal Length',
        description: 'Your meta description is 152 characters long, fitting perfectly inside Google & Bing snippet limits (150-160 chars).',
        severity: 'passed',
        affectedUrls: ['https://apexhealthsolutions.com'],
        impactScore: 10,
        recommendation: 'Keep maintaining rich target keywords inside meta descriptions for high Click-Through Rate (CTR).',
        fixed: true
      },
      {
        id: 'issue-2',
        category: 'Content & Headings',
        title: '2 Product Images Missing ALT Text',
        description: 'Search engine bots (Googlebot & Bingbot) rely on ALT attributes to understand image contents and index them in Image Search.',
        severity: 'warning',
        affectedUrls: ['/assets/doctor-banner.jpg', '/assets/telehealth-app-screen.png'],
        impactScore: 7,
        recommendation: 'Add descriptive ALT attributes containing primary target keywords such as alt="Board-certified telehealth doctor consultation".',
        codeSnippet: '<img src="/assets/doctor-banner.jpg" alt="Board certified telehealth doctor in consultation" />',
        fixed: false
      },
      {
        id: 'issue-3',
        category: 'Security & Tech',
        title: 'Schema.org MedicalWebPage Structured Data Implemented',
        description: 'MedicalWebPage JSON-LD schema detected. Helps Google & Bing display rich snippets and trust badges on Page 1.',
        severity: 'passed',
        affectedUrls: ['https://apexhealthsolutions.com'],
        impactScore: 9,
        recommendation: 'Maintain JSON-LD schema accuracy during future content updates.',
        fixed: true
      },
      {
        id: 'issue-4',
        category: 'Performance & Speed',
        title: 'Unused CSS / Render Blocking Scripts on Mobile',
        description: 'Mobile render blocking delayed Largest Contentful Paint (LCP) by 240ms on simulated 4G mobile devices.',
        severity: 'critical',
        affectedUrls: ['https://apexhealthsolutions.com/assets/styles.css'],
        impactScore: 9,
        recommendation: 'Inline critical CSS, add async or defer attributes to non-essential JavaScript tags.',
        codeSnippet: '<script src="/assets/analytics.js" defer></script>',
        fixed: false
      },
      {
        id: 'issue-5',
        category: 'Mobile & UX',
        title: 'Viewport Tag Configured Properly',
        description: 'Mobile viewports fit seamlessly across iOS, Android, and Desktop display sizes.',
        severity: 'passed',
        affectedUrls: ['https://apexhealthsolutions.com'],
        impactScore: 8,
        recommendation: 'No action required.',
        fixed: true
      }
    ]
  },
  'client-2': {
    id: 'audit-client-2',
    clientId: 'client-2',
    url: 'https://nexuscloudtech.io',
    scannedAt: 'Sep 14, 2026, 11:15 AM',
    overallScore: 74,
    performanceScore: 78,
    seoScore: 75,
    accessibilityScore: 88,
    bestPracticesScore: 82,
    title: 'Nexus Cloud Tech | Zero Trust Cloud Security & Threat Intelligence SaaS',
    metaDescription: 'Secure multi-cloud infrastructure with Nexus Cloud Tech. Automated zero trust enforcement, IAM compliance, and continuous threat mitigation.',
    canonicalUrl: 'https://nexuscloudtech.io/',
    h1Count: 1,
    h2Count: 6,
    imagesWithoutAlt: 4,
    totalImages: 14,
    loadTimeMs: 1120,
    pageSizeKb: 1680,
    issues: [
      {
        id: 'issue-nexus-1',
        category: 'Meta Tags',
        title: 'Title Tag Optimal Length',
        description: 'Title tag is 68 characters, targeting enterprise cloud security and zero trust keywords.',
        severity: 'passed',
        affectedUrls: ['https://nexuscloudtech.io'],
        impactScore: 10,
        recommendation: 'Maintain focus on zero trust cloud security positioning.',
        fixed: true
      },
      {
        id: 'issue-nexus-2',
        category: 'Security & Tech',
        title: 'Content-Security-Policy (CSP) Header Missing',
        description: 'No HTTP Content-Security-Policy header detected. Enterprise clients and search engine scanners require strict CSP policies.',
        severity: 'critical',
        affectedUrls: ['https://nexuscloudtech.io'],
        impactScore: 9,
        recommendation: 'Deploy standard CSP headers on reverse proxy or CDN edge.',
        codeSnippet: 'Content-Security-Policy: default-src \'self\'; script-src \'self\' https://trustedscripts.com;',
        fixed: false
      },
      {
        id: 'issue-nexus-3',
        category: 'Content & Headings',
        title: '4 Product Diagram Images Missing ALT Text',
        description: 'Cloud architecture diagrams lack descriptive ALT text, preventing bot indexation.',
        severity: 'warning',
        affectedUrls: ['/images/zero-trust-architecture.svg', '/images/iam-flow.png'],
        impactScore: 7,
        recommendation: 'Add descriptive alt text to all technical architecture diagrams.',
        codeSnippet: '<img src="/images/zero-trust-architecture.svg" alt="Nexus Zero Trust Cloud Security Architecture Diagram" />',
        fixed: false
      },
      {
        id: 'issue-nexus-4',
        category: 'Security & Tech',
        title: 'Schema.org SoftwareApplication JSON-LD Valid',
        description: 'SoftwareApplication JSON-LD schema correctly communicates SaaS capabilities and pricing tiers to Google.',
        severity: 'passed',
        affectedUrls: ['https://nexuscloudtech.io'],
        impactScore: 8,
        recommendation: 'Keep SaaS release version and pricing details synchronized.',
        fixed: true
      }
    ]
  },
  'client-3': {
    id: 'audit-client-3',
    clientId: 'client-3',
    url: 'https://urbancraftliving.shop',
    scannedAt: 'Sep 14, 2026, 02:45 PM',
    overallScore: 92,
    performanceScore: 94,
    seoScore: 91,
    accessibilityScore: 96,
    bestPracticesScore: 95,
    title: 'UrbanCraft Living | Modern Minimalist Home Decor & Handcrafted Furniture',
    metaDescription: 'Transform your living space with UrbanCraft Living. Shop artisan wooden furniture, ceramic vases, and Scandinavian-inspired minimalist interior decor.',
    canonicalUrl: 'https://urbancraftliving.shop/',
    h1Count: 1,
    h2Count: 12,
    imagesWithoutAlt: 1,
    totalImages: 32,
    loadTimeMs: 640,
    pageSizeKb: 920,
    issues: [
      {
        id: 'issue-urban-1',
        category: 'Meta Tags',
        title: 'SEO Title & Meta Description Snippets Perfect',
        description: 'Title (67 chars) and Meta Description (154 chars) achieve 100% SERP display coverage on desktop and mobile.',
        severity: 'passed',
        affectedUrls: ['https://urbancraftliving.shop'],
        impactScore: 10,
        recommendation: 'Continue updating seasonal collection keywords.',
        fixed: true
      },
      {
        id: 'issue-urban-2',
        category: 'Performance & Speed',
        title: 'Catalog Images Missing WebP / AVIF Modern Formats',
        description: 'Product photo thumbnails are served in legacy JPEG format instead of modern next-gen WebP or AVIF.',
        severity: 'warning',
        affectedUrls: ['/catalog/dining-table.jpg', '/catalog/lounge-chair.jpg'],
        impactScore: 6,
        recommendation: 'Serve next-generation image formats via CDN image optimization.',
        codeSnippet: '<picture><source srcset="/catalog/dining-table.webp" type="image/webp"><img src="/catalog/dining-table.jpg" alt="Minimalist Walnut Dining Table" /></picture>',
        fixed: false
      },
      {
        id: 'issue-urban-3',
        category: 'Security & Tech',
        title: 'Schema.org Product & Organization JSON-LD Implemented',
        description: 'Rich snippet review stars ($price, inStock) successfully recognized by Googlebot.',
        severity: 'passed',
        affectedUrls: ['https://urbancraftliving.shop/products/walnut-table'],
        impactScore: 9,
        recommendation: 'Ensure stock levels and customer star ratings remain synchronized.',
        fixed: true
      },
      {
        id: 'issue-urban-4',
        category: 'Security & Tech',
        title: 'Full HTTPS Security & HSTS Header Active',
        description: 'Encrypted SSL connection verified with Strict-Transport-Security (HSTS).',
        severity: 'passed',
        affectedUrls: ['https://urbancraftliving.shop'],
        impactScore: 10,
        recommendation: 'Maintain automated SSL renewal on Cloudflare edge.',
        fixed: true
      }
    ]
  }
};

export function getClientAuditReport(client: ClientProject): SiteAuditReport {
  if (CLIENT_AUDIT_REPORTS[client.id]) {
    return CLIENT_AUDIT_REPORTS[client.id];
  }
  // Generate a dynamic fallback matching the client domain and industry
  const domain = client.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  const cleanUrl = `https://${domain}`;
  return {
    id: `audit-${client.id}`,
    clientId: client.id,
    url: cleanUrl,
    scannedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    overallScore: client.healthScore || 82,
    performanceScore: Math.min(95, (client.healthScore || 82) + 4),
    seoScore: client.healthScore || 82,
    accessibilityScore: 90,
    bestPracticesScore: 88,
    title: `${client.name} | Official Website & Services`,
    metaDescription: `Discover premier ${client.industry || 'services and solutions'} with ${client.name}. Contact us today to explore our full offerings.`,
    canonicalUrl: `${cleanUrl}/`,
    h1Count: 1,
    h2Count: 6,
    imagesWithoutAlt: 2,
    totalImages: 16,
    loadTimeMs: 780,
    pageSizeKb: 1100,
    issues: [
      {
        id: `issue-${client.id}-1`,
        category: 'Meta Tags',
        title: 'Title Tag Configured',
        description: 'Page title tag is active and reflects brand identity.',
        severity: 'passed',
        affectedUrls: [cleanUrl],
        impactScore: 9,
        recommendation: 'Optimize targeted primary keywords in title tag.',
        fixed: true
      },
      {
        id: `issue-${client.id}-2`,
        category: 'Content & Headings',
        title: 'Images Missing ALT Attributes',
        description: '2 images on page lack ALT attributes for search engine accessibility.',
        severity: 'warning',
        affectedUrls: [`${cleanUrl}/banner.png`],
        impactScore: 7,
        recommendation: 'Add descriptive ALT tags for search bots and screen readers.',
        codeSnippet: `<img src="/banner.png" alt="${client.name} official banner" />`,
        fixed: false
      },
      {
        id: `issue-${client.id}-3`,
        category: 'Security & Tech',
        title: 'SSL / HTTPS Active',
        description: 'Connection is secure with valid SSL certificate.',
        severity: 'passed',
        affectedUrls: [cleanUrl],
        impactScore: 10,
        recommendation: 'Ensure HTTPS redirection is strictly enforced.',
        fixed: true
      }
    ]
  };
}

export const INITIAL_AUDIT_REPORT: SiteAuditReport = CLIENT_AUDIT_REPORTS['client-1'];

export const INITIAL_AUDIT_SCAN_LOGS: AuditScanLog[] = [
  {
    id: 'scan-log-1',
    clientId: 'client-1',
    domain: 'apexhealthsolutions.com',
    url: 'https://apexhealthsolutions.com',
    timestamp: '2026-09-14T09:30:00.000Z',
    formattedTime: 'Sep 14, 2026, 09:30 AM',
    overallScore: 88,
    seoScore: 89,
    performanceScore: 91,
    loadTimeMs: 840,
    pageSizeKb: 1240,
    googleRank: { page: 1, position: 2, keyword: 'same day telehealth appointment near me' },
    bingRank: { page: 1, position: 1, keyword: 'same day telehealth appointment near me' },
    issuesCount: { critical: 1, warning: 1, passed: 3 },
    status: 'warning',
    auditSnapshot: CLIENT_AUDIT_REPORTS['client-1']
  },
  {
    id: 'scan-log-2',
    clientId: 'client-2',
    domain: 'nexuscloudtech.io',
    url: 'https://nexuscloudtech.io',
    timestamp: '2026-09-14T11:15:00.000Z',
    formattedTime: 'Sep 14, 2026, 11:15 AM',
    overallScore: 74,
    seoScore: 75,
    performanceScore: 78,
    loadTimeMs: 1120,
    pageSizeKb: 1680,
    googleRank: { page: 1, position: 4, keyword: 'zero trust cloud security platform' },
    bingRank: { page: 1, position: 3, keyword: 'zero trust cloud security platform' },
    issuesCount: { critical: 1, warning: 1, passed: 2 },
    status: 'warning',
    auditSnapshot: CLIENT_AUDIT_REPORTS['client-2']
  },
  {
    id: 'scan-log-3',
    clientId: 'client-3',
    domain: 'urbancraftliving.shop',
    url: 'https://urbancraftliving.shop',
    timestamp: '2026-09-14T14:45:00.000Z',
    formattedTime: 'Sep 14, 2026, 02:45 PM',
    overallScore: 92,
    seoScore: 91,
    performanceScore: 94,
    loadTimeMs: 640,
    pageSizeKb: 920,
    googleRank: { page: 1, position: 1, keyword: 'modern minimalist home decor shop' },
    bingRank: { page: 1, position: 2, keyword: 'modern minimalist home decor shop' },
    issuesCount: { critical: 0, warning: 1, passed: 3 },
    status: 'passed',
    auditSnapshot: CLIENT_AUDIT_REPORTS['client-3']
  }
];

export const INITIAL_COMPETITOR_DATA: CompetitorData[] = [
  {
    id: 'comp-1',
    clientId: 'client-1',
    name: 'Teladoc Health Care',
    domain: 'teladochealth.com',
    domainAuthority: 82,
    organicKeywords: 145000,
    sharedKeywords: 84,
    gapKeywords: [
      {
        keyword: '24 7 online doctor prescription',
        searchVolume: 27100,
        difficulty: 72,
        clientPos: 14,
        competitorPos: 2
      },
      {
        keyword: 'urgent care telehealth near me',
        searchVolume: 40500,
        difficulty: 68,
        clientPos: 18,
        competitorPos: 1
      },
      {
        keyword: 'virtual doctor consultation cost',
        searchVolume: 12100,
        difficulty: 51,
        clientPos: null,
        competitorPos: 3
      },
      {
        keyword: 'telehealth pediatric care online',
        searchVolume: 8800,
        difficulty: 46,
        clientPos: 22,
        competitorPos: 4
      }
    ]
  },
  {
    id: 'comp-2',
    clientId: 'client-1',
    name: 'Amwell Virtual Care',
    domain: 'amwell.com',
    domainAuthority: 79,
    organicKeywords: 98000,
    sharedKeywords: 62,
    gapKeywords: [
      {
        keyword: 'online psychiatric therapy session',
        searchVolume: 18100,
        difficulty: 64,
        clientPos: null,
        competitorPos: 3
      },
      {
        keyword: 'video visit primary physician',
        searchVolume: 6700,
        difficulty: 49,
        clientPos: 15,
        competitorPos: 2
      }
    ]
  }
];

export const INITIAL_REPORT_CONFIG: ClientReportConfig = {
  clientId: 'client-1',
  reportTitle: 'Page 1 Google & Bing SEO Ranking & Growth Report',
  agencyName: 'Apex SEO Growth Agency',
  clientName: 'Apex Health Solutions',
  dateRange: 'August 2026 - September 2026',
  executiveSummary: 'During the past 30 days, Apex Health Solutions experienced a +24.5% boost in organic web traffic and secured 14 Top-3 positions on Google and Bing SERPs. Technical audit fixes improved mobile page speed score to 91/100, driving a 32% increase in high-intent telehealth patient inquiries.',
  includeHealthAudit: true,
  includeSerpRankings: true,
  includeKeywords: true,
  includeCompetitorGap: true,
  includeRoadmap: true,
  customRoadmapItems: [
    {
      task: 'Fix 2 Missing Image ALT Attributes for Telehealth Banners',
      status: 'completed',
      impact: 'High (+5% Image Search Traffic)'
    },
    {
      task: 'Optimize Mobile CSS Render-blocking Scripts for 60ms speed gain',
      status: 'in-progress',
      impact: 'Critical (Page 1 Mobile Ranking)'
    },
    {
      task: 'Launch 4 Targeted Landing Pages for Urgent Prescription Renewal keywords',
      status: 'planned',
      impact: 'High (+12,000 Mo Search Reach)'
    }
  ]
};

export const INITIAL_BACKLINKS: import('../types/seo').BacklinkItem[] = [
  {
    id: 'bl-1',
    clientId: 'client-1',
    referringDomain: 'healthtechweekly.org',
    referringPageTitle: 'Top 10 Virtual Telehealth Platforms of 2026',
    targetUrl: 'https://apexhealthsolutions.com/virtual-consultation',
    domainRating: 84,
    anchorText: 'virtual doctor consultation online',
    linkType: 'dofollow',
    category: 'Niche Blog',
    status: 'indexed',
    toxicityScore: 2,
    createdAt: '2026-08-15'
  },
  {
    id: 'bl-2',
    clientId: 'client-1',
    referringDomain: 'medium.com',
    referringPageTitle: 'How Telemedicine is Transforming Patient Access',
    targetUrl: 'https://apexhealthsolutions.com/',
    domainRating: 95,
    anchorText: 'Apex Health Solutions',
    linkType: 'dofollow',
    category: 'Web 2.0',
    status: 'indexed',
    toxicityScore: 0,
    createdAt: '2026-08-20'
  },
  {
    id: 'bl-3',
    clientId: 'client-1',
    referringDomain: 'clutch.co',
    referringPageTitle: 'Verified Healthcare Providers & Telehealth Networks',
    targetUrl: 'https://apexhealthsolutions.com/',
    domainRating: 89,
    anchorText: 'same day telehealth appointment',
    linkType: 'dofollow',
    category: 'Tech Directory',
    status: 'indexed',
    toxicityScore: 1,
    createdAt: '2026-08-28'
  },
  {
    id: 'bl-4',
    clientId: 'client-1',
    referringDomain: 'digitaljournal.com',
    referringPageTitle: 'Apex Health Solutions Expands 24/7 Prescription Renewal System',
    targetUrl: 'https://apexhealthsolutions.com/online-prescriptions',
    domainRating: 86,
    anchorText: 'online prescription renewal clinic',
    linkType: 'dofollow',
    category: 'Press Release',
    status: 'pinged',
    toxicityScore: 3,
    createdAt: '2026-09-01'
  },
  {
    id: 'bl-5',
    clientId: 'client-1',
    referringDomain: 'nih.gov.citation-index.net',
    referringPageTitle: 'Digital Health Outcomes Research Catalog',
    targetUrl: 'https://apexhealthsolutions.com/primary-care',
    domainRating: 92,
    anchorText: 'Apex Health Telemedicine Study',
    linkType: 'dofollow',
    category: 'Edu/Gov Citation',
    status: 'indexed',
    toxicityScore: 0,
    createdAt: '2026-09-02'
  },
  {
    id: 'bl-6',
    clientId: 'client-1',
    referringDomain: 'spam-directory-list.xyz',
    referringPageTitle: 'Free Web Catalog Links',
    targetUrl: 'https://apexhealthsolutions.com/',
    domainRating: 12,
    anchorText: 'click here cheap care',
    linkType: 'dofollow',
    category: 'Web 2.0',
    status: 'submitted',
    toxicityScore: 78,
    createdAt: '2026-08-10'
  },

  // Client 2 - Nexus Cloud Tech
  {
    id: 'bl-7',
    clientId: 'client-2',
    referringDomain: 'techcrunch.com',
    referringPageTitle: 'The Future of Zero Trust Cloud Security',
    targetUrl: 'https://nexuscloudtech.io/zero-trust-platform',
    domainRating: 94,
    anchorText: 'zero trust cloud security platform',
    linkType: 'dofollow',
    category: 'Niche Blog',
    status: 'indexed',
    toxicityScore: 1,
    createdAt: '2026-08-18'
  },
  {
    id: 'bl-8',
    clientId: 'client-2',
    referringDomain: 'producthunt.com',
    referringPageTitle: 'Nexus Cloud Compliance Engine',
    targetUrl: 'https://nexuscloudtech.io/compliance-monitoring',
    domainRating: 91,
    anchorText: 'Nexus Cloud Tech',
    linkType: 'dofollow',
    category: 'Tech Directory',
    status: 'indexed',
    toxicityScore: 0,
    createdAt: '2026-08-22'
  },

  // Client 3 - UrbanCraft Living
  {
    id: 'bl-9',
    clientId: 'client-3',
    referringDomain: 'architecturaldigest.com',
    referringPageTitle: '15 Minimalist Living Room Designs for 2026',
    targetUrl: 'https://urbancraftliving.shop/minimalist-decor',
    domainRating: 91,
    anchorText: 'modern minimalist home decor shop',
    linkType: 'dofollow',
    category: 'Niche Blog',
    status: 'indexed',
    toxicityScore: 1,
    createdAt: '2026-08-14'
  }
];

export const INITIAL_OUTREACH: import('../types/seo').OutreachOpportunity[] = [
  {
    id: 'op-1',
    clientId: 'client-1',
    websiteName: 'Telemedicine Insider Digest',
    domain: 'telemedinsider.com',
    domainAuthority: 78,
    niche: 'Healthcare & Digital Medicine',
    contactEmail: 'editor@telemedinsider.com',
    suggestedTopic: '10 Patient Benefits of 24/7 Virtual Primary Care',
    estimatedTraffic: 45000,
    status: 'new'
  },
  {
    id: 'op-2',
    clientId: 'client-1',
    websiteName: 'MedTech Innovation Pulse',
    domain: 'medtechpulse.io',
    domainAuthority: 82,
    niche: 'Health Technology',
    contactEmail: 'outreach@medtechpulse.io',
    suggestedTopic: 'How AI and Remote Prescriptions Reduce Wait Times',
    estimatedTraffic: 72000,
    status: 'pitched'
  },
  {
    id: 'op-3',
    clientId: 'client-1',
    websiteName: 'Wellness & Prevention Journal',
    domain: 'wellnessjournal.org',
    domainAuthority: 88,
    niche: 'Medical & Wellness Research',
    contactEmail: 'contribute@wellnessjournal.org',
    suggestedTopic: 'Standardizing Telehealth Compliance in 2026',
    estimatedTraffic: 110000,
    status: 'accepted'
  }
];

export const INITIAL_USERS: import('../types/seo').UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Alex Vance (Agency Owner)',
    email: 'alex@rankpulse.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2026-09-05 14:10'
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor (Apex Health Manager)',
    email: 'sarah@apexhealth.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'client_manager',
    clientId: 'client-1',
    status: 'active',
    lastLogin: '2026-09-04 18:22'
  },
  {
    id: 'usr-3',
    name: 'Marcus Brody (SEO Specialist)',
    email: 'marcus@rankpulse.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'seo_analyst',
    status: 'active',
    lastLogin: '2026-09-05 09:15'
  }
];


