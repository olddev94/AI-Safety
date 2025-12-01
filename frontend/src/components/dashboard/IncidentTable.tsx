import { Incident } from '@/types/incident';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface IncidentTableProps {
  incidents: Incident[];
  title: string;
  maxHeight?: string;
}

export const IncidentTable = ({ incidents, title, maxHeight = "400px" }: IncidentTableProps) => {
  const navigate = useNavigate();
  
  const getSeverityIcon = (severity: string) => {
    return severity === 'Fatality' ? (
      <AlertTriangle className="h-3 w-3 icon-death" />
    ) : (
      <AlertTriangle className="h-3 w-3 icon-accident" />
    );
  };

  const getSeverityBadge = (severity: string) => {
    return severity === 'Fatality' ? (
      <Badge variant="destructive" className="bg-death/10 text-death border-death/20">
        Fatality
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-accident/10 text-accident border-accident/20">
        Accident
      </Badge>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown date';
      return format(date, 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  const getCategory = (category: string) => {
    return category.split('/')[0];
  };

  return (
    <Card className="bg-card/50 border-border/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {title}
          {/* <Badge variant="secondary" className="ml-auto">
            {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
          </Badge> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" style={{ maxHeight, overflowY: 'auto' }}>
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 opacity-50 icon-interface" />
              <p>No incidents found matching your filters</p>
            </div>
          ) : (
            incidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-border/50 rounded-lg p-4 md:hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/news/${String(incident.id)}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  {incident.image_url && (
                    <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden border border-border/50">
                      <img
                        src={incident.image_url}
                        alt={incident.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground mr-1">#{incident.id}</span>
                      {getSeverityIcon(incident.category?.split("/")[1])}
                      <h3 className="font-medium text-sm leading-tight md:hover:text-primary transition-colors">
                        {incident.title}
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {incident.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 icon-interface" />
                        {formatDate(incident.pubDate || (incident as any).pubdate)}
                      </div>

                      {incident.country && incident.country.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 icon-interface" />
                          {incident.country[0].charAt(0).toUpperCase() + incident.country[0].slice(1)}
                        </div>
                      )}

                      {incident.financialLoss && (
                        <span className="text-financial">
                          ${(incident.financialLoss / 1000000).toFixed(1)}M loss
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {getSeverityBadge(incident.category?.split("/")[1])}
                      <Badge variant="outline" className="text-xs">
                        {getCategory(incident.category)}
                      </Badge>
                    </div>
                  </div>

                  <div 
                    className="flex flex-col gap-2" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/news/${String(incident.id)}`, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <button
                      title="View article details"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-primary md:hover:text-primary/80 md:hover:bg-accent transition-colors cursor-pointer border border-border/50"
                    >
                      <ExternalLink className="h-3 w-3 icon-interface" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};