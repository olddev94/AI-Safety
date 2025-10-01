import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Edit, Save, X } from 'lucide-react';
import { categories, countries } from '@/data/mockIncidents';
import { SelfReportSubmission } from '@/services/adminService';

// Form validation schema
const editReportSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
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

type EditReportFormData = z.infer<typeof editReportSchema>;

interface EditReportFormProps {
    report: SelfReportSubmission;
    onSubmit?: (data: EditReportFormData) => Promise<void>;
    onCancel?: () => void;
    isSubmitting?: boolean;
}

export const EditReportForm: React.FC<EditReportFormProps> = ({
    report,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const form = useForm<EditReportFormData>({
        resolver: zodResolver(editReportSchema),
        defaultValues: {
            title: report.title || '',
            description: report.description || '',
            url: report.url || '',
            date: report.date || '',
            country: Array.isArray(report.country) ? report.country[0] : report.country || '',
            category: report.category || '',
        },
    });

    const handleSubmit = async (data: EditReportFormData) => {
        console.log('Edit form submitted:', data);
        if (onSubmit) {
            try {
                await onSubmit(data);
            } catch (error) {
                console.error('Form submission failed:', error);
                // Don't reset form on error - keep user's edits
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Edit className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Edit Report</h3>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Title Field */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Incident Title *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Brief, descriptive title of the incident"
                                        {...field}
                                    />
                                </FormControl>
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
                                <FormLabel className="text-sm font-semibold">Detailed Description *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Provide a detailed description of the incident, including context, what happened, and any relevant details..."
                                        className="min-h-[120px] resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Include as much detail as possible to help reviewers understand the incident.
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
                                <FormLabel className="text-sm font-semibold">Source URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/article-about-incident"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Optional: Link to news article, report, or other source about this incident.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date Field */}
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Incident Date *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
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
                                    <FormLabel className="text-sm font-semibold">Country *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country} value={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Category Field */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Category *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Choose the category that best describes this incident.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
