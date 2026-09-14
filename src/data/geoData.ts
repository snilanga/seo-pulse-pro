export interface CountryLocation {
  name: string;
  code: string;
  flag: string;
  popularCities: string[];
}

export const COUNTRIES_AND_CITIES: CountryLocation[] = [
  {
    name: 'Sri Lanka',
    code: 'LK',
    flag: '🇱🇰',
    popularCities: [
      'Colombo',
      'Kandy',
      'Galle',
      'Negombo',
      'Jaffna',
      'Kurunegala',
      'Batticaloa',
      'Gampaha',
      'Matara',
      'Anuradhapura',
      'Ratnapura',
      'Trincomalee',
      'Kalutara',
      'Nuwara Eliya',
      'Dambulla'
    ]
  },
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    popularCities: [
      'New York',
      'Los Angeles',
      'Chicago',
      'Houston',
      'Phoenix',
      'Philadelphia',
      'San Antonio',
      'San Diego',
      'Dallas',
      'Austin',
      'San Jose',
      'San Francisco',
      'Seattle',
      'Denver',
      'Miami',
      'Atlanta',
      'Boston',
      'Las Vegas',
      'Orlando',
      'Washington DC'
    ]
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    popularCities: [
      'London',
      'Manchester',
      'Birmingham',
      'Leeds',
      'Glasgow',
      'Liverpool',
      'Newcastle',
      'Sheffield',
      'Bristol',
      'Edinburgh',
      'Belfast',
      'Cardiff',
      'Leicester',
      'Nottingham',
      'Southampton'
    ]
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    popularCities: [
      'Toronto',
      'Montreal',
      'Vancouver',
      'Calgary',
      'Edmonton',
      'Ottawa',
      'Winnipeg',
      'Quebec City',
      'Hamilton',
      'Kitchener',
      'Victoria',
      'Halifax'
    ]
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    popularCities: [
      'Sydney',
      'Melbourne',
      'Brisbane',
      'Perth',
      'Adelaide',
      'Gold Coast',
      'Canberra',
      'Newcastle',
      'Wollongong',
      'Hobart',
      'Geelong',
      'Cairns'
    ]
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    popularCities: [
      'Mumbai',
      'Delhi',
      'Bengaluru',
      'Hyderabad',
      'Chennai',
      'Kolkata',
      'Pune',
      'Ahmedabad',
      'Jaipur',
      'Surat',
      'Lucknow',
      'Kochi',
      'Chandigarh',
      'Indore',
      'Noida'
    ]
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    popularCities: [
      'Dubai',
      'Abu Dhabi',
      'Sharjah',
      'Ajman',
      'Ras Al Khaimah',
      'Fujairah',
      'Al Ain',
      'Umm Al Quwain'
    ]
  },
  {
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    popularCities: [
      'Singapore Central',
      'Marina Bay',
      'Jurong',
      'Tampines',
      'Woodlands',
      'Orchard',
      'Bedok'
    ]
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    popularCities: [
      'Berlin',
      'Munich',
      'Frankfurt',
      'Hamburg',
      'Cologne',
      'Stuttgart',
      'Düsseldorf',
      'Leipzig',
      'Dortmund',
      'Essen'
    ]
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    popularCities: [
      'Paris',
      'Marseille',
      'Lyon',
      'Toulouse',
      'Nice',
      'Nantes',
      'Strasbourg',
      'Montpellier',
      'Bordeaux',
      'Lille'
    ]
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    popularCities: [
      'Auckland',
      'Wellington',
      'Christchurch',
      'Hamilton',
      'Tauranga',
      'Dunedin',
      'Queenstown'
    ]
  },
  {
    name: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    popularCities: [
      'Kuala Lumpur',
      'George Town (Penang)',
      'Johor Bahru',
      'Ipoh',
      'Shah Alam',
      'Petaling Jaya',
      'Malacca City',
      'Kota Kinabalu'
    ]
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    popularCities: [
      'Riyadh',
      'Jeddah',
      'Mecca',
      'Medina',
      'Dammam',
      'Khobar',
      'Dhahran',
      'Tabuk'
    ]
  },
  {
    name: 'Qatar',
    code: 'QA',
    flag: '🇶🇦',
    popularCities: [
      'Doha',
      'Al Rayyan',
      'Al Wakrah',
      'Al Khor',
      'Lusail'
    ]
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    popularCities: [
      'Johannesburg',
      'Cape Town',
      'Durban',
      'Pretoria',
      'Port Elizabeth',
      'Bloemfontein',
      'Sandton'
    ]
  },
  {
    name: 'Ireland',
    code: 'IE',
    flag: '🇮🇪',
    popularCities: [
      'Dublin',
      'Cork',
      'Galway',
      'Limerick',
      'Waterford',
      'Drogheda'
    ]
  },
  {
    name: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    popularCities: [
      'Amsterdam',
      'Rotterdam',
      'The Hague',
      'Utrecht',
      'Eindhoven',
      'Groningen'
    ]
  },
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    popularCities: [
      'Tokyo',
      'Osaka',
      'Kyoto',
      'Yokohama',
      'Nagoya',
      'Sapporo',
      'Fukuoka',
      'Kobe'
    ]
  },
  {
    name: 'Global / Worldwide',
    code: 'GL',
    flag: '🌐',
    popularCities: [
      'International',
      'North America',
      'Europe',
      'Asia-Pacific',
      'Latin America',
      'Middle East'
    ]
  }
];

export interface BusinessCategoryOption {
  category: string;
  subcategories: string[];
  suggestedAudiences: string[];
}

export const BUSINESS_TYPES_AND_AUDIENCES: BusinessCategoryOption[] = [
  {
    category: 'Web Design Agency',
    subcategories: [
      'Web Design & Development',
      'WordPress & Custom CMS Agency',
      'UI/UX Design Studio',
      'E-Commerce Development (Shopify/WooCommerce)',
      'Digital Marketing & SEO Agency',
      'Mobile App Development Studio'
    ],
    suggestedAudiences: [
      'Small & Medium Businesses (SMEs)',
      'Startups & Tech Founders',
      'E-Commerce Store Owners',
      'Local Service Providers & Contractors',
      'Corporate & Enterprise Marketing Teams',
      'B2B Companies & Professional Services'
    ]
  },
  {
    category: 'Healthcare & Telemedicine Clinic',
    subcategories: [
      'Virtual Doctor Consultation & Telehealth',
      'Dental Clinic & Cosmetic Dentistry',
      'Mental Health & Online Therapy',
      'Pediatric Care & Family Medicine',
      'Physiotherapy & Rehabilitation Clinic',
      'Diagnostic Lab & Health Screening'
    ],
    suggestedAudiences: [
      'Patients Seeking Same-Day Consultations',
      'Busy Working Professionals & Remote Workers',
      'Families & Parents Seeking Pediatric Care',
      'Chronic Illness Patients Needing Rx Refills',
      'Senior Citizens & Caregivers',
      'Health-Conscious Individuals'
    ]
  },
  {
    category: 'B2B SaaS & Cyber Security Platform',
    subcategories: [
      'Zero Trust Cloud Security & Compliance',
      'CRM & Sales Pipeline Software',
      'HR Tech & Payroll Automation',
      'DevOps & Infrastructure Monitoring',
      'Fintech & Payment Gateway Solutions',
      'AI & Machine Learning Developer Tools'
    ],
    suggestedAudiences: [
      'CISOs & Chief Information Security Officers',
      'DevOps Engineers & Solution Architects',
      'VP of Engineering & CTOs',
      'Enterprise Procurement Directors',
      'Growth Stage Startup Founders',
      'Product Managers & Scrum Leaders'
    ]
  },
  {
    category: 'Home Decor & Furniture E-Commerce',
    subcategories: [
      'Handcrafted Wooden Furniture',
      'Modern Minimalist Living Room Decor',
      'Kitchenware & Ceramic Artisan Products',
      'Luxury Lighting & Home Fixtures',
      'Bedding & Organic Textile Goods',
      'Outdoor Patio & Garden Furniture'
    ],
    suggestedAudiences: [
      'Modern Homeowners & New Buyers',
      'Interior Designers & Home Stagers',
      'Eco-Conscious Consumers & Minimalists',
      'Luxury Lifestyle Shoppers',
      'Apartment & Condo Renters',
      'DIY & Home Improvement Enthusiasts'
    ]
  },
  {
    category: 'Real Estate Agency & Brokerage',
    subcategories: [
      'Residential Property Sales & Rentals',
      'Luxury Real Estate & Beachfront Villas',
      'Commercial Real Estate & Office Leasing',
      'Property Management & Maintenance',
      'Land & Investment Development'
    ],
    suggestedAudiences: [
      'First-Time Home Buyers',
      'Real Estate Investors & Flippers',
      'High-Net-Worth Individuals (HNWI)',
      'Commercial Tenants & Retail Brands',
      'Expatriates & International Investors'
    ]
  },
  {
    category: 'Legal Services & Law Firm',
    subcategories: [
      'Corporate & Business Law',
      'Personal Injury Lawyers',
      'Immigration & Visa Advisory',
      'Intellectual Property & Patents',
      'Family Law & Estate Planning',
      'Criminal Defense Legal Counsel'
    ],
    suggestedAudiences: [
      'Business Owners & Corporate Clients',
      'Accident Victims Seeking Compensation',
      'Immigrants & International Students',
      'Families Planning Estates & Wills',
      'Entrepreneurs Protecting Trademarks'
    ]
  },
  {
    category: 'Financial Services & Accounting Firm',
    subcategories: [
      'Certified Public Accountants (CPA)',
      'Tax Planning & Preparation',
      'Wealth Management & Investment Advisory',
      'Business Bookkeeping & Payroll',
      'Mortgage Broker & Loan Advisory'
    ],
    suggestedAudiences: [
      'High-Income Professionals & Doctors',
      'Small Business Owners & Freelancers',
      'Individuals Seeking Retirement Planning',
      'Real Estate Investors Needing Tax Shelters',
      'Corporations Needing Audit Compliance'
    ]
  },
  {
    category: 'Fitness, Gym & Wellness Studio',
    subcategories: [
      'Personal Training & Fitness Coaching',
      'Yoga & Pilates Studio',
      'CrossFit & High-Intensity Gym',
      'Holistic Nutrition & Diet Counseling',
      'Spa, Massage & Wellness Retreat'
    ],
    suggestedAudiences: [
      'Fitness Enthusiasts & Weight Loss Seekers',
      'Busy Professionals Seeking Stress Relief',
      'Athletes & Marathon Runners',
      'Seniors Looking for Mobility & Balance',
      'Postpartum Mothers Seeking Gentle Recovery'
    ]
  },
  {
    category: 'Education & Online Learning Academy',
    subcategories: [
      'Coding Bootcamp & Tech Skills Training',
      'Language School & IELTS Preparation',
      'K-12 Private Tutoring & Exam Prep',
      'Corporate Professional Certification',
      'Creative Arts & Music Classes'
    ],
    suggestedAudiences: [
      'Career Changers & Job Seekers',
      'University Students & Graduates',
      'Parents Investing in Children’s Education',
      'Professionals Seeking Upskilling Certifications',
      'Lifelong Hobbyists & Enthusiasts'
    ]
  },
  {
    category: 'Automotive & Car Dealership / Repair',
    subcategories: [
      'Auto Repair & Mechanic Workshop',
      'Car Detailing & Ceramic Coating',
      'New & Used Car Dealership',
      'Tire & Wheel Alignment Services',
      'EV Charging & Hybrid Specialists'
    ],
    suggestedAudiences: [
      'Car Owners Needing Urgent Maintenance',
      'Luxury Vehicle Enthusiasts',
      'First-Time Car Buyers',
      'Commercial Fleet Managers',
      'Commuters & Rideshare Drivers'
    ]
  }
];

// Flat lists for general typing/filtering
export const ALL_BUSINESS_TYPES: string[] = [
  ...BUSINESS_TYPES_AND_AUDIENCES.map(b => b.category),
  ...BUSINESS_TYPES_AND_AUDIENCES.flatMap(b => b.subcategories)
];

export const ALL_TARGET_AUDIENCES: string[] = Array.from(
  new Set(BUSINESS_TYPES_AND_AUDIENCES.flatMap(b => b.suggestedAudiences))
);

