'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
    name: string;
    value: number;
    label?: string;
}

interface StatisticalChartsProps {
    data: ChartData[];
    title: string;
    description?: string;
    type: 'bar' | 'line' | 'pie';
    color?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function StatisticalChart({ data, title, description, type, color = '#3182CE' }: StatisticalChartsProps) {
    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [value?.toLocaleString(), 'Giá trị']} />
                            <Bar dataKey="value" fill={color} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [value?.toLocaleString(), 'Giá trị']} />
                            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value?.toLocaleString(), 'Số lượng']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{renderChart()}</CardContent>
        </Card>
    );
}

interface StatCardProps {
    title: string;
    value: number | string;
    description?: string;
    icon?: React.ReactNode;
    color?: string;
    formatValue?: (value: number | string) => string;
}

export function StatCard({ title, value, description, icon, formatValue }: StatCardProps) {
    const displayValue =
        typeof value === 'number' && formatValue
            ? formatValue(value)
            : typeof value === 'number'
            ? value.toLocaleString()
            : value;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    );
}

interface MetricCardProps {
    title: string;
    value: number | null;
    color: string;
    icon?: React.ReactNode;
    suffix?: string;
}

export function MetricCard({ title, value, color, icon, suffix = '' }: MetricCardProps) {
    return (
        <div className={`${color} p-6 rounded-lg text-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-2xl font-bold mt-2">
                        {value !== null ? `${value.toLocaleString()}${suffix}` : 'N/A'}
                    </p>
                </div>
                {icon && <div className="text-white/80">{icon}</div>}
            </div>
        </div>
    );
}
