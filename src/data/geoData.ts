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
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    popularCities: [
      'Rome',
      'Milan',
      'Naples',
      'Turin',
      'Florence',
      'Venice',
      'Bologna',
      'Palermo',
      'Genoa',
      'Verona'
    ]
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    popularCities: [
      'Madrid',
      'Barcelona',
      'Valencia',
      'Seville',
      'Zaragoza',
      'Málaga',
      'Murcia',
      'Palma de Mallorca',
      'Bilbao',
      'Alicante'
    ]
  },
  {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    popularCities: [
      'São Paulo',
      'Rio de Janeiro',
      'Brasília',
      'Salvador',
      'Fortaleza',
      'Belo Horizonte',
      'Curitiba',
      'Manaus',
      'Recife',
      'Porto Alegre'
    ]
  },
  {
    name: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    popularCities: [
      'Zurich',
      'Geneva',
      'Basel',
      'Lausanne',
      'Bern',
      'Winterthur',
      'Lucerne',
      'St. Gallen',
      'Lugano'
    ]
  },
  {
    name: 'Sweden',
    code: 'SE',
    flag: '🇸🇪',
    popularCities: [
      'Stockholm',
      'Gothenburg',
      'Malmö',
      'Uppsala',
      'Västerås',
      'Örebro',
      'Linköping',
      'Helsingborg'
    ]
  },
  {
    name: 'Norway',
    code: 'NO',
    flag: '🇳🇴',
    popularCities: [
      'Oslo',
      'Bergen',
      'Trondheim',
      'Stavanger',
      'Bærum',
      'Kristiansand',
      'Drammen',
      'Tromsø'
    ]
  },
  {
    name: 'Denmark',
    code: 'DK',
    flag: '🇩🇰',
    popularCities: [
      'Copenhagen',
      'Aarhus',
      'Odense',
      'Aalborg',
      'Esbjerg',
      'Randers',
      'Kolding'
    ]
  },
  {
    name: 'Thailand',
    code: 'TH',
    flag: '🇹🇭',
    popularCities: [
      'Bangkok',
      'Nonthaburi',
      'Chiang Mai',
      'Phuket',
      'Pattaya',
      'Hat Yai',
      'Udon Thani',
      'Surat Thani'
    ]
  },
  {
    name: 'Indonesia',
    code: 'ID',
    flag: '🇮🇩',
    popularCities: [
      'Jakarta',
      'Surabaya',
      'Bandung',
      'Medan',
      'Bekasi',
      'Denpasar (Bali)',
      'Semarang',
      'Tangerang',
      'Palembang',
      'Makassar'
    ]
  },
  {
    name: 'Philippines',
    code: 'PH',
    flag: '🇵🇭',
    popularCities: [
      'Manila',
      'Quezon City',
      'Davao City',
      'Caloocan',
      'Cebu City',
      'Zamboanga City',
      'Taguig',
      'Pasig',
      'Cagayan de Oro',
      'Makati'
    ]
  },
  {
    name: 'Pakistan',
    code: 'PK',
    flag: '🇵🇰',
    popularCities: [
      'Karachi',
      'Lahore',
      'Faisalabad',
      'Rawalpindi',
      'Gujranwala',
      'Peshawar',
      'Multan',
      'Islamabad',
      'Quetta',
      'Sialkot'
    ]
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    flag: '🇧🇩',
    popularCities: [
      'Dhaka',
      'Chittagong',
      'Khulna',
      'Rajshahi',
      'Sylhet',
      'Barisal',
      'Rangpur',
      'Comilla'
    ]
  },
  {
    name: 'Mexico',
    code: 'MX',
    flag: '🇲🇽',
    popularCities: [
      'Mexico City',
      'Guadalajara',
      'Monterrey',
      'Puebla',
      'Tijuana',
      'León',
      'Juárez',
      'Zapopan',
      'Mérida',
      'Cancún'
    ]
  },
  {
    name: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    popularCities: [
      'Istanbul',
      'Ankara',
      'Izmir',
      'Bursa',
      'Antalya',
      'Adana',
      'Konya',
      'Gaziantep',
      'Mersin'
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

export interface BusinessTypeAndAudience {
  category: string;
  subcategories: string[];
  suggestedAudiences: string[];
}

export const BUSINESS_TYPES_AND_AUDIENCES: BusinessTypeAndAudience[] = [
  {
    category: 'Technology & IT',
    subcategories: ['Managed IT Services', 'Cloud Infrastructure & DevOps', 'Cybersecurity & Compliance', 'Software Development & SaaS', 'IT Support & Helpdesk', 'Network Engineering & Telecom'],
    suggestedAudiences: ['CTOs & IT Directors', 'DevOps & Cloud Engineers', 'CISOs & Compliance Officers', 'Enterprise Tech Buyers', 'Tech Startups & Founders']
  },
  {
    category: 'Digital Marketing & Creative',
    subcategories: ['SEO & Content Marketing Agency', 'PPC & Google Ads Management', 'Social Media Marketing', 'Branding & Graphic Design', 'Video Production & Animation', 'Web Design & CRO'],
    suggestedAudiences: ['Chief Marketing Officers (CMOs)', 'Small & Medium Business Owners', 'E-commerce Brand Managers', 'Startup Founders', 'Growth Marketers']
  },
  {
    category: 'Business & Professional Services',
    subcategories: ['Management Consulting', 'HR Consulting & Recruiting', 'Business Process Outsourcing', 'Executive Coaching & Leadership', 'Virtual Assistant Services'],
    suggestedAudiences: ['CEOs & Managing Directors', 'HR Directors & Talent Leaders', 'Corporate Enterprise Executives', 'Growing SME Founders']
  },
  {
    category: 'Legal Services',
    subcategories: ['Corporate & Commercial Law', 'Personal Injury & Accident Attorneys', 'Immigration & Visa Lawyers', 'Intellectual Property & Patents', 'Family Law & Divorce', 'Real Estate & Estate Planning Law'],
    suggestedAudiences: ['Corporate Business Leaders', 'Accident & Injury Victims', 'Immigrants & Global Relocators', 'Families & Individuals Seeking Legal Counsel', 'Entrepreneurs Protecting IP']
  },
  {
    category: 'Real Estate & Property',
    subcategories: ['Residential Real Estate Sales', 'Commercial Property & Office Leasing', 'Luxury Real Estate & Vacation Villas', 'Property Management & Rentals', 'Land & Real Estate Development'],
    suggestedAudiences: ['First-Time Homebuyers', 'Property Investors & Flippers', 'High-Net-Worth Individuals (HNWI)', 'Commercial Tenants & Retail Brands', 'Expatriate Real Estate Buyers']
  },
  {
    category: 'Construction & Building',
    subcategories: ['General Contractors & Builders', 'Commercial Construction & Fit-Out', 'Architectural Design & Planning', 'Civil Engineering & Infrastructure', 'Renovations & Home Remodeling'],
    suggestedAudiences: ['Homeowners Planning Renovations', 'Commercial Property Developers', 'Government & Municipal Planners', 'Real Estate Investors & Architects']
  },
  {
    category: 'Home Services',
    subcategories: ['Plumbing & Drainage Services', 'HVAC, Heating & AC Installation', 'Electrical Contractors & Wiring', 'Roofing & Gutter Installation', 'Handyman & Home Maintenance', 'Landscaping & Lawn Care'],
    suggestedAudiences: ['Residential Homeowners', 'Landlords & Property Managers', 'Commercial Facility Managers', 'HOA & Residential Community Managers']
  },
  {
    category: 'Cleaning & Facility Services',
    subcategories: ['Commercial Office Cleaning', 'Residential Deep Cleaning & Maid Service', 'Industrial & Warehouse Cleaning', 'Carpet & Upholstery Cleaning', 'Window Cleaning & Pressure Washing'],
    suggestedAudiences: ['Commercial Facility Directors', 'Office Managers & HR Leaders', 'Busy Working Homeowners', 'Airbnb & Vacation Rental Hosts']
  },
  {
    category: 'Pest Control',
    subcategories: ['Residential Pest Elimination', 'Commercial Pest Management', 'Termite Inspection & Protection', 'Bed Bug & Rodent Removal', 'Eco-Friendly Wildlife Control'],
    suggestedAudiences: ['Homeowners Experiencing Infestations', 'Restaurant & Food Service Managers', 'Hotel & Hospitality Operators', 'Warehouse & Logistics Managers']
  },
  {
    category: 'Hospitality',
    subcategories: ['Boutique Hotels & Luxury Resorts', 'Vacation Rentals & Airbnb Management', 'Bed & Breakfast / Guest Houses', 'Conference Venues & Event Lodging', 'Eco-Lodges & Nature Retreats'],
    suggestedAudiences: ['Leisure & Holiday Travelers', 'Corporate Business Travelers', 'Couples Seeking Luxury Getaways', 'Family Vacationers', 'Digital Nomads & Remote Workers']
  },
  {
    category: 'Travel & Tourism',
    subcategories: ['Tour Operators & Guided Excursions', 'Travel Agencies & Holiday Packages', 'Adventure Travel & Eco-Tours', 'Visa Advisory & Flight Bookings', 'Destination Management (DMC)'],
    suggestedAudiences: ['International Tourists & Backpackers', 'Families Seeking Holiday Packages', 'Adventure Enthusiasts & Solo Travelers', 'Honeymooners & Luxury Travelers']
  },
  {
    category: 'Restaurants & Food',
    subcategories: ['Fine Dining & Casual Restaurants', 'Cafes, Bakeries & Coffee Roasters', 'Catering & Event Food Services', 'Fast Food & Cloud Kitchens', 'Bars, Pubs & Breweries'],
    suggestedAudiences: ['Local Foodies & Diners', 'Corporate Event Planners', 'Couples Seeking Date Night Dining', 'Families & Casual Weekend Diners', 'Wedding & Party Hosts']
  },
  {
    category: 'E-commerce & Retail',
    subcategories: ['Direct-to-Consumer (DTC) Brands', 'Multi-Brand Online Stores', 'Specialty Niche Retailers', 'B2B Wholesale E-Commerce', 'Subscription Box Services'],
    suggestedAudiences: ['Online Shoppers & Deal Seekers', 'Eco-Conscious Consumers', 'Tech-Savvy Trend Shoppers', 'Bulk Wholesale Corporate Buyers']
  },
  {
    category: 'Fashion & Apparel',
    subcategories: ['Women’s & Men’s Designer Wear', 'Sustainable & Ethical Clothing', 'Streetwear & Urban Apparel', 'Activewear & Athleisure', 'Footwear & Luxury Accessories'],
    suggestedAudiences: ['Style-Conscious Consumers', 'Athletes & Fitness Enthusiasts', 'Eco-Minded Shoppers', 'Gen Z & Millennial Trend Followers']
  },
  {
    category: 'Beauty & Personal Care',
    subcategories: ['Hair Salons & Barbershops', 'Medical Spa & Aesthetic Dermatology', 'Organic Skincare & Cosmetics', 'Nail & Lash Extension Salons', 'Laser Hair Removal & Body Sculpting'],
    suggestedAudiences: ['Women & Men Seeking Self-Care', 'Brides & Wedding Parties', 'Skincare Enthusiasts', 'Anti-Aging & Aesthetic Clients']
  },
  {
    category: 'Healthcare & Medical',
    subcategories: ['Virtual Doctor & Telehealth Clinic', 'Dental Clinic & Cosmetic Dentistry', 'Physiotherapy & Rehabilitation', 'Diagnostic Labs & Pathology', 'Mental Health & Psychology', 'Specialized Surgeries & Clinics'],
    suggestedAudiences: ['Patients Seeking Urgent & Routine Care', 'Families Needing Pediatric Services', 'Senior Citizens & Caregivers', 'Chronic Illness & Rx Management Patients']
  },
  {
    category: 'Fitness & Wellness',
    subcategories: ['Gyms & Fitness Centers', 'Yoga & Pilates Studios', 'Personal Training & Online Coaching', 'Martial Arts & Boxing Gyms', 'Holistic Nutrition & Wellness Spas'],
    suggestedAudiences: ['Fitness Enthusiasts & Weight Loss Seekers', 'Busy Professionals Seeking Stress Relief', 'Athletes & Sports Competitors', 'Holistic Health Advocates']
  },
  {
    category: 'Education & Training',
    subcategories: ['Coding Bootcamps & Tech Academies', 'Private K-12 Tutoring & Exam Prep', 'Language Schools & IELTS Centers', 'Vocational & Trade Schools', 'Corporate Leadership Training'],
    suggestedAudiences: ['Career Changers & Tech Job Seekers', 'College Students & Graduates', 'Parents Investing in Child Tutoring', 'Corporate Employees Upskilling']
  },
  {
    category: 'Finance & Banking',
    subcategories: ['Accounting & CPA Firms', 'Wealth Management & Financial Advisory', 'Mortgage & Loan Brokerage', 'Fintech Apps & Payment Gateways', 'Commercial Banking & Microfinance'],
    suggestedAudiences: ['High-Net-Worth Individuals (HNWI)', 'Small Business Owners & Freelancers', 'First-Time Home Loan Applicants', 'Retirees Planning Wealth Transfer']
  },
  {
    category: 'Automotive',
    subcategories: ['Auto Repair & Mechanic Shops', 'Car Dealerships (New & Used)', 'Car Detailing & Ceramic Coatings', 'Tire, Brake & Suspension Services', 'EV & Hybrid Vehicle Maintenance'],
    suggestedAudiences: ['Vehicle Owners Needing Urgent Repairs', 'Car Enthusiasts & Detailers', 'Prospective Car Buyers', 'Commercial Fleet Managers']
  },
  {
    category: 'Logistics & Transportation',
    subcategories: ['Freight Forwarding & Air Cargo', 'Trucking & Road Haulage', 'Warehousing & 3PL Fulfillment', 'Courier & Same-Day Delivery', 'Moving & Relocation Services'],
    suggestedAudiences: ['Supply Chain & Logistics Directors', 'E-commerce Merchants & Brands', 'Manufacturers & Wholesalers', 'Homeowners Moving Cities or Countries']
  },
  {
    category: 'Import & Export',
    subcategories: ['International Trade Brokerage', 'Customs Clearance & Regulatory Compliance', 'Commodity Trading (Agricultural & Industrial)', 'Global Sourcing & Procurement'],
    suggestedAudiences: ['Overseas Importers & Distributors', 'Domestic Exporters & Manufacturers', 'Government Trade Departments', 'Supply Chain Procurement Officers']
  },
  {
    category: 'Manufacturing',
    subcategories: ['Custom CNC Machining & Fabrication', 'Plastics & Injection Molding', 'Electronics & PCB Manufacturing', 'Textile & Garment Production', 'Food & Beverage Packaging'],
    suggestedAudiences: ['Industrial Product Designers', 'Supply Chain Procurement Leads', 'Brand Owners Needing OEM/ODM', 'Hardware Tech Startups']
  },
  {
    category: 'Agriculture',
    subcategories: ['Commercial Farming & Crop Production', 'Agri-Tech & Hydroponics', 'Livestock & Dairy Farming', 'Organic Fertilizer & Seeds', 'Irrigation & Farming Machinery'],
    suggestedAudiences: ['Commercial Farm Owners', 'Agri-Business Investors', 'Organic Produce Wholesalers', 'Government Agriculture Agencies']
  },
  {
    category: 'Maritime & Marine',
    subcategories: ['Ship Chandler & Marine Supplies', 'Yacht Charters & Boat Dealerships', 'Marine Engineering & Hull Repairs', 'Port Logistics & Cargo Handling', 'Diving & Underwater Services'],
    suggestedAudiences: ['Ship Owners & Fleet Superintendents', 'Yacht Owners & Recreational Boaters', 'Harbor Authorities & Port Operators', 'Marine Contractors']
  },
  {
    category: 'Security',
    subcategories: ['CCTV & Alarm System Installation', 'Physical Guarding & Patrols', 'Cybersecurity & Penetration Testing', 'Access Control & Biometric Systems', 'Armored Transport & VIP Protection'],
    suggestedAudiences: ['Commercial Property & Facility Managers', 'Residential Estate & HOA Boards', 'Corporate CISOs & Risk Officers', 'High-Profile VIPs & Event Organizers']
  },
  {
    category: 'Events & Weddings',
    subcategories: ['Wedding Planners & Designers', 'Corporate Event Management', 'Sound, Stage & Lighting Rentals', 'Party Floral Design & Decorations', 'DJ & Live Music Entertainment'],
    suggestedAudiences: ['Couples Planning Weddings', 'Corporate Marketing & Event Teams', 'Birthday & Anniversary Celebrators', 'Charity Gala & Festival Organizers']
  },
  {
    category: 'Entertainment & Media',
    subcategories: ['Film & Video Production Studios', 'Music Recording & Audio Post', 'Talent & Influencer Management Agencies', 'Gaming & Esports Organizers', 'Podcasting & Broadcasting'],
    suggestedAudiences: ['Brand Marketing Teams', 'Content Creators & Streamers', 'Musicians & Filmmakers', 'Media Advertisers & Sponsors']
  },
  {
    category: 'Printing & Signage',
    subcategories: ['Commercial Large Format Printing', 'Vehicle Wrapping & Fleet Graphics', 'Custom Packaging & Box Printing', 'Signboards, Neon & LED Displays', 'Flyers, Brochures & Marketing Materials'],
    suggestedAudiences: ['Retail Store & Restaurant Owners', 'Corporate Brand Managers', 'Exhibition & Trade Show Exhibitors', 'Commercial Fleet Operators']
  },
  {
    category: 'Energy & Environment',
    subcategories: ['Solar Panel Installation & Clean Energy', 'Waste Management & Recycling Services', 'Environmental Consulting & Audits', 'Wind Energy & Battery Storage', 'Water Treatment & Purification'],
    suggestedAudiences: ['Residential Homeowners Seeking Lower Bills', 'Commercial Facility & Factory Owners', 'Municipal Governments & Utilities', 'Sustainability Officers & ESG Teams']
  },
  {
    category: 'Pet & Animal Services',
    subcategories: ['Veterinary Clinics & Animal Hospitals', 'Dog Grooming & Spa Salons', 'Pet Boarding, Daycare & Sitting', 'Professional Dog Training', 'Pet Supplies & Organic Pet Food'],
    suggestedAudiences: ['Pet Parents (Dogs, Cats & Exotic Pets)', 'Working Professionals Needing Daycare', 'New Puppy & Rescue Dog Owners', 'Pet Health Conscious Individuals']
  },
  {
    category: 'Photography & Creative',
    subcategories: ['Wedding & Engagement Photography', 'Commercial Product & Food Photography', 'Corporate Headshots & Portraits', 'Drone & Aerial Videography', 'Real Estate Architectural Photography'],
    suggestedAudiences: ['Couples & Newly Engaged Pairs', 'E-commerce Sellers & Restaurants', 'Corporate Executives & LinkedIn Professionals', 'Real Estate Agents & Brokers']
  },
  {
    category: 'Religious & Community Organizations',
    subcategories: ['Churches, Temples & Mosques', 'Non-Profit Charities & Foundations', 'Community Centers & Youth Programs', 'Volunteer & Social Impact Groups'],
    suggestedAudiences: ['Local Community Members & Families', 'Philanthropic Donors & Benefactors', 'Volunteers & Civic Activists', 'Youth & Senior Groups']
  },
  {
    category: 'Government & Public Services',
    subcategories: ['Municipal Councils & Public Works', 'Public Healthcare & Sanitation', 'Urban Planning & Housing Authorities', 'Public Transit & Transportation', 'Civic Information & Licensing'],
    suggestedAudiences: ['Local Citizens & Residents', 'Business Owners Complying with Codes', 'Contractors Bidding on Public Tenders', 'Civic Groups & Community Advocates']
  },
  {
    category: 'Sports',
    subcategories: ['Sports Clubs & Athletic Academies', 'Golf Courses & Country Clubs', 'Water Sports, Surfing & Diving', 'Personal Athletic Performance Training', 'Sports Equipment & Apparel Stores'],
    suggestedAudiences: ['Athletes & Youth Sports Participants', 'Sports Enthusiasts & Fans', 'Parents of Young Athletes', 'Fitness Seekers & Recreational Players']
  },
  {
    category: 'Financial Trading & Investment',
    subcategories: ['Forex & Stock Market Brokerages', 'Crypto Exchanges & Blockchain Trading', 'Algorithmic Trading & Robo-Advisory', 'Venture Capital & Private Equity', 'Commodities Trading Platforms'],
    suggestedAudiences: ['Active Day Traders & Retail Investors', 'Institutional Asset Managers', 'High-Net-Worth Investors', 'Fintech Enthusiasts & Crypto Traders']
  },
  {
    category: 'B2B & Industrial',
    subcategories: ['Industrial Machinery & Equipment', 'Wholesale Bulk Distribution', 'Safety Gear & PPE Suppliers', 'Heavy Equipment Rental', 'Chemicals & Raw Materials'],
    suggestedAudiences: ['Factory & Plant Managers', 'Procurement & Supply Chain Officers', 'Industrial Contractors', 'Warehouse Operators']
  },
  {
    category: 'Telecommunications',
    subcategories: ['Fiber Internet & Broadband Providers', 'VoIP & Business Phone Systems', '5G Mobile Network Operators', 'Satellite Communications', 'Data Center & Colocation Facilities'],
    suggestedAudiences: ['Enterprise IT Directors', 'Remote Workers & Residential Consumers', 'Call Centers & Customer Support Hubs', 'Small Business Owners']
  },
  {
    category: 'Local Services',
    subcategories: ['Locksmith Services', 'Appliance Repair & Servicing', 'Dry Cleaning & Tailoring', 'Shoe & Leather Repair', 'Courier & Messenger Services'],
    suggestedAudiences: ['Local Neighborhood Residents', 'Emergency Callers (Locked Out, Broken Appliance)', 'Busy Urban Professionals', 'Apartment Tenants']
  },
  {
    category: 'Other / Custom',
    subcategories: ['Specialized Bespoke Services', 'Custom Consulting', 'Emerging Tech & Innovation', 'Niche Artisans & Makers'],
    suggestedAudiences: ['Bespoke Custom Buyers', 'Niche Problem Solvers', 'Early Adopters & Innovators']
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

