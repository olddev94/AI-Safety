import { TimeRangePreset } from '@/types/incident';

export const getDateRangeForPreset = (preset: TimeRangePreset): { start: string; end: string } => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (preset) {
        case 'MTD': {
            // Month to Date - from first day of current month to today
            const startOfMonth = new Date(currentYear, currentMonth, 1);
            return {
                start: startOfMonth.toISOString().split('T')[0],
                end: now.toISOString().split('T')[0]
            };
        }

        case 'YTD': {
            // Year to Date - from January 1st of current year to today
            const startOfYear = new Date(currentYear, 0, 1);
            return {
                start: startOfYear.toISOString().split('T')[0],
                end: now.toISOString().split('T')[0]
            };
        }

        case '2024': {
            // Full year 2024
            return {
                start: '2024-01-01',
                end: '2024-12-31'
            };
        }

        case '2023': {
            // Full year 2023
            return {
                start: '2023-01-01',
                end: '2023-12-31'
            };
        }

        case 'custom':
        default: {
            // Return empty dates for custom range
            return {
                start: '',
                end: ''
            };
        }
    }
};

export const getPresetLabel = (preset: TimeRangePreset): string => {
    switch (preset) {
        case 'MTD':
            return 'Month to Date';
        case 'YTD':
            return 'Year to Date';
        case '2024':
            return '2024';
        case '2023':
            return '2023';
        case 'custom':
            return 'Custom Range';
        default:
            return 'Custom Range';
    }
};

export const formatDateRange = (start: string, end: string): string => {
    if (!start && !end) return 'No date range selected';
    if (!start) return `Until ${new Date(end).toLocaleDateString()}`;
    if (!end) return `From ${new Date(start).toLocaleDateString()}`;
    return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
};
