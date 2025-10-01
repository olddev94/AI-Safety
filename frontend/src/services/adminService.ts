// Admin service for managing self-reported incidents
import axios from 'axios';
import { SelfReportSubmission } from './selfReportService';

export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'junk';

export interface AdminStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    junk: number;
}

// API base URL
const API_BASE_URL = `http://${window.location.hostname}:8800`;

// Backend report interface (matches database structure)
export interface BackendReport {
    id: number;
    title: string;
    description: string;
    url: string;
    severity?: string;
    date: string;
    country: string[];
    category: string;
    created_at: string;
    manual: boolean;
    status: string;
}

/**
 * Get all stored self-reports for admin review
 */
export const getStoredReports = async (): Promise<SelfReportSubmission[]> => {
    try {
        const response = await axios.get<BackendReport[]>(`${API_BASE_URL}/admin/reports`);
        const backendReports = response.data;

        // Transform backend reports to frontend format
        const reports: SelfReportSubmission[] = backendReports.map(report => ({
            id: report.id.toString(),
            title: report.title,
            description: report.description,
            url: report.url,
            date: report.date,
            country: Array.isArray(report.country) ? report.country : [report.country],
            category: report.category,
            submittedAt: report.created_at,
            status: (report.status || 'pending') as 'pending' | 'approved' | 'rejected' | 'junk'
        }));

        return reports;
    } catch (error) {
        console.error('Error fetching reports from backend:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to fetch reports: ${error.response?.data?.detail || error.message}`);
        }
        throw new Error('Failed to fetch reports from server');
    }
};

/**
 * Update the status of a report (approve, reject)
 */
export const updateReportStatus = async (reportId: string, status: ReportStatus): Promise<void> => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/admin/reports/${reportId}/status`,
            { status },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }
        );

        if (!response.data.message) {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Error updating report status:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Report not found');
            } else if (error.response?.status === 400) {
                throw new Error('Invalid status provided');
            } else {
                throw new Error(`Failed to update report status: ${error.response?.data?.detail || error.message}`);
            }
        }
        throw new Error('Failed to update report status');
    }
};

/**
 * Update report content (title, description, etc.)
 */
export const updateReport = async (reportId: string, reportData: Partial<SelfReportSubmission>): Promise<void> => {
    try {
        // Transform frontend format to backend format
        const backendData = {
            title: reportData.title,
            description: reportData.description,
            url: reportData.url || '',
            date: reportData.date,
            country: Array.isArray(reportData.country) ? reportData.country : [reportData.country || ''],
            category: reportData.category,
            severity: undefined // Add severity if needed in the future
        };

        const response = await axios.put(
            `${API_BASE_URL}/admin/reports/${reportId}`,
            backendData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }
        );

        if (!response.data.message) {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Error updating report:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Report not found');
            } else if (error.response?.status === 400) {
                throw new Error(`Invalid data: ${error.response?.data?.detail || 'Please check all fields'}`);
            } else {
                throw new Error(`Failed to update report: ${error.response?.data?.detail || error.message}`);
            }
        }
        throw new Error('Failed to update report');
    }
};

/**
 * Delete a report permanently
 */
export const deleteReport = async (reportId: string): Promise<void> => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/admin/reports/${reportId}`,
            {
                timeout: 10000,
            }
        );

        if (!response.data.message) {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Report not found');
            } else {
                throw new Error(`Failed to delete report: ${error.response?.data?.detail || error.message}`);
            }
        }
        throw new Error('Failed to delete report');
    }
};

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = async (): Promise<AdminStats> => {
    try {
        const response = await axios.get<AdminStats>(`${API_BASE_URL}/admin/stats`);
        return response.data;
    } catch (error) {
        console.error('Error getting admin stats:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to fetch admin stats: ${error.response?.data?.detail || error.message}`);
        }
        return { total: 0, pending: 0, approved: 0, rejected: 0, junk: 0 };
    }
};

/**
 * Get a specific report by ID
 */
export const getReportById = async (reportId: string): Promise<SelfReportSubmission | null> => {
    try {
        const reports = await getStoredReports();
        return reports.find(report => report.id === reportId) || null;
    } catch (error) {
        console.error('Error getting report by ID:', error);
        return null;
    }
};

/**
 * Bulk approve multiple reports
 */
export const bulkApproveReports = async (reportIds: string[]): Promise<void> => {
    try {
        // Process reports sequentially to avoid overwhelming the server
        for (const reportId of reportIds) {
            await updateReportStatus(reportId, 'approved');
        }
    } catch (error) {
        console.error('Error bulk approving reports:', error);
        throw new Error('Failed to bulk approve reports');
    }
};

/**
 * Bulk reject multiple reports
 */
export const bulkRejectReports = async (reportIds: string[]): Promise<void> => {
    try {
        // Process reports sequentially to avoid overwhelming the server
        for (const reportId of reportIds) {
            await updateReportStatus(reportId, 'rejected');
        }
    } catch (error) {
        console.error('Error bulk rejecting reports:', error);
        throw new Error('Failed to bulk reject reports');
    }
};

/**
 * Bulk mark multiple reports as junk
 */
export const bulkMarkAsJunk = async (reportIds: string[]): Promise<void> => {
    try {
        // Process reports sequentially to avoid overwhelming the server
        for (const reportId of reportIds) {
            await updateReportStatus(reportId, 'junk');
        }
    } catch (error) {
        console.error('Error bulk marking reports as junk:', error);
        throw new Error('Failed to bulk mark reports as junk');
    }
};

/**
 * Export reports as JSON (for backup/analysis)
 */
export const exportReports = async (): Promise<string> => {
    try {
        const reports = await getStoredReports();
        return JSON.stringify(reports, null, 2);
    } catch (error) {
        console.error('Error exporting reports:', error);
        throw new Error('Failed to export reports');
    }
};

// Re-export types from selfReportService for convenience
export type { SelfReportSubmission } from './selfReportService';
