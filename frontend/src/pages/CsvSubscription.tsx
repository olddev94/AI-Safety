import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Download, Mail, Calendar, Filter, FileSpreadsheet, ExternalLink, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const subscriptionSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    frequency: z.enum(['daily', 'weekly', 'monthly'], {
        required_error: 'Please select a frequency'
    }),
    categories: z.array(z.string()).min(1, 'Please select at least one category'),
    countries: z.array(z.string()).optional(),
    severities: z.array(z.string()).optional(),
    format: z.enum(['csv', 'json'], {
        required_error: 'Please select a format'
    }),
    includeMetadata: z.boolean().default(true),
    notes: z.string().optional()
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export default function CsvSubscription() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const form = useForm<SubscriptionFormData>({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            email: '',
            frequency: 'weekly',
            categories: [],
            countries: [],
            severities: [],
            format: 'csv',
            includeMetadata: true,
            notes: ''
        }
    });

    const categories = [
        'AI Death', 'AI Accident', 'AI Bias', 'AI Privacy Violation',
        'AI Security Breach', 'AI Misinformation', 'AI Job Displacement',
        'AI System Failure', 'AI Manipulation', 'Other AI Incident'
    ];

    const severities = [
        'Critical', 'High', 'Medium', 'Low'
    ];

    const countries = [
        'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
        'Japan', 'China', 'India', 'Australia', 'Brazil', 'Other'
    ];

    const onSubmit = async (data: SubscriptionFormData) => {
        setIsSubmitting(true);
        try {
            // Simulate API call - in real implementation, this would call your backend
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Subscription data:', data);

            // Store subscription locally for now (in real app, send to backend)
            const subscription = {
                ...data,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                status: 'active'
            };

            const existingSubscriptions = JSON.parse(localStorage.getItem('csvSubscriptions') || '[]');
            localStorage.setItem('csvSubscriptions', JSON.stringify([...existingSubscriptions, subscription]));

            setIsSubscribed(true);
            toast.success('Successfully subscribed to CSV exports!');
        } catch (error) {
            toast.error('Failed to create subscription. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubscribed) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/" className="text-2xl font-bold text-primary">
                                    AI Incident Tracker
                                </Link>
                                <Badge variant="secondary">CSV Subscription</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" asChild>
                                    <Link to="/api-docs">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        API Docs
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link to="/">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl">Subscription Confirmed!</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <p className="text-muted-foreground">
                                    Thank you for subscribing to our CSV data exports. You'll receive your first export according to your selected frequency.
                                </p>
                                <div className="bg-muted p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">What happens next?</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1 text-left">
                                        <li>• You'll receive a confirmation email shortly</li>
                                        <li>• Your first data export will be sent based on your frequency preference</li>
                                        <li>• You can manage your subscription anytime by contacting support</li>
                                        <li>• All exports include the latest incident data matching your filters</li>
                                    </ul>
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Button asChild>
                                        <Link to="/">View Dashboard</Link>
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsSubscribed(false)}>
                                        Create Another Subscription
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-2xl font-bold text-primary">
                                AI Incident Tracker
                            </Link>
                            <Badge variant="secondary">CSV Subscription</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link to="/api-docs">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    API Docs
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileSpreadsheet className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">CSV Data Subscription</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get regular exports of AI incident data delivered to your inbox. Customize your subscription
                            with filters and frequency preferences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Subscription Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="w-5 h-5" />
                                        Create Subscription
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            {/* Email and Frequency */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="your@email.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="frequency"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Frequency</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select frequency" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="daily">Daily</SelectItem>
                                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Separator />

                                            {/* Categories */}
                                            <FormField
                                                control={form.control}
                                                name="categories"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>Categories</FormLabel>
                                                        <FormDescription>
                                                            Select which types of incidents to include in your export
                                                        </FormDescription>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {categories.map((category) => (
                                                                <FormField
                                                                    key={category}
                                                                    control={form.control}
                                                                    name="categories"
                                                                    render={({ field }) => {
                                                                        return (
                                                                            <FormItem
                                                                                key={category}
                                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value?.includes(category)}
                                                                                        onCheckedChange={(checked) => {
                                                                                            return checked
                                                                                                ? field.onChange([...field.value, category])
                                                                                                : field.onChange(
                                                                                                    field.value?.filter(
                                                                                                        (value) => value !== category
                                                                                                    )
                                                                                                )
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel className="text-sm font-normal">
                                                                                    {category}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                        )
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Separator />

                                            {/* Optional Filters */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <Filter className="w-4 h-4" />
                                                    Optional Filters
                                                </h4>

                                                {/* Severities */}
                                                <FormField
                                                    control={form.control}
                                                    name="severities"
                                                    render={() => (
                                                        <FormItem>
                                                            <FormLabel>Severity Levels</FormLabel>
                                                            <FormDescription>
                                                                Leave empty to include all severity levels
                                                            </FormDescription>
                                                            <div className="flex flex-wrap gap-2">
                                                                {severities.map((severity) => (
                                                                    <FormField
                                                                        key={severity}
                                                                        control={form.control}
                                                                        name="severities"
                                                                        render={({ field }) => {
                                                                            return (
                                                                                <FormItem
                                                                                    key={severity}
                                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                                >
                                                                                    <FormControl>
                                                                                        <Checkbox
                                                                                            checked={field.value?.includes(severity)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                return checked
                                                                                                    ? field.onChange([...(field.value || []), severity])
                                                                                                    : field.onChange(
                                                                                                        field.value?.filter(
                                                                                                            (value) => value !== severity
                                                                                                        )
                                                                                                    )
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormLabel className="text-sm font-normal">
                                                                                        {severity}
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            )
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Countries */}
                                                <FormField
                                                    control={form.control}
                                                    name="countries"
                                                    render={() => (
                                                        <FormItem>
                                                            <FormLabel>Countries</FormLabel>
                                                            <FormDescription>
                                                                Leave empty to include all countries
                                                            </FormDescription>
                                                            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                                                                {countries.map((country) => (
                                                                    <FormField
                                                                        key={country}
                                                                        control={form.control}
                                                                        name="countries"
                                                                        render={({ field }) => {
                                                                            return (
                                                                                <FormItem
                                                                                    key={country}
                                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                                >
                                                                                    <FormControl>
                                                                                        <Checkbox
                                                                                            checked={field.value?.includes(country)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                return checked
                                                                                                    ? field.onChange([...(field.value || []), country])
                                                                                                    : field.onChange(
                                                                                                        field.value?.filter(
                                                                                                            (value) => value !== country
                                                                                                        )
                                                                                                    )
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormLabel className="text-sm font-normal">
                                                                                        {country}
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            )
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Separator />

                                            {/* Format Options */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="format"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Export Format</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select format" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="csv">CSV</SelectItem>
                                                                    <SelectItem value="json">JSON</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="includeMetadata"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>
                                                                    Include Metadata
                                                                </FormLabel>
                                                                <FormDescription>
                                                                    Include export timestamp and filter summary
                                                                </FormDescription>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Notes */}
                                            <FormField
                                                control={form.control}
                                                name="notes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Additional Notes (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Any specific requirements or notes about your subscription..."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        Creating Subscription...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Create Subscription
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Info Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        How It Works
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Badge variant="outline" className="w-full justify-center">Step 1</Badge>
                                        <p className="text-sm">Configure your subscription preferences and filters</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Badge variant="outline" className="w-full justify-center">Step 2</Badge>
                                        <p className="text-sm">Receive confirmation email with subscription details</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Badge variant="outline" className="w-full justify-center">Step 3</Badge>
                                        <p className="text-sm">Get regular data exports based on your frequency</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>What's Included</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2">
                                        <li>• Complete incident details</li>
                                        <li>• Geographic data</li>
                                        <li>• Category classifications</li>
                                        <li>• Severity assessments</li>
                                        <li>• Source URLs and timestamps</li>
                                        <li>• Custom filtering applied</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Need Help?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Questions about subscriptions or data formats?
                                    </p>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Contact Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
