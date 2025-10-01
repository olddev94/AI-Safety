import axios from 'axios';

// Self-report submission service
export interface SelfReportData {
    title: string;
    description: string;
    severity?: string;
    url?: string;
    date: string;
    country: string;
    category: string;
}

// Backend API response interface
export interface ManualSourceResponse {
    message: string;
}

export interface SelfReportSubmission {
    id: string;
    title: string;
    description: string;
    url?: string;
    date: string;
    country: string[];
    category: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected' | 'junk';
}

// API base URL
const API_BASE_URL = `http://${window.location.hostname}:8800`;

// Local storage key for storing self-reports
const STORAGE_KEY = 'ai-incident-self-reports';

/**
 * Submit a self-report to the backend API
 */
export const submitSelfReport = async (data: SelfReportData): Promise<SelfReportSubmission> => {
    try {
        // Prepare the request data to match backend API expectations
        const requestData = {
            title: data.title,
            description: data.description,
            url: data.url || `https://manual-entry-${Date.now()}`, // Backend expects 'url' field
            severity: data.severity,
            date: data.date,
            country: [data.country], // Convert to array as backend expects
            category: data.category
        };

        // Send request to backend API
        const response = await axios.post<ManualSourceResponse>(
            `${API_BASE_URL}/sources/manual`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000, // 10 second timeout
            }
        );

        // Backend only returns a message, so create submission object locally
        const submission: SelfReportSubmission = {
            id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate local ID
            title: data.title,
            description: data.description,
            url: data.url,
            date: data.date,
            country: [data.country],
            category: data.category,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Also store locally as backup/cache
        const existingReports = getStoredReports();
        const updatedReports = [...existingReports, submission];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));

        return submission;
    } catch (error) {
        console.error('Error submitting self-report:', error);

        // Provide more specific error messages
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
                throw new Error('Unable to connect to the server. Please check your connection and try again.');
            } else if (error.response?.status === 500) {
                throw new Error('Server error occurred. Please try again later.');
            } else if (error.response?.status === 400) {
                throw new Error('Invalid data provided. Please check your inputs and try again.');
            } else {
                throw new Error(`Request failed: ${error.response?.data?.detail || error.message}`);
            }
        }

        throw new Error('Failed to submit report. Please try again.');
    }
};

/**
 * Get all stored self-reports from local storage
 */
export const getStoredReports = (): SelfReportSubmission[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading stored reports:', error);
        return [];
    }
};

/**
 * Get a specific report by ID
 */
export const getReportById = (id: string): SelfReportSubmission | null => {
    const reports = getStoredReports();
    return reports.find(report => report.id === id) || null;
};

/**
 * Clear all stored reports (useful for testing/development)
 */
export const clearStoredReports = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
