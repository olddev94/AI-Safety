import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SelfReportForm } from '@/components/forms/SelfReportForm';
import { submitSelfReport, SelfReportData } from '@/services/selfReportService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SelfReport = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleFormSubmit = async (data: SelfReportData) => {
        setIsSubmitting(true);

        try {
            const submission = await submitSelfReport(data);

            // Show success toast
            toast({
                title: "Report Submitted Successfully",
                description: `Your report (ID: ${submission.id.slice(-8)}) has been submitted and is pending review.`,
                duration: 5000,
            });

            console.log('Self-report submitted successfully:', submission);
        } catch (error) {
            // Show error toast
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your report. Please try again.",
                variant: "destructive",
                duration: 5000,
            });

            console.error('Failed to submit self-report:', error);

            // Re-throw the error so the form component knows submission failed
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                            <Link to="/" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-center">AI Incident Self-Reporting</h1>
                    <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Report AI-related incidents to help improve safety and awareness in the AI community
                    </p>
                </div>
            </div>

            {/* Form Content */}
            <div className="container mx-auto py-8">
                <SelfReportForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
};

export default SelfReport;
