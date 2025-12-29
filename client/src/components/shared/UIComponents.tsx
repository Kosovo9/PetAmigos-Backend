'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow border p-6 ${className}`}>
            {children}
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: string;
    trend?: 'up' | 'down';
}

export function MetricCard({ title, value, icon, change, trend }: MetricCardProps) {
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    {icon}
                </div>
                {change && (
                    <span className={`text-sm px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {change}
                    </span>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-gray-600 text-sm">{title}</p>
        </Card>
    );
}

interface TabsProps {
    tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
    activeTab: string;
    onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="flex flex-wrap gap-2 border-b pb-4 mb-6">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className="flex items-center justify-center py-8">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
        </div>
    );
}
