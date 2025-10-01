export interface Incident {
  id: string;
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  country: string;
  category: string;
  coordinates?: [number, number]; // [lng, lat]
  severity: 'Death' | 'Accident';
  financialLoss?: number;
  casualties?: number;
}

export type TimeRangePreset = 'MTD' | 'YTD' | '2024' | '2023' | 'custom';

export interface FilterState {
  categories: string[];
  severities: ('Death' | 'Accident')[];
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