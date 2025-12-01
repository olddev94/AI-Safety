import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SelfReportForm } from '@/components/forms/SelfReportForm';
import { submitSelfReport, SelfReportData } from '@/services/selfReportService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { authService } from '@/services/authService';

const SelfReport = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const user = authService.getUser();

    const handleLogout = () => {
        authService.clearUser();
        toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
        });
        navigate('/');
    };

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
                        {user && (
                            <div className="flex items-center gap-3">
                                {user.picture && (
                                    <img 
                                        src={user.picture} 
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full border border-border"
                                    />
                                )}
                                <div className="text-sm font-medium">
                                    {user.name}
                                </div>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        )}
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
