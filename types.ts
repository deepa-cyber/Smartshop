
export interface SearchFilters {
  productName: string;
  brand?: string;
  budgetRange: string;
  deliveryOption: 'same-day' | 'one-day' | 'two-day' | 'any';
  pincode: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ComparisonResult {
  summary: string;
  sources: GroundingChunk[];
}

export interface RecentSearch extends SearchFilters {
  id: string;
  timestamp: number;
}
