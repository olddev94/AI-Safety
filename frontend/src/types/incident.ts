export interface Incident {
  id: string;
  title: string;
  url: string;
  description: string;
  content: string;
  pubDate: string;
  country: string[];
  category: string;
  coordinates?: [number, number]; // [lng, lat]
  severity: 'Fatality' | 'Accident';
  financialLoss?: number;
  casualties?: number;
  image_url?: string;
}

export type TimeRangePreset = 'MTD' | 'YTD' | '2024' | '2023' | 'custom';

export interface FilterState {
  categories: string[];
  severities: ('Fatality' | 'Accident')[];
  countries: string[];
  dateRange: {
    start: string;
    end: string;
    preset?: TimeRangePreset;
  };
}

export interface DashboardStats {
  totalIncidents: number;
  totalDeaths: number;
  totalAccidents: number;
  totalFinancialLoss: number;
  recentIncidents: number;
}