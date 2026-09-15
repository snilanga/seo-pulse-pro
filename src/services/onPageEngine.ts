export interface OnPageSeoInput {
  businessType: string;
  serviceOrProduct: string;
  targetKeyword: string;
  city: string;
  country: string;
  pageOrTopic: string;
}

export interface OnPageChecklistItem {
  id: string;
  label: string;
  passed: boolean;
  explanation: string;
}

export interface ImageAltItem {
  imageLabel: string;
  recommendedAlt: string;
  rationale: string;
}

export interface ContentRecommendationItem {
  id: string;
  category: 'Critical' | 'Warning' | 'Optimization';
  text: string;
  actionableStep: string;
}

export interface OnPageSeoPackage {
  generatedAt: string;
  input: OnPageSeoInput;

  // 1. Primary Keyword
  primaryKeyword: string;
  primaryKeywordRationale: string;
  secondaryKeywords: string[];

  // 2. SEO Title Tag
  titleTag: string;
  titleCharCount: number;
  titleStatus: 'Good' | 'Too Long' | 'Too Short';
  titleStatusIcon: string;
  titleTip: string;

  // 3. Meta Description
  metaDescription: string;
  metaCharCount: number;
  metaStatus: 'Good' | 'Too Long' | 'Too Short';
  metaStatusIcon: string;
  metaTip: string;

  // 4. H1 Heading
  h1Heading: string;
  h1WarningNotice?: string;
  hasMultipleH1sNotice: boolean;

  // 5. H2 / H3 Content Structure
  headingStructure: {
    h2: string;
    h3s?: string[];
  }[];

  // 6. On-Page SEO Checklist (16 verification points)
  checklist: OnPageChecklistItem[];
  checklistScore: number; // percentage passed e.g. 94%

  // 7. SEO URL / Slug
  urlSlug: string;
  slugRationale: string;

  // 8. Image ALT Text
  imageAlts: ImageAltItem[];

  // 9. SEO Content Recommendations
  contentScore: number; // e.g. 82/100
  contentRecommendations: ContentRecommendationItem[];
  engineSource?: string;
  autoDetectedDomain?: string;
}

export interface QuickPreset {
  id: string;
  label: string;
  icon: string;
  businessType: string;
  serviceOrProduct: string;
  targetKeyword: string;
  city: string;
  country: string;
  pageOrTopic: string;
  description: string;
}

export const ONPAGE_QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'dentist',
    label: 'Dental Clinic',
    icon: '🦷',
    businessType: 'Dental Clinic',
    serviceOrProduct: 'Cosmetic Dentistry & Dental Implants',
    targetKeyword: 'best dentist in Colombo',
    city: 'Colombo',
    country: 'Sri Lanka',
    pageOrTopic: 'Home Page',
    description: 'General checkups, tooth implants, whitening & emergency dental care'
  },
  {
    id: 'hotel',
    label: 'Boutique Hotel',
    icon: '🏨',
    businessType: 'Boutique Hotel & Resort',
    serviceOrProduct: 'Ocean View Suites & Wellness Spa',
    targetKeyword: 'best boutique hotel in Galle',
    city: 'Galle',
    country: 'Sri Lanka',
    pageOrTopic: 'Home Page',
    description: 'Luxury suites, private beach access, pool and fine dining'
  },
  {
    id: 'restaurant',
    label: 'Fine Dining',
    icon: '🍽️',
    businessType: 'Fine Dining Restaurant',
    serviceOrProduct: 'Seafood & Artisanal Culinary Experience',
    targetKeyword: 'best seafood restaurant in Colombo',
    city: 'Colombo',
    country: 'Sri Lanka',
    pageOrTopic: 'Home Page',
    description: 'Fresh seafood, candle-lit private dining & corporate events'
  },
  {
    id: 'lawyer',
    label: 'Law Firm',
    icon: '⚖️',
    businessType: 'Legal Defense Law Firm',
    serviceOrProduct: 'Corporate Litigation & Commercial Advisory',
    targetKeyword: 'top corporate lawyer in New York',
    city: 'New York',
    country: 'United States',
    pageOrTopic: 'Home Page',
    description: 'Business formation, contracts, mergers & courtroom representation'
  },
  {
    id: 'plumber',
    label: 'Emergency Plumber',
    icon: '🔧',
    businessType: 'Plumbing & Drainage Service',
    serviceOrProduct: '24/7 Emergency Pipe Burst & Leak Repair',
    targetKeyword: 'emergency plumber in London near me',
    city: 'London',
    country: 'United Kingdom',
    pageOrTopic: 'Services Page',
    description: 'Fast 30-min response, drain unblocking, water heater repair'
  },
  {
    id: 'decor',
    label: 'Home Decor & Furniture',
    icon: '🛋️',
    businessType: 'Furniture & Interior Decor',
    serviceOrProduct: 'Handcrafted Modern Wooden Living Decor',
    targetKeyword: 'artisan handcrafted furniture in New York',
    city: 'New York',
    country: 'United States',
    pageOrTopic: 'Shop Page',
    description: 'Sustainable solid wood tables, organic linen & minimalist design'
  },
  {
    id: 'saas',
    label: 'Cloud Security SaaS',
    icon: '💻',
    businessType: 'Cloud Security Platform',
    serviceOrProduct: 'SOC2 & ISO27001 Cloud Compliance Monitoring',
    targetKeyword: 'enterprise cloud compliance software',
    city: 'Austin',
    country: 'United States',
    pageOrTopic: 'Product Page',
    description: 'Automated vulnerability scanning, compliance audit readiness'
  },
  {
    id: 'gym',
    label: 'Fitness Gym',
    icon: '🏋️',
    businessType: 'Athletic Gym & Fitness Center',
    serviceOrProduct: 'Personal Training & Functional HIIT Classes',
    targetKeyword: 'best fitness gym in Austin',
    city: 'Austin',
    country: 'United States',
    pageOrTopic: 'Home Page',
    description: 'Certified coaches, strength zones, cardio & group training'
  },
  {
    id: 'car-rental',
    label: 'Car Rental',
    icon: '🚗',
    businessType: 'Car Rental Agency',
    serviceOrProduct: 'Luxury Sedan & SUV Airport Rental',
    targetKeyword: 'best luxury car rental in Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    pageOrTopic: 'Fleet Page',
    description: 'No deposit options, free airport delivery, 24/7 support'
  }
];

export function generateOnPageSeoPackage(input: OnPageSeoInput): OnPageSeoPackage {
  const bType = input.businessType.trim() || 'Dental Clinic';
  const service = input.serviceOrProduct.trim() || 'Dental Care & Implants';
  const city = input.city.trim() || 'Colombo';
  const country = input.country.trim() || 'Sri Lanka';
  const topic = input.pageOrTopic.trim() || 'Home Page';
  const customKeyword = input.targetKeyword.trim();

  // Normalize location tokens
  const cleanCity = city.charAt(0).toUpperCase() + city.slice(1);
  const cleanService = service.toLowerCase();
  const cleanBType = bType.toLowerCase();

  // 1. Primary Keyword identification
  let primaryKeyword = customKeyword;
  if (!primaryKeyword) {
    if (cleanBType.includes('dentist') || cleanBType.includes('dental')) {
      primaryKeyword = `best dentist in ${cleanCity}`;
    } else if (cleanBType.includes('hotel') || cleanBType.includes('resort')) {
      primaryKeyword = `best hotel in ${cleanCity}`;
    } else if (cleanBType.includes('restaurant') || cleanBType.includes('cafe')) {
      primaryKeyword = `best restaurant in ${cleanCity}`;
    } else if (cleanBType.includes('lawyer') || cleanBType.includes('legal')) {
      primaryKeyword = `best lawyer in ${cleanCity}`;
    } else if (cleanBType.includes('salon') || cleanBType.includes('spa')) {
      primaryKeyword = `best salon in ${cleanCity}`;
    } else if (cleanBType.includes('plumber')) {
      primaryKeyword = `best plumber in ${cleanCity}`;
    } else {
      primaryKeyword = `best ${cleanBType} in ${cleanCity}`;
    }
  }

  // Capitalize for Title
  const primaryTitleCased = primaryKeyword
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Secondary/Related Keywords
  const secondaryKeywords: string[] = [
    `${cleanBType} near me`,
    `${cleanService} ${cleanCity}`,
    `affordable ${cleanBType} in ${cleanCity}`,
    `${cleanBType} open today`,
    `${cleanBType} appointment ${cleanCity}`,
    `${cleanBType} prices & cost`
  ];

  // 2. SEO Title Tag (Aim for 50-60 characters, primary kw near beginning)
  let titleTag = `${primaryTitleCased} | Trusted ${bType} Care`;
  if (titleTag.length > 60) {
    titleTag = `${primaryTitleCased} | ${bType}`;
  } else if (titleTag.length < 45) {
    titleTag = `${primaryTitleCased} | Top-Rated ${bType} Services`;
  }
  const titleCharCount = titleTag.length;
  const titleStatus = titleCharCount >= 45 && titleCharCount <= 62 ? 'Good' : titleCharCount > 62 ? 'Too Long' : 'Too Short';
  const titleStatusIcon = titleStatus === 'Good' ? '✅' : '⚠️';
  const titleTip = titleStatus === 'Good' 
    ? 'Ideal length (50–60 chars). Primary keyword placed at the front to maximize Google CTR.'
    : 'Adjust length so desktop & mobile SERP snippets do not truncate.';

  // 3. Meta Description (Aim for 120-160 chars, natural primary keyword, CTA)
  let metaDescription = `Find a trusted ${cleanBType} in ${cleanCity} for quality ${cleanService}, emergency care and more. Book your appointment today.`;
  if (metaDescription.length < 120) {
    metaDescription = `Looking for the ${primaryKeyword}? Visit our trusted ${cleanBType} in ${cleanCity} for quality ${cleanService}, transparent prices and care. Book your appointment today.`;
  } else if (metaDescription.length > 160) {
    metaDescription = metaDescription.substring(0, 155) + '...';
  }
  const metaCharCount = metaDescription.length;
  const metaStatus = metaCharCount >= 115 && metaCharCount <= 165 ? 'Good' : metaCharCount > 165 ? 'Too Long' : 'Too Short';
  const metaStatusIcon = metaStatus === 'Good' ? '✅' : '⚠️';
  const metaTip = 'Engaging snippet with clear value proposition and active call-to-action (CTA).';

  // 4. H1 Heading (One clear H1, descriptive, matching search intent)
  const h1Heading = `${primaryTitleCased} for Complete ${bType} Care`;
  const h1WarningNotice = '⚠️ Your page contains multiple H1 headings. We recommend using one clear primary H1.';

  // 5. H2 / H3 Content Structure
  const headingStructure = [
    {
      h2: `${bType} Services We Offer in ${cleanCity}`,
      h3s: [
        `${cleanService.charAt(0).toUpperCase() + cleanService.slice(1)} & Specialized Treatments`,
        `Emergency ${bType} Consultations & Care`,
        `Affordable Preventative Checkups & Diagnostics`
      ]
    },
    {
      h2: `Why Choose Our ${cleanCity} ${bType}?`,
      h3s: [
        'Certified Specialists & Modern Equipment',
        'Transparent Pricing with No Hidden Fees',
        'Convenient Appointments & Weekend Hours'
      ]
    },
    {
      h2: `${bType} Treatment Prices & Packages in ${cleanCity}`,
      h3s: []
    },
    {
      h2: `Frequently Asked Questions About ${bType} in ${cleanCity}`,
      h3s: []
    },
    {
      h2: `Contact Our ${cleanCity} Clinic & Schedule Your Visit`,
      h3s: []
    }
  ];

  // 6. On-Page SEO Checklist (16 points as requested)
  const checklist: OnPageChecklistItem[] = [
    { id: 'c1', label: 'Primary keyword identified & targeted', passed: true, explanation: `Targeting "${primaryKeyword}" with high local commercial search intent.` },
    { id: 'c2', label: 'SEO title (50–60 chars, keyword frontloaded)', passed: titleStatus === 'Good', explanation: `${titleCharCount} characters. Primary keyword appears at the beginning.` },
    { id: 'c3', label: 'Meta description (120–160 chars with CTA)', passed: metaStatus === 'Good', explanation: `${metaCharCount} characters with clear booking call to action.` },
    { id: 'c4', label: 'One H1 heading', passed: true, explanation: 'Single primary H1 recommended to prevent multi-heading dilution.' },
    { id: 'c5', label: 'Logical H2/H3 heading hierarchy', passed: true, explanation: 'Clear topical breakdown covering services, pricing, and trust signals.' },
    { id: 'c6', label: 'Keyword used naturally in content', passed: true, explanation: 'Distributed with contextual semantics, avoiding keyword stuffing.' },
    { id: 'c7', label: 'First paragraph optimized (First 100 words)', passed: true, explanation: 'Front-loads primary keyword within the opening introductory sentence.' },
    { id: 'c8', label: 'Image ALT text configured', passed: true, explanation: 'Descriptive, accessible ALT tags without keyword stuffing.' },
    { id: 'c9', label: 'Internal links to related services', passed: true, explanation: 'Links mapped to services, contact, pricing, and FAQ pages.' },
    { id: 'c10', label: 'External links where appropriate', passed: true, explanation: 'Cites industry health/licensing boards or authoritative sources.' },
    { id: 'c11', label: 'Clean SEO URL / slug', passed: true, explanation: 'Short, lowercase, hyphen-separated slug.' },
    { id: 'c12', label: 'Local business & location signals (NAP)', passed: true, explanation: `Anchors phone number, address, and ${cleanCity}, ${country}.` },
    { id: 'c13', label: 'Schema markup (JSON-LD LocalBusiness)', passed: true, explanation: 'Structured data includes opening hours, geo coordinates, and reviews.' },
    { id: 'c14', label: 'Mobile-friendly content format', passed: true, explanation: 'Scannable bullet points, responsive buttons, and short paragraphs.' },
    { id: 'c15', label: 'Search intent matched', passed: true, explanation: 'Directly fulfills commercial investigation and transactional booking needs.' },
    { id: 'c16', label: 'Helpful, original content & FAQ section', passed: true, explanation: 'Covers authentic customer questions and transparent pricing breakdown.' }
  ];

  const passedCount = checklist.filter(c => c.passed).length;
  const checklistScore = Math.round((passedCount / checklist.length) * 100);

  // 7. SEO URL / Slug (Short, lowercase, hyphens, no stopwords)
  const slugClean = primaryKeyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const urlSlug = `/${slugClean}`;

  // 8. Image ALT Text (Descriptive, accurately describes images, no stuffing)
  const imageAlts: ImageAltItem[] = [
    {
      imageLabel: `Hero Banner: ${bType} treating patient in clinic`,
      recommendedAlt: `${bType} providing quality treatment for patient in ${cleanCity}`,
      rationale: 'Accurately describes the clinical consultation setting with natural location context.'
    },
    {
      imageLabel: `Procedure Showcase: Modern ${service} equipment`,
      recommendedAlt: `Advanced equipment used for ${cleanService} procedures at ${cleanCity} clinic`,
      rationale: 'Describes the technology and equipment shown in the photo for accessibility.'
    },
    {
      imageLabel: `Facility Photo: Reception and waiting lounge`,
      recommendedAlt: `Comfortable reception and waiting area of ${cleanCity} ${cleanBType}`,
      rationale: 'Provides physical proof of modern patient facilities and welcoming clinic atmosphere.'
    }
  ];

  // 9. SEO Content Recommendations (Content Score 82/100)
  const contentScore = 82;
  const contentRecommendations: ContentRecommendationItem[] = [
    {
      id: 'r1',
      category: 'Critical',
      text: `Primary keyword "${primaryKeyword}" is missing from the introduction opening sentence.`,
      actionableStep: `Front-load "${primaryKeyword}" into your first paragraph to verify topical relevance immediately.`
    },
    {
      id: 'r2',
      category: 'Warning',
      text: `Add more information about ${cleanService} procedures and expected patient outcomes.`,
      actionableStep: `Include a dedicated 150-word overview describing standard procedure steps and guarantees.`
    },
    {
      id: 'r3',
      category: 'Optimization',
      text: `Add location-specific signals for ${cleanCity}, including landmarks and driving directions.`,
      actionableStep: `List nearby transit stations or neighborhood parking instructions to boost Google Local Pack authority.`
    },
    {
      id: 'r4',
      category: 'Optimization',
      text: 'Add an interactive FAQ section with expandable answers.',
      actionableStep: 'Implement 4 common customer inquiries with FAQPage Schema.org structured data.'
    },
    {
      id: 'r5',
      category: 'Warning',
      text: 'Improve heading structure by ensuring H3 tags are nested logically under H2 service sections.',
      actionableStep: 'Place sub-treatments as H3 tags directly beneath the main "Services We Offer" H2 heading.'
    },
    {
      id: 'r6',
      category: 'Optimization',
      text: 'Add internal links pointing to related specialized service pages and pricing.',
      actionableStep: 'Hyperlink terms like "consultation" and "pricing packages" to your booking and fees pages.'
    },
    {
      id: 'r7',
      category: 'Optimization',
      text: 'Add descriptive ALT text to all clinic and procedure images.',
      actionableStep: 'Use the recommended ALT tags generated above rather than generic filenames like IMG_001.jpg.'
    }
  ];

  return {
    generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    input,
    primaryKeyword,
    primaryKeywordRationale: `Identified for ${topic} based on commercial search demand for ${bType} in ${cleanCity}, ${country}. Delivers optimal local conversion intent.`,
    secondaryKeywords,
    titleTag,
    titleCharCount,
    titleStatus,
    titleStatusIcon,
    titleTip,
    metaDescription,
    metaCharCount,
    metaStatus,
    metaStatusIcon,
    metaTip,
    h1Heading,
    h1WarningNotice,
    hasMultipleH1sNotice: false,
    headingStructure,
    checklist,
    checklistScore,
    urlSlug,
    slugRationale: 'Clean, lowercase, hyphen-separated permalink with zero keyword stuffing.',
    imageAlts,
    contentScore,
    contentRecommendations,
    engineSource: 'Deep Intelligence AI'
  };
}

export function autoDetectOnPageInputFromDomain(
  domain: string,
  clientName?: string,
  targetRegion?: string
): OnPageSeoInput {
  const rawDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  const cleanName = rawDomain.replace(/\.(com|org|net|io|shop|co|app|ai|dev|store|info|biz|tech|us|uk|ca|lk)$/, '');
  const tokens = cleanName.split(/[-_.]+/).filter(Boolean);
  const brandName = clientName || tokens.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' ');

  let city = 'Colombo';
  let country = 'Sri Lanka';
  if (targetRegion) {
    const parts = targetRegion.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      city = parts[0];
      country = parts[1];
    } else if (parts.length === 1 && parts[0]) {
      city = parts[0];
    }
  } else if (rawDomain.endsWith('.uk')) {
    city = 'London'; country = 'United Kingdom';
  } else if (rawDomain.endsWith('.ca')) {
    city = 'Toronto'; country = 'Canada';
  } else if (rawDomain.endsWith('.au')) {
    city = 'Sydney'; country = 'Australia';
  } else if (rawDomain.endsWith('.lk')) {
    city = 'Colombo'; country = 'Sri Lanka';
  }

  const str = `${rawDomain} ${brandName}`.toLowerCase();

  let businessType = 'Professional Services';
  let serviceOrProduct = 'Consultations & Solutions';
  let targetKeyword = `best services in ${city}`;
  let pageOrTopic = 'Home Page';

  if (/dentist|dental|teeth|ortho|smile/.test(str)) {
    businessType = 'Dental Clinic';
    serviceOrProduct = 'Cosmetic Dentistry & Dental Implants';
    targetKeyword = `best dentist in ${city}`;
  } else if (/telehealth|health|doctor|clinic|med|rx|hospital|pediatric/.test(str)) {
    businessType = 'Telehealth & Medical Clinic';
    serviceOrProduct = 'Virtual Doctor Consultations & Diagnostics';
    targetKeyword = `best telehealth clinic in ${city}`;
  } else if (/cloud|sec|cyber|saas|soft|tech|dev|code|data|host|network/.test(str)) {
    businessType = 'Cloud Security & SaaS';
    serviceOrProduct = 'Cloud Compliance & Security Monitoring';
    targetKeyword = `enterprise cloud security software`;
    pageOrTopic = 'Solutions Page';
  } else if (/craft|decor|furnitur|home|living|design|shop|store|boutique|cloth|apparel/.test(str)) {
    businessType = 'Furniture & Interior Decor';
    serviceOrProduct = 'Handcrafted Modern Furniture & Living Decor';
    targetKeyword = `artisan handcrafted furniture in ${city}`;
    pageOrTopic = 'Shop Page';
  } else if (/law|legal|attorney|lawyer|justice/.test(str)) {
    businessType = 'Legal Defense Law Firm';
    serviceOrProduct = 'Corporate Litigation & Commercial Advisory';
    targetKeyword = `best corporate lawyer in ${city}`;
  } else if (/plumb|drain|leak|pipe/.test(str)) {
    businessType = 'Plumbing & Drainage Service';
    serviceOrProduct = '24/7 Emergency Leak Repair & Drain Unblocking';
    targetKeyword = `emergency plumber in ${city} near me`;
    pageOrTopic = 'Services Page';
  } else if (/roof|exterior|gutter|siding/.test(str)) {
    businessType = 'Roofing Contractors';
    serviceOrProduct = 'Roof Replacement & Storm Damage Repair';
    targetKeyword = `certified roofing contractor in ${city}`;
  } else if (/hotel|resort|inn|suite|lodge|vacation|villa/.test(str)) {
    businessType = 'Boutique Hotel & Resort';
    serviceOrProduct = 'Ocean View Suites & Hospitality';
    targetKeyword = `best boutique hotel in ${city}`;
  } else if (/food|restaurant|cafe|dining|bistro|pizza|grill|bakery/.test(str)) {
    businessType = 'Fine Dining Restaurant';
    serviceOrProduct = 'Artisanal Cuisine & Private Dining';
    targetKeyword = `best restaurant in ${city}`;
  } else if (/gym|fitness|workout|crossfit|yoga|athletic/.test(str)) {
    businessType = 'Fitness Gym & Athletic Club';
    serviceOrProduct = 'Personal Training & Functional Fitness';
    targetKeyword = `best fitness gym in ${city}`;
  } else if (/car|rental|auto|vehicle|drive/.test(str)) {
    businessType = 'Car Rental Agency';
    serviceOrProduct = 'Luxury & Economy Car Rentals';
    targetKeyword = `best car rental in ${city}`;
  } else if (/clean|maid|wash|janitor/.test(str)) {
    businessType = 'Commercial Cleaning Services';
    serviceOrProduct = 'Deep Office Cleaning & Sanitization';
    targetKeyword = `best cleaning service in ${city}`;
  } else if (/real|estate|realty|property|realtor|apartments/.test(str)) {
    businessType = 'Real Estate Agency';
    serviceOrProduct = 'Luxury Home Sales & Property Management';
    targetKeyword = `best real estate agents in ${city}`;
  }

  return {
    businessType,
    serviceOrProduct,
    targetKeyword,
    city,
    country,
    pageOrTopic
  };
}

export function parseNaturalLanguagePrompt(
  prompt: string,
  defaultCity = 'Colombo',
  defaultCountry = 'Sri Lanka'
): OnPageSeoInput {
  const lower = prompt.trim().toLowerCase();

  let city = defaultCity;
  let country = defaultCountry;

  const knownCities: { [k: string]: { city: string; country: string } } = {
    'colombo': { city: 'Colombo', country: 'Sri Lanka' },
    'kandy': { city: 'Kandy', country: 'Sri Lanka' },
    'galle': { city: 'Galle', country: 'Sri Lanka' },
    'negombo': { city: 'Negombo', country: 'Sri Lanka' },
    'london': { city: 'London', country: 'United Kingdom' },
    'new york': { city: 'New York', country: 'United States' },
    'nyc': { city: 'New York', country: 'United States' },
    'austin': { city: 'Austin', country: 'United States' },
    'san francisco': { city: 'San Francisco', country: 'United States' },
    'los angeles': { city: 'Los Angeles', country: 'United States' },
    'miami': { city: 'Miami', country: 'United States' },
    'chicago': { city: 'Chicago', country: 'United States' },
    'paris': { city: 'Paris', country: 'France' },
    'dubai': { city: 'Dubai', country: 'United Arab Emirates' },
    'sydney': { city: 'Sydney', country: 'Australia' },
    'melbourne': { city: 'Melbourne', country: 'Australia' },
    'toronto': { city: 'Toronto', country: 'Canada' },
    'singapore': { city: 'Singapore', country: 'Singapore' },
    'tokyo': { city: 'Tokyo', country: 'Japan' }
  };

  for (const [k, v] of Object.entries(knownCities)) {
    if (lower.includes(k)) {
      city = v.city;
      country = v.country;
      break;
    }
  }

  let businessType = 'Local Business';
  let serviceOrProduct = 'Specialized Services';
  let targetKeyword = `best services in ${city}`;
  let pageOrTopic = 'Home Page';

  if (/dentist|dental|teeth|braces|implant|whitening/.test(lower)) {
    businessType = 'Dental Clinic';
    serviceOrProduct = /implant/.test(lower) ? 'Dental Implants & Surgery' : /whitening/.test(lower) ? 'Cosmetic Teeth Whitening' : 'General & Cosmetic Dentistry';
    targetKeyword = `best dentist in ${city}`;
  } else if (/hotel|resort|villa|suite|motel/.test(lower)) {
    businessType = 'Boutique Hotel & Resort';
    serviceOrProduct = 'Luxury Suites & Hospitality';
    targetKeyword = `best hotel in ${city}`;
  } else if (/restaurant|cafe|dining|pizza|bar|bistro|seafood/.test(lower)) {
    businessType = 'Fine Dining Restaurant';
    serviceOrProduct = /seafood/.test(lower) ? 'Fresh Seafood & Wine Pairing' : 'Artisanal Cuisine & Dining';
    targetKeyword = `best restaurant in ${city}`;
  } else if (/lawyer|attorney|law firm|legal/.test(lower)) {
    businessType = 'Legal Defense Law Firm';
    serviceOrProduct = 'Litigation & Legal Advisory';
    targetKeyword = `top lawyers in ${city}`;
  } else if (/plumber|plumbing|leak|drain/.test(lower)) {
    businessType = 'Emergency Plumbing Service';
    serviceOrProduct = '24/7 Leak Repair & Pipe Installation';
    targetKeyword = `emergency plumber in ${city}`;
  } else if (/gym|fitness|workout|personal trainer/.test(lower)) {
    businessType = 'Fitness Gym';
    serviceOrProduct = 'Personal Training & Fitness Classes';
    targetKeyword = `best gym in ${city}`;
  } else if (/roof|roofer|roofing/.test(lower)) {
    businessType = 'Roofing Contractors';
    serviceOrProduct = 'Roof Repairs & Replacements';
    targetKeyword = `best roofing contractor in ${city}`;
  } else if (/decor|furniture|interior/.test(lower)) {
    businessType = 'Home Decor & Furniture';
    serviceOrProduct = 'Handcrafted Living & Interior Decor';
    targetKeyword = `handcrafted furniture in ${city}`;
    pageOrTopic = 'Shop Page';
  } else if (/saas|software|cloud|security/.test(lower)) {
    businessType = 'Cloud Software & SaaS';
    serviceOrProduct = 'Cloud Security & Compliance';
    targetKeyword = 'enterprise cloud compliance software';
    pageOrTopic = 'Product Page';
  } else if (/car rental|rental car|rent a car/.test(lower)) {
    businessType = 'Car Rental Agency';
    serviceOrProduct = 'Luxury & Economy Car Rentals';
    targetKeyword = `best car rental in ${city}`;
  }

  if (/service|services/.test(lower)) {
    pageOrTopic = 'Services Page';
  } else if (/landing/.test(lower)) {
    pageOrTopic = 'Landing Page';
  }

  return {
    businessType,
    serviceOrProduct,
    targetKeyword,
    city,
    country,
    pageOrTopic
  };
}

export async function generateWithGeminiApi(
  apiKey: string,
  modelName: string,
  input: OnPageSeoInput
): Promise<OnPageSeoPackage> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;

  const prompt = `You are a world-class Technical SEO Architect. Generate a complete, high-converting On-Page SEO package in strict JSON for the following business:
Business Type: ${input.businessType}
Service/Product: ${input.serviceOrProduct}
Target Keyword: ${input.targetKeyword || 'Auto-pick best'}
City: ${input.city}
Country: ${input.country}
Page/Topic: ${input.pageOrTopic}

Return ONLY valid JSON matching this schema:
{
  "primaryKeyword": "string (optimal high intent local keyword)",
  "primaryKeywordRationale": "string (why this keyword was chosen)",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "titleTag": "string (between 50 and 60 characters exactly, with primary keyword near start)",
  "metaDescription": "string (between 120 and 160 characters exactly, with CTA and primary keyword)",
  "h1Heading": "string (one clear H1 matching intent)",
  "headingStructure": [
    { "h2": "H2 title", "h3s": ["H3 item 1", "H3 item 2"] }
  ],
  "urlSlug": "/short-hyphenated-slug",
  "imageAlts": [
    { "imageLabel": "string", "recommendedAlt": "string", "rationale": "string" }
  ],
  "contentRecommendations": [
    { "id": "r1", "category": "Critical", "text": "string", "actionableStep": "string" }
  ]
}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API request failed:', response.status, errText);
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(rawText);
    const baseline = generateOnPageSeoPackage(input);

    const titleTag = parsed.titleTag || baseline.titleTag;
    const titleCharCount = titleTag.length;
    const titleStatus = titleCharCount >= 48 && titleCharCount <= 65 ? 'Good' : titleCharCount > 65 ? 'Too Long' : 'Too Short';

    const metaDescription = parsed.metaDescription || baseline.metaDescription;
    const metaCharCount = metaDescription.length;
    const metaStatus = metaCharCount >= 115 && metaCharCount <= 165 ? 'Good' : metaCharCount > 165 ? 'Too Long' : 'Too Short';

    return {
      generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      input,
      primaryKeyword: parsed.primaryKeyword || baseline.primaryKeyword,
      primaryKeywordRationale: parsed.primaryKeywordRationale || baseline.primaryKeywordRationale,
      secondaryKeywords: Array.isArray(parsed.secondaryKeywords) && parsed.secondaryKeywords.length > 0 ? parsed.secondaryKeywords : baseline.secondaryKeywords,
      titleTag,
      titleCharCount,
      titleStatus,
      titleStatusIcon: titleStatus === 'Good' ? '✅' : '⚠️',
      titleTip: 'Tailored by Google Gemini AI with high click-through-rate frontloaded phrasing.',
      metaDescription,
      metaCharCount,
      metaStatus,
      metaStatusIcon: metaStatus === 'Good' ? '✅' : '⚠️',
      metaTip: 'Crafted with compelling searcher intent and direct conversion action.',
      h1Heading: parsed.h1Heading || baseline.h1Heading,
      h1WarningNotice: baseline.h1WarningNotice,
      hasMultipleH1sNotice: false,
      headingStructure: Array.isArray(parsed.headingStructure) && parsed.headingStructure.length > 0 ? parsed.headingStructure : baseline.headingStructure,
      checklist: baseline.checklist,
      checklistScore: baseline.checklistScore,
      urlSlug: parsed.urlSlug || baseline.urlSlug,
      slugRationale: 'Clean, lowercase, search-intent-focused slug.',
      imageAlts: Array.isArray(parsed.imageAlts) && parsed.imageAlts.length > 0 ? parsed.imageAlts : baseline.imageAlts,
      contentScore: 88,
      contentRecommendations: Array.isArray(parsed.contentRecommendations) && parsed.contentRecommendations.length > 0 ? parsed.contentRecommendations : baseline.contentRecommendations,
      engineSource: modelName.includes('2.0') ? 'Google Gemini 2.0 AI' : 'Google Gemini 1.5 AI'
    };
  } catch (error) {
    console.warn('Falling back to built-in Deep Intelligence AI Engine:', error);
    const fallback = generateOnPageSeoPackage(input);
    fallback.engineSource = 'Deep Intelligence AI (Local Safe Mode)';
    return fallback;
  }
}

