export type KeywordCategoryType = 
  | 'High Priority'
  | 'Local SEO'
  | 'Commercial Intent'
  | 'Transactional'
  | 'Question Keywords'
  | 'City Keywords'
  | 'Country Keywords'
  | 'Near Me Keywords'
  | 'Open Now / Today Keywords';

export type SearchIntentType = 'Transactional' | 'Commercial' | 'Informational' | 'Navigational' | 'Local';

export type VolumeDataSourceType = 'Live Search Volume' | 'Estimated Search Demand' | 'Keyword Suggestions';

export interface GeneratedKeywordItem {
  id: string;
  keyword: string;
  category: KeywordCategoryType;
  searchIntent: SearchIntentType;
  location: string;
  
  // Search Volume & Credibility fields
  searchVolume: number;
  dataSource: VolumeDataSourceType;
  hasActualVolumeData: boolean;
  
  // Metrics & Scoring
  competition: 'Low' | 'Medium' | 'High';
  competitionScore: number; // 0-100
  difficulty: number; // 0-100
  cpc: number; // estimated CPC
  cpcFormatted: string; // e.g. "$3.85"
  opportunityScore: number; // 0-100
  priority: 'High' | 'Medium' | 'Low';
  
  // Scoring Breakdown
  scoringFactors: {
    intentScore: number;
    localRelevance: number;
    commercialValue: number;
    difficultyEase: number;
    volumeWeight: number;
  };
  
  // Recommendation reason
  recommendationReason: string;
  suggestedAction: string;
  isAddedToTracker?: boolean;
}

export interface KeywordGeneratorInput {
  businessType: string;
  customSeedQuery?: string;
  country: string;
  stateProvince: string;
  city: string;
  areaNeighborhood: string;
  selectedCategoryFilter?: 'All' | KeywordCategoryType;
  selectedIntentFilter?: 'All' | SearchIntentType;
}

export interface KeywordGenerationResult {
  generatedAt: string;
  businessType: string;
  locationLabel: string;
  totalGenerated: number;
  highPriorityCount: number;
  avgOpportunityScore: number;
  keywords: GeneratedKeywordItem[];
  volumeNotice: string;
}
