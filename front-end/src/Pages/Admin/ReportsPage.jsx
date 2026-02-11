import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const ReportsPage = () => {
    return (
        <AdminLayout
            title="Reports & Analytics"
            subtitle="View platform statistics and performance reports"
        >
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    📊
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Reporting</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    This module will provide detailed analytics on governance maturity across all organizations.
                </p>
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                    Coming Soon
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReportsPage;
