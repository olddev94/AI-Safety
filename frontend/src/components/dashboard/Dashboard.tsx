import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FilterState, DashboardStats } from '@/types/incident';
import { GlobalStats } from './GlobalStats';
import { FilterSidebar } from './FilterSidebar';
import { IncidentMap } from './IncidentMap';
import { IncidentChart } from './IncidentChart';
import { IncidentTable } from './IncidentTable';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Database, Map, BarChart3, AlertTriangle, Shield, Code, Download } from 'lucide-react';
import axios from 'axios';
import { authService } from '@/services/authService';

export const Dashboard = () => {
  const user = authService.getUser();
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    severities: [],
    countries: [],
    dateRange: { start: '', end: '', preset: undefined }
  });

  const [data, setData] = useState<{
    stats?: DashboardStats;
    counts?: Array<{ country: string; count: number }>;
    last_update_time?: string;
    articles?: Array<any>;
  }>({})

  const [viewMode, setViewMode] = useState<'map' | 'chart'>('map')
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

  useEffect(() => {
    console.log("##########")
    console.log(filters)
    axios.post(`http://${window.location.hostname}:8800/articles/statistics`, {
      filters: filters
    }).then(res => {
      setData(res.data)
    }).catch(err => {
      console.log(err)
    })
  }, [filters])

  console.log("@@@@@@", data)
  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.severities.length > 0) count++;
    if (filters.countries.length > 0) count++;
    if (filters.dateRange.preset || filters.dateRange.start || filters.dateRange.end) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI Incident Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Monitoring AI-related incidents and their impact globally
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <div className="text-sm text-muted-foreground mr-2">
                  {user.name}
                </div>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link to="/api-docs" title="API Documentation">
                  <Code className="h-4 w-4 mr-2" />
                  API Docs
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/csv-subscription" title="CSV Data Subscription">
                  <Download className="h-4 w-4 mr-2" />
                  CSV Export
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                <Link to="/self-report" title="Report an AI Incident">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Incident
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin" title="Admin Panel">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Global Statistics */}
        <GlobalStats stats={data.stats} />

        <div className="grid grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="bg-card/80 border-border/50 sticky top-4">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                activeFiltersCount={activeFiltersCount}
                data={data}
              />
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Map/Chart Toggle */}
            <Card className="bg-card/80 border-border/50">
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {viewMode === 'map' ? (
                      <Map className="h-5 w-5 icon-display-primary" />
                    ) : (
                      <BarChart3 className="h-5 w-5 icon-display-primary" />
                    )}
                    {viewMode === 'map' ? 'Global Incident Map' : 'Incident Analytics'}
                  </h2>
                  <div className="flex items-center gap-2">
                    {viewMode === 'chart' && (
                      <div className="flex items-center gap-1 mr-2">
                        <Button
                          variant={chartType === 'bar' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setChartType('bar')}
                        >
                          Bar
                        </Button>
                        <Button
                          variant={chartType === 'pie' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setChartType('pie')}
                        >
                          Pie
                        </Button>
                      </div>
                    )}
                    <Button
                      variant={viewMode === 'map' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('map')}
                    >
                      <Map className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                    <Button
                      variant={viewMode === 'chart' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('chart')}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Chart
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-96">
                {viewMode === 'map' ? (
                  <IncidentMap incidents={data.counts || []} />
                ) : (
                  <IncidentChart incidents={data.counts || []} chartType={chartType} />
                )}
              </div>
            </Card>

            <IncidentTable
              incidents={data.articles || []}
              title="AI Incident Reports"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer lastUpdated={data.last_update_time} />

      {/* Selected Incident Details */}
      {/* {selectedIncident && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-card border-border/50">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {selectedIncident.severity === 'Fatality' ? (
                    <div className="w-3 h-3 bg-death rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-accident rounded-full"></div>
                  )}
                  <Badge variant={selectedIncident.severity === 'Fatality' ? 'destructive' : 'secondary'}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIncident(null)}
                >
                  ×
                </Button>
              </div>

              <h2 className="text-xl font-bold mb-2">{selectedIncident.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedIncident.description}</p>

              <div className="space-y-2 text-sm">
                <div><strong>Country:</strong> {Array.isArray(selectedIncident.country) ? selectedIncident.country.join(', ') : selectedIncident.country}</div>
                <div><strong>Category:</strong> {selectedIncident.category}</div>
                <div><strong>Date:</strong> {new Date(selectedIncident.pubDate).toLocaleDateString()}</div>
                {selectedIncident.casualties && (
                  <div><strong>Casualties:</strong> {selectedIncident.casualties}</div>
                )}
                {selectedIncident.financialLoss && (
                  <div><strong>Financial Loss:</strong> ${selectedIncident.financialLoss.toLocaleString()}</div>
                )}
              </div>

              <div className="mt-6">
                <Button asChild>
                  <a href={selectedIncident.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )} */}
    </div>
  );
};