import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, ExternalLink, Key, Database, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiKeyManager } from '@/components/api/ApiKeyManager';

export default function ApiDocs() {
    const [selectedEndpoint, setSelectedEndpoint] = useState('statistics');

    const baseUrl = `http://${window.location.hostname}:8800`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const endpoints = [
        {
            id: 'statistics',
            method: 'POST',
            path: '/articles/statistics',
            title: 'Get Article Statistics',
            description: 'Retrieve statistics and filtered incident data',
            requestBody: {
                filters: {
                    categories: ['string[]'],
                    severities: ['string[]'],
                    countries: ['string[]'],
                    dateRange: {
                        start: 'string (YYYY-MM-DD)',
                        end: 'string (YYYY-MM-DD)',
                        preset: 'string'
                    }
                }
            },
            response: {
                stats: {
                    total_incidents: 'number',
                    total_deaths: 'number',
                    total_accidents: 'number',
                    today_incidents: 'number'
                },
                counts: [{ country: 'string', count: 'number' }],
                articles: 'Article[]',
                last_update_time: 'string',
                category_counts: 'object',
                severity_counts: 'object'
            }
        },
        {
            id: 'manual-source',
            method: 'POST',
            path: '/sources/manual',
            title: 'Submit Manual Report',
            description: 'Submit a new incident report manually',
            requestBody: {
                title: 'string',
                description: 'string',
                url: 'string',
                severity: 'string',
                date: 'string (YYYY-MM-DD)',
                country: ['string[]'],
                category: 'string'
            },
            response: {
                message: 'string',
                id: 'number'
            }
        },
        {
            id: 'admin-reports',
            method: 'GET',
            path: '/admin/reports',
            title: 'Get Admin Reports',
            description: 'Retrieve all manual reports for admin review',
            requestBody: null,
            response: [
                {
                    id: 'number',
                    title: 'string',
                    description: 'string',
                    url: 'string',
                    severity: 'string',
                    date: 'string',
                    country: 'string[]',
                    category: 'string',
                    created_at: 'string',
                    manual: 'boolean',
                    status: 'string'
                }
            ]
        }
    ];

    const currentEndpoint = endpoints.find(e => e.id === selectedEndpoint);

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
                            <Badge variant="secondary">Public API</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link to="/csv-subscription">
                                    <Download className="w-4 h-4 mr-2" />
                                    CSV Subscription
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5" />
                                    API Endpoints
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={selectedEndpoint === 'api-keys' ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedEndpoint('api-keys')}
                                >
                                    <Key className="w-4 h-4 mr-2" />
                                    API Keys
                                </Button>
                                <Separator className="my-2" />
                                {endpoints.map((endpoint) => (
                                    <Button
                                        key={endpoint.id}
                                        variant={selectedEndpoint === endpoint.id ? "default" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setSelectedEndpoint(endpoint.id)}
                                    >
                                        <Badge
                                            variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                                            className="mr-2 text-xs"
                                        >
                                            {endpoint.method}
                                        </Badge>
                                        {endpoint.title}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="w-5 h-5" />
                                    Quick Start
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Base URL:</p>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-muted p-2 rounded text-xs flex-1">{baseUrl}</code>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(baseUrl)}
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Content-Type:</p>
                                    <code className="bg-muted p-2 rounded text-xs block">application/json</code>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {selectedEndpoint === 'api-keys' ? (
                            <ApiKeyManager />
                        ) : currentEndpoint && (
                            <div className="space-y-6">
                                {/* Endpoint Header */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={currentEndpoint.method === 'GET' ? 'secondary' : 'default'}>
                                                {currentEndpoint.method}
                                            </Badge>
                                            <CardTitle className="text-xl">{currentEndpoint.title}</CardTitle>
                                        </div>
                                        <p className="text-muted-foreground">{currentEndpoint.description}</p>
                                        <div className="flex items-center gap-2 mt-4">
                                            <code className="bg-muted p-2 rounded flex-1">{baseUrl}{currentEndpoint.path}</code>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(`${baseUrl}${currentEndpoint.path}`)}
                                            >
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                </Card>

                                {/* Request/Response Details */}
                                <Tabs defaultValue="request" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="request">Request</TabsTrigger>
                                        <TabsTrigger value="response">Response</TabsTrigger>
                                        <TabsTrigger value="example">Example</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="request" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Request Body</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {currentEndpoint.requestBody ? (
                                                    <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                                                        {JSON.stringify(currentEndpoint.requestBody, null, 2)}
                                                    </pre>
                                                ) : (
                                                    <p className="text-muted-foreground">No request body required</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="response" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Response Schema</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                                                    {JSON.stringify(currentEndpoint.response, null, 2)}
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="example" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>cURL Example</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                                                        {currentEndpoint.method === 'GET'
                                                            ? `curl -X GET "${baseUrl}${currentEndpoint.path}" \\
  -H "Content-Type: application/json"`
                                                            : `curl -X ${currentEndpoint.method} "${baseUrl}${currentEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(currentEndpoint.requestBody, null, 2)}'`
                                                        }
                                                    </pre>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => copyToClipboard(
                                                            currentEndpoint.method === 'GET'
                                                                ? `curl -X GET "${baseUrl}${currentEndpoint.path}" -H "Content-Type: application/json"`
                                                                : `curl -X ${currentEndpoint.method} "${baseUrl}${currentEndpoint.path}" -H "Content-Type: application/json" -d '${JSON.stringify(currentEndpoint.requestBody)}'`
                                                        )}
                                                    >
                                                        <Copy className="w-3 h-3 mr-2" />
                                                        Copy cURL
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>JavaScript Example</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                                                    {currentEndpoint.method === 'GET'
                                                        ? `fetch('${baseUrl}${currentEndpoint.path}', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
                                                        : `fetch('${baseUrl}${currentEndpoint.path}', {
  method: '${currentEndpoint.method}',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${JSON.stringify(currentEndpoint.requestBody, null, 2)})
})
.then(response => response.json())
.then(data => console.log(data));`
                                                    }
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>

                    {/* Additional Information */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Rate Limiting</h4>
                                <p className="text-sm text-muted-foreground">
                                    Currently, there are no rate limits applied to the API. However, please use the API responsibly and avoid excessive requests.
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Error Handling</h4>
                                <p className="text-sm text-muted-foreground">
                                    The API returns standard HTTP status codes. Error responses include a "detail" field with more information about the error.
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">CORS</h4>
                                <p className="text-sm text-muted-foreground">
                                    Cross-Origin Resource Sharing (CORS) is enabled for all origins. You can make requests from any domain.
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Data Updates</h4>
                                <p className="text-sm text-muted-foreground">
                                    The incident data is updated regularly through automated scraping. The last update time is included in the statistics response.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
