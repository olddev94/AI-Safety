import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Typography = () => {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-display mb-4">Typography System</h1>
                    <p className="text-subtitle text-muted-foreground">
                        Showcasing Aleo (Primary) and Sweet Sans Pro (Secondary) typefaces
                    </p>
                </div>

                {/* Font Families */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-primary">Primary Typeface - Aleo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="font-primary">
                                <p className="text-sm text-muted-foreground mb-2">Font Family: Aleo (Serif)</p>
                                <p className="text-lg">Used for headings, titles, and emphasis</p>
                                <div className="mt-4 space-y-2">
                                    <p className="font-light">Light Weight - 300</p>
                                    <p className="font-normal">Regular Weight - 400</p>
                                    <p className="font-medium">Medium Weight - 500</p>
                                    <p className="font-semibold">Semibold Weight - 600</p>
                                    <p className="font-bold">Bold Weight - 700</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-secondary">Secondary Typeface - Sweet Sans Pro</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="font-secondary">
                                <p className="text-sm text-muted-foreground mb-2">Font Family: Sweet Sans Pro (Sans-serif)</p>
                                <p className="text-lg">Used for body text, UI elements, and navigation</p>
                                <div className="mt-4 space-y-2">
                                    <p className="font-light">Light Weight - 300</p>
                                    <p className="font-normal">Regular Weight - 400</p>
                                    <p className="font-medium">Medium Weight - 500</p>
                                    <p className="font-semibold">Semibold Weight - 600</p>
                                    <p className="font-bold">Bold Weight - 700</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Brand Color Header Mapping */}
                <Card>
                    <CardHeader>
                        <CardTitle>Header Color Mapping - Brand Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-gold rounded"></div>
                                    <span className="font-medium">H1 → Gold (#FFD836)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-sunrise rounded"></div>
                                    <span className="font-medium">H2 → Sunrise (#FFAD40)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-salmon rounded"></div>
                                    <span className="font-medium">H3 → Salmon (#F47C6C)</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-fire rounded"></div>
                                    <span className="font-medium">H4 → Fire (#F25C51)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-rose rounded"></div>
                                    <span className="font-medium">H5 → Rose (#E879A3)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-foreground rounded"></div>
                                    <span className="font-medium">H6 → Default</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Header Styles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Header Styles - Typography & Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h1 className="mb-2">H1 Heading - Display Text</h1>
                            <p className="text-sm text-muted-foreground">Aleo, Bold, Gold Color, 4xl-5xl</p>
                        </div>

                        <div>
                            <h2 className="mb-2">H2 Heading - Hero Text</h2>
                            <p className="text-sm text-muted-foreground">Aleo, Regular, Sunrise Color, 3xl-4xl</p>
                        </div>

                        <div>
                            <h3 className="mb-2">H3 Heading - Section Title</h3>
                            <p className="text-sm text-muted-foreground">Sweet Sans Pro, Bold, All Caps, Salmon Color, 2xl-3xl</p>
                        </div>

                        <div>
                            <h4 className="mb-2">H4 Heading - Subsection</h4>
                            <p className="text-sm text-muted-foreground">Sweet Sans Pro, Bold, Fire Color, xl-2xl</p>
                        </div>

                        <div>
                            <h5 className="mb-2">H5 Heading - Component Title</h5>
                            <p className="text-sm text-muted-foreground">Sweet Sans Pro, Italic, Rose Color, lg-xl</p>
                        </div>

                        <div>
                            <h6 className="mb-2">H6 Heading - Small Title</h6>
                            <p className="text-sm text-muted-foreground">Sweet Sans Pro, Medium, All Caps, base-lg</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Special Typography Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Special Typography Classes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="text-display mb-2">Display Text</p>
                            <p className="text-sm text-muted-foreground">.text-display - Aleo, Bold, 5xl-6xl</p>
                        </div>

                        <div>
                            <p className="text-hero mb-2">Hero Text</p>
                            <p className="text-sm text-muted-foreground">.text-hero - Aleo, Bold, 4xl-5xl</p>
                        </div>

                        <div>
                            <p className="text-subtitle mb-2">Subtitle Text</p>
                            <p className="text-sm text-muted-foreground">.text-subtitle - Sweet Sans Pro, Medium, lg-xl</p>
                        </div>

                        <div>
                            <p className="text-body mb-2">Body Text - This is the standard paragraph text used throughout the application.</p>
                            <p className="text-sm text-muted-foreground">.text-body - Sweet Sans Pro, Regular, base</p>
                        </div>

                        <div>
                            <p className="text-caption mb-2">Caption Text</p>
                            <p className="text-sm text-muted-foreground">.text-caption - Sweet Sans Pro, Regular, sm</p>
                        </div>

                        <div>
                            <p className="text-overline mb-2">OVERLINE TEXT</p>
                            <p className="text-sm text-muted-foreground">.text-overline - Sweet Sans Pro, Semibold, xs, uppercase</p>
                        </div>
                    </CardContent>
                </Card>

                {/* UI Components */}
                <Card>
                    <CardHeader>
                        <CardTitle>UI Components Typography</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-3">Buttons</p>
                            <div className="flex flex-wrap gap-3">
                                <Button>Primary Button</Button>
                                <Button variant="secondary">Secondary Button</Button>
                                <Button variant="outline">Outline Button</Button>
                                <Button variant="ghost">Ghost Button</Button>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-3">Badges</p>
                            <div className="flex flex-wrap gap-3">
                                <Badge>Default Badge</Badge>
                                <Badge variant="secondary">Secondary Badge</Badge>
                                <Badge variant="outline">Outline Badge</Badge>
                                <Badge variant="destructive">Destructive Badge</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Back to Dashboard */}
                <div className="text-center pt-8">
                    <Button asChild size="lg">
                        <a href="/">
                            Back to Dashboard
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Typography;
