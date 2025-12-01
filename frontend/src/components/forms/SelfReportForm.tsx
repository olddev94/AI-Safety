import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Send } from 'lucide-react';
import { categories, countries } from '@/data/mockIncidents';

// Form validation schema
const selfReportSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
    severity: z.enum(['Fatality', 'Accident']).optional(),
    url: z.string().optional().refine((url) => {
        if (!url || url.trim() === '') return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }, 'Please enter a valid URL'),
    date: z.string().min(1, 'Date is required').refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        return selectedDate <= today;
    }, 'Date cannot be in the future'),
    country: z.string().min(1, 'Please select a country'),
    category: z.string().min(1, 'Please select a category'),
});

type SelfReportFormData = z.infer<typeof selfReportSchema>;

interface SelfReportFormProps {
    onSubmit?: (data: SelfReportFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export const SelfReportForm: React.FC<SelfReportFormProps> = ({ onSubmit, isSubmitting = false }) => {
    const form = useForm<SelfReportFormData>({
        resolver: zodResolver(selfReportSchema),
        defaultValues: {
            title: '',
            description: '',
            severity: undefined,
            url: '',
            date: '',
            country: '',
            category: '',
        },
    });

    const handleSubmit = async (data: SelfReportFormData) => {
        console.log('Form submitted:', data);
        if (onSubmit) {
            try {
                await onSubmit(data);
                // Reset form only after successful submission
                form.reset();
            } catch (error) {
                // Don't reset form on error - keep user's data
                console.error('Form submission failed:', error);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="h-12 w-12 text-orange-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Self-Report AI Incident</CardTitle>
                    <CardDescription className="text-lg">
                        Help us track AI-related incidents by reporting your experience. Your submission will be reviewed by our team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Incident Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Brief, descriptive title of the incident"
                                                {...field}
                                                className="text-base"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a clear, concise title that summarizes the incident
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Field */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Incident Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Provide detailed information about what happened, when it occurred, what AI system was involved, and what the consequences were..."
                                                className="min-h-[120px] text-base"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Include as much detail as possible: AI system involved, what went wrong, impact, and consequences
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Severity Field */}
                            <FormField
                                control={form.control}
                                name="severity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Incident Severity *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="text-base">
                                                    <SelectValue placeholder="Select the severity of this incident" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Fatality" className="text-base">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                                        Fatality - Fatality occurred
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Accident" className="text-base">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                                                        Accident - Injury or damage occurred
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Indicate whether this incident resulted in fatality or was an accident with injuries/damage
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* URL Field */}
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Related URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://example.com/news-article-or-source"
                                                {...field}
                                                className="text-base"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Optional: Link to news article, report, or other source about this incident
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date Field */}
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Incident Date *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                className="text-base"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            When did this incident occur?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Country Field */}
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Country *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="text-base">
                                                    <SelectValue placeholder="Select the country where this incident occurred" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem key={country} value={country} className="text-base">
                                                        {country}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select the country where the incident took place
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Category Field */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Incident Category *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="text-base">
                                                    <SelectValue placeholder="Select the category that best describes this incident" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category} className="text-base">
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Choose the category that best matches the type of AI system involved
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full text-base py-6 bg-orange-600 hover:bg-orange-700"
                                    disabled={isSubmitting || form.formState.isSubmitting}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {(isSubmitting || form.formState.isSubmitting) ? 'Submitting Report...' : 'Submit Incident Report'}
                                </Button>
                            </div>

                            {/* Disclaimer */}
                            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                                <p className="font-medium mb-2">Important Notice:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Your report will be reviewed by our team before publication</li>
                                    <li>• Please ensure all information is accurate and factual</li>
                                    <li>• Do not include personal identifying information of individuals</li>
                                    <li>• Reports may be used for research and safety improvement purposes</li>
                                </ul>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
