import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Settings, Map, FileText, Database, Calendar, MapPin, AlertTriangle,
    Skull, DollarSign, TrendingUp, ExternalLink, X, Search, Check,
    ChevronRight, ChevronDown, ArrowLeft, ArrowRight, MoreHorizontal
} from 'lucide-react';

const Icons = () => {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-display mb-4">Icon System</h1>
                    <p className="text-subtitle text-muted-foreground">
                        Keep AI Safe icon guidelines using Feather/Lucide icons
                    </p>
                </div>

                {/* Icon Guidelines */}
                <Card>
                    <CardHeader>
                        <CardTitle>Icon Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-3">Design Principles</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Maximum 2pt stroke width</li>
                                    <li>• Minimal and sleek designs</li>
                                    <li>• No more than 2 elements per icon</li>
                                    <li>• Use Feather/Lucide icon library</li>
                                    <li>• Keep designs thin and clean</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-3">Color Usage</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• <strong>Interface Icons:</strong> Base colors</li>
                                    <li>• <strong>Display Icons:</strong> Primary colors or gradients</li>
                                    <li>• Status icons use semantic colors</li>
                                    <li>• Consistent stroke weights</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Interface Icons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Interface Icons</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Used for UI elements, navigation, and controls. Use base colors with 1.5pt stroke.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Default Interface Icons */}
                            <div>
                                <h5 className="font-medium mb-3">Default (Muted)</h5>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <Settings className="h-6 w-6 icon-interface" />
                                        <span className="text-xs">Settings</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <Search className="h-6 w-6 icon-interface" />
                                        <span className="text-xs">Search</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <X className="h-6 w-6 icon-interface" />
                                        <span className="text-xs">Close</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <Check className="h-6 w-6 icon-interface" />
                                        <span className="text-xs">Check</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <ChevronRight className="h-6 w-6 icon-interface" />
                                        <span className="text-xs">Chevron</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Interface Icons */}
                            <div>
                                <h5 className="font-medium mb-3">Active State</h5>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <Calendar className="h-6 w-6 icon-interface-active" />
                                        <span className="text-xs">Calendar</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <MapPin className="h-6 w-6 icon-interface-active" />
                                        <span className="text-xs">Location</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <ExternalLink className="h-6 w-6 icon-interface-active" />
                                        <span className="text-xs">External</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <FileText className="h-6 w-6 icon-interface-active" />
                                        <span className="text-xs">Document</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-lg">
                                        <Database className="h-6 w-6 icon-interface-active" />
                                        <span className="text-xs">Database</span>
                                    </div>
                                </div>
                            </div>

                            {/* Primary Interface Icons */}
                            <div>
                                <h5 className="font-medium mb-3">Primary Accent</h5>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-col items-center gap-2 p-3 bg-primary/5 rounded-lg">
                                        <Calendar className="h-6 w-6 icon-interface-primary" />
                                        <span className="text-xs">Time Range</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-primary/5 rounded-lg">
                                        <AlertTriangle className="h-6 w-6 icon-interface-primary" />
                                        <span className="text-xs">Severity</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 bg-primary/5 rounded-lg">
                                        <MapPin className="h-6 w-6 icon-interface-primary" />
                                        <span className="text-xs">Categories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Display Icons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Display Icons</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Used for prominent features and branding. Can use primary colors or gradients with 2pt stroke.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Primary Display Icons */}
                            <div>
                                <h5 className="font-medium mb-3">Primary Brand</h5>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-col items-center gap-2 p-4 bg-primary/5 rounded-lg">
                                        <Map className="h-8 w-8 icon-display-primary" />
                                        <span className="text-xs">Global Map</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-4 bg-primary/5 rounded-lg">
                                        <TrendingUp className="h-8 w-8 icon-display-primary" />
                                        <span className="text-xs">Analytics</span>
                                    </div>
                                </div>
                            </div>

                            {/* Brand Color Display Icons */}
                            <div>
                                <h5 className="font-medium mb-3">Brand Colors</h5>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-col items-center gap-2 p-4 bg-gold/5 rounded-lg">
                                        <TrendingUp className="h-8 w-8 icon-display-gold" />
                                        <span className="text-xs">Gold</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-4 bg-sunrise/5 rounded-lg">
                                        <Map className="h-8 w-8 icon-display-sunrise" />
                                        <span className="text-xs">Sunrise</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-4 bg-salmon/5 rounded-lg">
                                        <AlertTriangle className="h-8 w-8 icon-display-salmon" />
                                        <span className="text-xs">Salmon</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-4 bg-fire/5 rounded-lg">
                                        <Settings className="h-8 w-8 icon-display-fire" />
                                        <span className="text-xs">Fire</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-4 bg-rose/5 rounded-lg">
                                        <FileText className="h-8 w-8 icon-display-rose" />
                                        <span className="text-xs">Rose</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Icons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Icons</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Used for indicating status, alerts, and semantic meaning. Use semantic colors with 1.5pt stroke.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col items-center gap-2 p-4 bg-death/5 rounded-lg border border-death/20">
                                <Skull className="h-8 w-8 icon-death" />
                                <span className="text-xs">Death</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-accident/5 rounded-lg border border-accident/20">
                                <AlertTriangle className="h-8 w-8 icon-accident" />
                                <span className="text-xs">Accident</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-financial/5 rounded-lg border border-financial/20">
                                <DollarSign className="h-8 w-8 icon-financial" />
                                <span className="text-xs">Financial</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Implementation Examples */}
                <Card>
                    <CardHeader>
                        <CardTitle>Implementation Examples</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h5 className="font-medium mb-3">Buttons with Icons</h5>
                            <div className="flex flex-wrap gap-3">
                                <Button>
                                    <Settings className="h-4 w-4 icon-interface mr-2" />
                                    Settings
                                </Button>
                                <Button variant="secondary">
                                    <Map className="h-4 w-4 icon-interface mr-2" />
                                    View Map
                                </Button>
                                <Button variant="outline">
                                    <ExternalLink className="h-4 w-4 icon-interface mr-2" />
                                    External Link
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-medium mb-3">Badges with Icons</h5>
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-death/10 text-death border-death/20">
                                    <Skull className="h-3 w-3 icon-death mr-1" />
                                    Critical
                                </Badge>
                                <Badge className="bg-accident/10 text-accident border-accident/20">
                                    <AlertTriangle className="h-3 w-3 icon-accident mr-1" />
                                    Warning
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                    <TrendingUp className="h-3 w-3 icon-interface-primary mr-1" />
                                    Active
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CSS Classes Reference */}
                <Card>
                    <CardHeader>
                        <CardTitle>CSS Classes Reference</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="font-medium mb-3">Interface Icons</h5>
                                <div className="space-y-2 text-sm font-mono">
                                    <div><code>.icon-interface</code> - Muted color, 1.5pt stroke</div>
                                    <div><code>.icon-interface-active</code> - Active color, 1.5pt stroke</div>
                                    <div><code>.icon-interface-primary</code> - Primary color, 1.5pt stroke</div>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium mb-3">Display Icons</h5>
                                <div className="space-y-2 text-sm font-mono">
                                    <div><code>.icon-display</code> - Default, 2pt stroke</div>
                                    <div><code>.icon-display-primary</code> - Primary color, 2pt stroke</div>
                                    <div><code>.icon-display-gold</code> - Gold color, 2pt stroke</div>
                                    <div><code>.icon-display-sunrise</code> - Sunrise color, 2pt stroke</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Back to Dashboard */}
                <div className="text-center pt-8">
                    <Button asChild size="lg">
                        <a href="/">
                            <ArrowLeft className="h-4 w-4 icon-interface mr-2" />
                            Back to Dashboard
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Icons;
