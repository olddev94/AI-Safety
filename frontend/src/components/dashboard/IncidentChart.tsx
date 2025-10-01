import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CountryIncident {
    country: string;
    count: number;
}

interface IncidentChartProps {
    incidents: CountryIncident[];
    chartType?: 'bar' | 'pie';
}

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#87d068', '#ffa726', '#ef5350', '#42a5f5',
    '#ab47bc', '#66bb6a', '#ffca28', '#ff7043', '#26c6da',
    '#9c27b0', '#4caf50', '#ff9800', '#f44336', '#2196f3',
    '#e91e63', '#8bc34a', '#ffc107', '#ff5722', '#00bcd4',
    '#673ab7', '#cddc39', '#ff6f00', '#e53935', '#1976d2'
];

export const IncidentChart = ({ incidents, chartType = 'bar' }: IncidentChartProps) => {
    // Sort and take top 19 countries, group the rest as "Others"
    const sortedIncidents = incidents.sort((a, b) => b.count - a.count);
    const top19 = sortedIncidents.slice(0, 19);
    const others = sortedIncidents.slice(19);

    // Calculate others total
    const othersTotal = others.reduce((sum, item) => sum + item.count, 0);

    // Helper function to capitalize first character of every word
    const capitalizeWords = (str: string) => {
        return str.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Create final data array
    const chartData = [
        ...top19.map(item => {
            const capitalizedCountry = capitalizeWords(item.country);
            return {
                ...item,
                country: capitalizedCountry.length > 12 ? `${capitalizedCountry.substring(0, 12)}...` : capitalizedCountry
            };
        }),
        ...(othersTotal > 0 ? [{ country: 'Others', count: othersTotal }] : [])
    ];

    if (chartType === 'pie') {
        return (
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string) => [value, 'Incidents']}
                            labelFormatter={(label: string) => `Country: ${label}`}
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '6px',
                                color: 'white'
                            }}
                            labelStyle={{ color: 'white' }}
                            itemStyle={{ color: 'white' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                        dataKey="country"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                        stroke="rgba(255, 255, 255, 0.3)"
                    />
                    <YAxis
                        tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                        stroke="rgba(255, 255, 255, 0.3)"
                    />
                    <Tooltip
                        formatter={(value: number, name: string) => [value, 'Incidents']}
                        labelFormatter={(label: string) => `Country: ${label}`}
                        contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'white'
                        }}
                    />
                    <Bar
                        dataKey="count"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
