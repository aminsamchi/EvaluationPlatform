import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const GovernancePage = () => {
    return (
        <AdminLayout
            title="Governance Framework"
            subtitle="Manage principles, practices, and criteria"
        >
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🎯
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Framework Management</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    This module will allow you to customize the governance framework, including principles, practices, and evaluation criteria.
                </p>
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    Coming Soon
                </div>
            </div>
        </AdminLayout>
    );
};

export default GovernancePage;
