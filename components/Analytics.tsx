
import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { ANALYTICS_DATA, LINKS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Analytics: React.FC = () => {
    const topLinks = [...LINKS].sort((a,b) => b.clickCount - a.clickCount).slice(0,5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-gray-400 mt-1">Visualize link usage and trends across the organization.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Total Clicks Over Time</h2>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={ANALYTICS_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                  labelStyle={{ color: '#d1d5db' }}
                />
                <Legend wrapperStyle={{ color: '#d1d5db' }} />
                <Line type="monotone" dataKey="clicks" stroke="#818cf8" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold text-white">Top 5 Most Clicked Links</h2>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={topLinks} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                             <XAxis type="number" stroke="#9ca3af" />
                             <YAxis type="category" dataKey="title" width={150} stroke="#9ca3af" tick={{ fontSize: 12 }} />
                             <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                                labelStyle={{ color: '#d1d5db' }}
                             />
                             <Bar dataKey="clickCount" fill="#4f46e5" name="Clicks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold text-white">Usage Heatmap (Placeholder)</h2>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">Time-of-day usage heatmap visualization would be here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};
