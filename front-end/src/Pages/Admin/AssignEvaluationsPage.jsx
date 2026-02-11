import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const AssignEvaluationsPage = () => {
    return (
        <AdminLayout
            title="Assign Evaluations"
            subtitle="Assign evaluators to organization submissions"
        >
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    📝
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Evaluation Assignment</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    This module will allow administrators to assign specific evaluators to review organization submissions.
                </p>
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700">
                    Coming Soon
                </div>
            </div>
        </AdminLayout>
    );
};

export default AssignEvaluationsPage;
