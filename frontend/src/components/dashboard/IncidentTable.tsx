import { Incident } from '@/types/incident';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, MapPin, AlertTriangle, Skull } from 'lucide-react';
import { format } from 'date-fns';

interface IncidentTableProps {
  incidents: Incident[];
  title: string;
  maxHeight?: string;
}

export const IncidentTable = ({ incidents, title, maxHeight = "400px" }: IncidentTableProps) => {
  const getSeverityIcon = (severity: string) => {
    return severity === 'Death' ? (
      <Skull className="h-3 w-3 icon-death" />
    ) : (
      <AlertTriangle className="h-3 w-3 icon-accident" />
    );
  };

  const getSeverityBadge = (severity: string) => {
    return severity === 'Death' ? (
      <Badge variant="destructive" className="bg-death/10 text-death border-death/20">
        Death
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-accident/10 text-accident border-accident/20">
        Accident
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
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
                className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityIcon(incident.category?.split("/")[1])}
                      <h3 className="font-medium text-sm leading-tight">
                        {incident.title}
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {incident.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 icon-interface" />
                        {formatDate(incident.pubdate)}
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 icon-interface" />
                        {incident.country
                          ? incident.country[0].charAt(0).toUpperCase() + incident.country[0].slice(1)
                          : ""}
                      </div>

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

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                    >
                      <a
                        href={incident.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View original article"
                      >
                        <ExternalLink className="h-3 w-3 icon-interface" />
                      </a>
                    </Button>
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