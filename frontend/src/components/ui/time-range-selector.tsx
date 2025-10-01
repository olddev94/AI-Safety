import { useState } from 'react';
import { TimeRangePreset } from '@/types/incident';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { getDateRangeForPreset, getPresetLabel } from '@/utils/dateUtils';

interface TimeRangeSelectorProps {
    start: string;
    end: string;
    preset?: TimeRangePreset;
    onChange: (dateRange: { start: string; end: string; preset?: TimeRangePreset }) => void;
}

const presets: TimeRangePreset[] = ['MTD', 'YTD', '2024', '2023'];

export const TimeRangeSelector = ({ start, end, preset, onChange }: TimeRangeSelectorProps) => {
    const [isCustom, setIsCustom] = useState(preset === 'custom' || (!preset && (start || end)));

    const handlePresetClick = (selectedPreset: TimeRangePreset) => {
        const dateRange = getDateRangeForPreset(selectedPreset);
        onChange({ ...dateRange, preset: selectedPreset });
        setIsCustom(false);
    };

    const handleCustomClick = () => {
        setIsCustom(true);
        onChange({ start: start || '', end: end || '', preset: 'custom' });
    };

    const handleDateChange = (field: 'start' | 'end', value: string) => {
        const newRange = field === 'start' ? { start: value, end } : { start, end: value };
        onChange({ ...newRange, preset: 'custom' });
    };

    return (
        <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 icon-interface-primary" />
                    Time Range
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Preset Buttons */}
                <div className="grid grid-cols-4 gap-1">
                    {presets.map((presetOption) => (
                        <Button
                            key={presetOption}
                            variant={preset === presetOption ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePresetClick(presetOption)}
                            className="text-xs h-8"
                        >
                            {presetOption}
                        </Button>
                    ))}
                </div>

                {/* Custom Range Button */}
                <Button
                    variant={isCustom ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleCustomClick}
                    className="w-full text-xs h-8"
                >
                    Custom Range
                </Button>

                {/* Custom Date Inputs */}
                {isCustom && (
                    <div className="space-y-3 pt-2 border-t border-border/30">
                        <div>
                            <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                                From
                            </Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={start}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                                className="mt-1 text-xs h-8"
                            />
                        </div>
                        <div>
                            <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                                To
                            </Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={end}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                                className="mt-1 text-xs h-8"
                            />
                        </div>
                    </div>
                )}

                {/* Selected Range Display */}
                {preset && preset !== 'custom' && (
                    <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        {getPresetLabel(preset)}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
