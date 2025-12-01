import { FilterState } from '@/types/incident';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TimeRangeSelector } from '@/components/ui/time-range-selector';
import { X, MapPin, AlertTriangle } from 'lucide-react';
import { categories, countries } from '@/data/mockIncidents';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount: number;
}

export const FilterSidebar = ({ filters, onFiltersChange, activeFiltersCount, data }: FilterSidebarProps) => {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);

    onFiltersChange({ ...filters, categories: updatedCategories });
  };

  const handleSeverityChange = (severity: 'Fatality' | 'Accident', checked: boolean) => {
    const updatedSeverities = checked
      ? [...filters.severities, severity]
      : filters.severities.filter(s => s !== severity);

    onFiltersChange({ ...filters, severities: updatedSeverities });
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    const updatedCountries = checked
      ? [...filters.countries, country]
      : filters.countries.filter(c => c !== country);

    onFiltersChange({ ...filters, countries: updatedCountries });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      severities: [],
      countries: [],
      dateRange: { start: '', end: '', preset: undefined }
    });
  };

  const getDisplayCategory = (category: string) => {
    const parts = category.split('/');
    return parts[0];
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
            <X className="ml-1 h-3 w-3 icon-interface" />
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
        </Badge>
      )}

      {/* Time Range */}
      <TimeRangeSelector
        start={filters.dateRange.start}
        end={filters.dateRange.end}
        preset={filters.dateRange.preset}
        onChange={(dateRange) => onFiltersChange({
          ...filters,
          dateRange
        })}
      />

      {/* Severity */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 icon-interface-primary" />
            Severity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(['Fatality', 'Accident'] as const).map((severity) => (
            <div key={severity} className="flex items-center space-x-2">
              <Checkbox
                id={severity}
                checked={filters.severities.includes(severity)}
                onCheckedChange={(checked) => handleSeverityChange(severity, checked as boolean)}
              />
              <Label
                htmlFor={severity}
                className={`text-sm cursor-pointer text-foreground`}
              >
                {severity} {data && data.severity_counts && `(${data.severity_counts[0][severity.toLowerCase()]})`}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 icon-interface-primary" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 overflow-y-auto">
          {Array.from(new Set(categories.filter(c => c !== 'N/A').map(getDisplayCategory))).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories.some(c => c.startsWith(category))}
                onCheckedChange={(checked) => {
                  const relatedCategories = categories.filter(c => c.startsWith(category));
                  relatedCategories.forEach(cat => handleCategoryChange(cat, checked as boolean));
                }}
              />
              <Label htmlFor={category} className="text-sm cursor-pointer text-foreground">
                {category} {data && data.category_counts && data.category_counts.filter(_category => _category.base_category == category).length == 1 && `(${data.category_counts.filter(_category => _category.base_category == category)[0].article_count})`}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Countries */}
      {/* <Card className="bg-card/50 border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 icon-interface-primary" />
            Countries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {countries.slice(0, 8).map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <Checkbox
                id={country}
                checked={filters.countries.includes(country)}
                onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
              />
              <Label htmlFor={country} className="text-xs cursor-pointer text-foreground">
                {country}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card> */}
    </div>
  );
};