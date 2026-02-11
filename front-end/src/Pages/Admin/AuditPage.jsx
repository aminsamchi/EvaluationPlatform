import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const AuditPage = () => {
    return (
        <AdminLayout
            title="Audit History"
            subtitle="Track system activities and changes"
        >
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🔍
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Logs</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    This module will track all significant actions taken within the platform for accountability and security.
                </p>
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                    Coming Soon
                </div>
            </div>
        </AdminLayout>
    );
};

export default AuditPage;
