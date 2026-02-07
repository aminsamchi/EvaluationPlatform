import React from 'react';
import { MainLayout } from '../../components/layout';
import { Card } from '../../components/common';
import { FileText, TrendingUp, AlertCircle, Award } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { label: 'Active Evaluations', value: '3', icon: FileText, color: 'blue' },
    { label: 'Completed', value: '12', icon: TrendingUp, color: 'green' },
    { label: 'Pending Review', value: '2', icon: AlertCircle, color: 'yellow' },
    { label: 'Score', value: '85', icon: Award, color: 'purple' },
  ];
  
  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome to your governance dashboard</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const bgColors = {
              blue: 'bg-blue-100',
              green: 'bg-green-100',
              yellow: 'bg-yellow-100',
              purple: 'bg-purple-100',
            };
            const textColors = {
              blue: 'text-blue-600',
              green: 'text-green-600',
              yellow: 'text-yellow-600',
              purple: 'text-purple-600',
            };
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${bgColors[stat.color]} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className={textColors[stat.color]} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;