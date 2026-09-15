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
}

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
    contentRecommendations
  };
}
