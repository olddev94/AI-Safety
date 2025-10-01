import { Clock } from 'lucide-react';

interface FooterProps {
    lastUpdated?: string;
}

export const Footer = ({ lastUpdated }: FooterProps) => {
    const formatLastUpdated = (dateString?: string) => {
        if (!dateString) {
            return 'Data refresh time unavailable';
        }

        try {
            // Parse the UTC time and convert to local timezone
            const utcDate = new Date(dateString + 'Z');

            // Format in local timezone with options
            const localDate = utcDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const localTime = utcDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            return `Last updated: ${localDate} at ${localTime}`;
        } catch (error) {
            return 'Data refresh time unavailable';
        }
    };

    return (
        <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-8">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-end text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatLastUpdated(lastUpdated)}
                </div>
            </div>
        </footer>
    );
};
