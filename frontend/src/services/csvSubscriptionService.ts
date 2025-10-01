import axios from 'axios';

// API base URL
const API_BASE_URL = `http://${window.location.hostname}:8800`;

export interface CsvSubscription {
    id: string;
    email: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
    countries?: string[];
    severities?: string[];
    format: 'csv' | 'json';
    includeMetadata: boolean;
    notes?: string;
    status: 'active' | 'paused' | 'cancelled';
    createdAt: string;
    lastExport?: string;
    nextExport?: string;
}

export interface SubscriptionRequest {
    email: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
    countries?: string[];
    severities?: string[];
    format: 'csv' | 'json';
    includeMetadata: boolean;
    notes?: string;
}

export interface ExportHistory {
    id: string;
    subscriptionId: string;
    exportDate: string;
    recordCount: number;
    fileSize: string;
    downloadUrl: string;
    status: 'completed' | 'failed' | 'processing';
}

export interface SubscriptionStats {
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalExports: number;
    lastExportDate?: string;
}

// Local storage key for storing subscriptions (temporary until backend implementation)
const STORAGE_KEY = 'csvSubscriptions';
const HISTORY_KEY = 'csvExportHistory';

/**
 * Create a new CSV subscription
 */
export const createSubscription = async (data: SubscriptionRequest): Promise<CsvSubscription> => {
    try {
        // TODO: Replace with actual API call when backend endpoint is ready
        // const response = await axios.post(`${API_BASE_URL}/subscriptions/csv`, data);

        // For now, simulate API response and store locally
        const subscription: CsvSubscription = {
            id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...data,
            status: 'active',
            createdAt: new Date().toISOString(),
            nextExport: calculateNextExport(data.frequency)
        };

        // Store locally
        const existingSubscriptions = getStoredSubscriptions();
        const updatedSubscriptions = [...existingSubscriptions, subscription];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubscriptions));

        return subscription;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw new Error('Failed to create subscription');
    }
};

/**
 * Get all CSV subscriptions for a user (by email)
 */
export const getSubscriptionsByEmail = async (email: string): Promise<CsvSubscription[]> => {
    try {
        // TODO: Replace with actual API call
        // const response = await axios.get(`${API_BASE_URL}/subscriptions/csv?email=${email}`);

        // For now, get from local storage
        const subscriptions = getStoredSubscriptions();
        return subscriptions.filter(sub => sub.email === email);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw new Error('Failed to fetch subscriptions');
    }
};

/**
 * Update subscription status
 */
export const updateSubscriptionStatus = async (
    subscriptionId: string,
    status: 'active' | 'paused' | 'cancelled'
): Promise<CsvSubscription> => {
    try {
        // TODO: Replace with actual API call
        // const response = await axios.patch(`${API_BASE_URL}/subscriptions/csv/${subscriptionId}`, { status });

        // For now, update local storage
        const subscriptions = getStoredSubscriptions();
        const updatedSubscriptions = subscriptions.map(sub =>
            sub.id === subscriptionId ? { ...sub, status } : sub
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubscriptions));

        const updatedSubscription = updatedSubscriptions.find(sub => sub.id === subscriptionId);
        if (!updatedSubscription) {
            throw new Error('Subscription not found');
        }

        return updatedSubscription;
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw new Error('Failed to update subscription');
    }
};

/**
 * Delete a subscription
 */
export const deleteSubscription = async (subscriptionId: string): Promise<void> => {
    try {
        // TODO: Replace with actual API call
        // await axios.delete(`${API_BASE_URL}/subscriptions/csv/${subscriptionId}`);

        // For now, remove from local storage
        const subscriptions = getStoredSubscriptions();
        const updatedSubscriptions = subscriptions.filter(sub => sub.id !== subscriptionId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubscriptions));
    } catch (error) {
        console.error('Error deleting subscription:', error);
        throw new Error('Failed to delete subscription');
    }
};

/**
 * Get export history for a subscription
 */
export const getExportHistory = async (subscriptionId: string): Promise<ExportHistory[]> => {
    try {
        // TODO: Replace with actual API call
        // const response = await axios.get(`${API_BASE_URL}/subscriptions/csv/${subscriptionId}/exports`);

        // For now, return mock data from local storage
        const history = getStoredExportHistory();
        return history.filter(export_ => export_.subscriptionId === subscriptionId);
    } catch (error) {
        console.error('Error fetching export history:', error);
        throw new Error('Failed to fetch export history');
    }
};

/**
 * Trigger manual export for a subscription
 */
export const triggerManualExport = async (subscriptionId: string): Promise<ExportHistory> => {
    try {
        // TODO: Replace with actual API call
        // const response = await axios.post(`${API_BASE_URL}/subscriptions/csv/${subscriptionId}/export`);

        // For now, create mock export entry
        const newExport: ExportHistory = {
            id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            subscriptionId,
            exportDate: new Date().toISOString(),
            recordCount: Math.floor(Math.random() * 1000) + 100, // Mock data
            fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            downloadUrl: `${API_BASE_URL}/downloads/export_${Date.now()}.csv`,
            status: 'processing'
        };

        // Store in local storage
        const history = getStoredExportHistory();
        const updatedHistory = [...history, newExport];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

        // Simulate processing completion after 3 seconds
        setTimeout(() => {
            const currentHistory = getStoredExportHistory();
            const updatedHistoryComplete = currentHistory.map(exp =>
                exp.id === newExport.id ? { ...exp, status: 'completed' as const } : exp
            );
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistoryComplete));
        }, 3000);

        return newExport;
    } catch (error) {
        console.error('Error triggering manual export:', error);
        throw new Error('Failed to trigger export');
    }
};

/**
 * Get subscription statistics
 */
export const getSubscriptionStats = async (): Promise<SubscriptionStats> => {
    try {
        // TODO: Replace with actual API call
        // const response = await axios.get(`${API_BASE_URL}/subscriptions/csv/stats`);

        // For now, calculate from local storage
        const subscriptions = getStoredSubscriptions();
        const history = getStoredExportHistory();

        const stats: SubscriptionStats = {
            totalSubscriptions: subscriptions.length,
            activeSubscriptions: subscriptions.filter(sub => sub.status === 'active').length,
            totalExports: history.length,
            lastExportDate: history.length > 0 ?
                history.sort((a, b) => new Date(b.exportDate).getTime() - new Date(a.exportDate).getTime())[0].exportDate :
                undefined
        };

        return stats;
    } catch (error) {
        console.error('Error fetching subscription stats:', error);
        throw new Error('Failed to fetch statistics');
    }
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Generate sample CSV data for preview
 */
export const generateSampleCsv = (filters: {
    categories: string[];
    countries?: string[];
    severities?: string[];
}): string => {
    const headers = [
        'id', 'title', 'description', 'category', 'severity', 'country',
        'date', 'url', 'source', 'created_at'
    ];

    const sampleRows = [
        [
            '1',
            'AI System Malfunction Causes Traffic Disruption',
            'Autonomous traffic management system experienced unexpected behavior',
            'AI System Failure',
            'Medium',
            'United States',
            '2024-01-15',
            'https://example.com/news/1',
            'TechNews',
            '2024-01-15T10:30:00Z'
        ],
        [
            '2',
            'Facial Recognition System Shows Bias',
            'Study reveals significant accuracy disparities across demographic groups',
            'AI Bias',
            'High',
            'United Kingdom',
            '2024-01-14',
            'https://example.com/news/2',
            'AI Ethics Blog',
            '2024-01-14T14:20:00Z'
        ]
    ];

    const csvContent = [
        headers.join(','),
        ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
};

// Helper functions
function getStoredSubscriptions(): CsvSubscription[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function getStoredExportHistory(): ExportHistory[] {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function calculateNextExport(frequency: 'daily' | 'weekly' | 'monthly'): string {
    const now = new Date();
    const nextExport = new Date(now);

    switch (frequency) {
        case 'daily':
            nextExport.setDate(now.getDate() + 1);
            break;
        case 'weekly':
            nextExport.setDate(now.getDate() + 7);
            break;
        case 'monthly':
            nextExport.setMonth(now.getMonth() + 1);
            break;
    }

    // Set to 9 AM for consistent delivery time
    nextExport.setHours(9, 0, 0, 0);

    return nextExport.toISOString();
}
