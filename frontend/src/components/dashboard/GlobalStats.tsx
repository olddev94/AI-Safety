import { DashboardStats } from '@/types/incident';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, Skull, DollarSign } from 'lucide-react';


export const GlobalStats = ({ stats }) => {
  const formatNumber = (num: number) => {
    if (num == undefined) return 0;
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-card/80 border-death/30 hover:border-death/50 transition-colors shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Fatalities</CardTitle>
          <AlertTriangle className="h-4 w-4 icon-accident" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-death">{stats?.total_deaths || 0}</div>
          <p className="text-xs text-muted-foreground">Critical incidents</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 border-accident/30 hover:border-accident/50 transition-colors shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Accidents</CardTitle>
          <AlertTriangle className="h-4 w-4 icon-accident" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accident">{stats?.total_accidents || 0}</div>
          <p className="text-xs text-muted-foreground">Non-fatal incidents</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 border-accident/30 hover:border-primary/50 transition-colors shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Incidents</CardTitle>
          <TrendingUp className="h-4 w-4 icon-accident" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accident">{stats?.total_incidents || 0}</div>
          <p className="text-xs text-muted-foreground">All reported cases</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 border-accident/30 hover:border-primary/50 transition-colors shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today Incidents</CardTitle>
          <TrendingUp className="h-4 w-4 icon-accident" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accident">{formatNumber(stats?.today_incidents)}</div>
          <p className="text-xs text-muted-foreground">Today reported cases</p>
        </CardContent>
      </Card>
    </div>
  );
};