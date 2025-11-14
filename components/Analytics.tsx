
import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { ANALYTICS_DATA, LINKS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsProps {
    theme: 'light' | 'dark';
}

export const Analytics: React.FC<AnalyticsProps> = ({ theme }) => {
    const topLinks = [...LINKS].sort((a,b) => b.clickCount - a.clickCount).slice(0,5);

    const isDark = theme === 'dark';
    const gridStroke = isDark ? "#374151" : "#e5e7eb";
    const axisStroke = isDark ? "#9ca3af" : "#6b7280";
    const tooltipContentStyle = { 
        backgroundColor: isDark ? '#1f2937' : '#ffffff', 
        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}` 
    };
    const tooltipLabelStyle = { color: isDark ? '#d1d5db' : '#374151' };
    const legendStyle = { color: isDark ? '#d1d5db' : '#374151' };
    const lineStrokeColor = isDark ? "#818cf8" : "#4f46e5";
    const barFillColor = isDark ? "#4f46e5" : "#6366f1";


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Visualize link usage and trends across the organization.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Total Clicks Over Time</h2>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={ANALYTICS_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="date" stroke={axisStroke} />
                <YAxis stroke={axisStroke} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Legend wrapperStyle={legendStyle} />
                <Line type="monotone" dataKey="clicks" stroke={lineStrokeColor} strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top 5 Most Clicked Links</h2>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={topLinks} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                             <XAxis type="number" stroke={axisStroke} />
                             <YAxis type="category" dataKey="title" width={150} stroke={axisStroke} tick={{ fontSize: 12 }} />
                             <Tooltip
                                contentStyle={tooltipContentStyle}
                                labelStyle={tooltipLabelStyle}
                             />
                             <Bar dataKey="clickCount" fill={barFillColor} name="Clicks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Heatmap (Placeholder)</h2>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">Time-of-day usage heatmap visualization would be here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};