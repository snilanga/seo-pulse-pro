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
