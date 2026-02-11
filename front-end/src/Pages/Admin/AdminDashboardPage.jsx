import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalEvaluators: 0,
    pendingAssignment: 0,
    completedEvaluations: 0,
    totalPrinciples: 12,
    totalCriteria: 158,
  });


  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const evaluations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('evaluation_')) {
        try {
          evaluations.push(JSON.parse(localStorage.getItem(key)));
        } catch (e) {
          console.warn('Failed to parse evaluation:', key);
        }
      }
    }

    // Source 1: Count from persistent user registry (populated on login)
    let registryData = {};
    try {
      registryData = JSON.parse(localStorage.getItem('governance_all_users') || '{}');
    } catch (e) {
      console.warn('Failed to parse governance_all_users');
    }
    const allUsers = Object.values(registryData);
    const registryEvaluators = allUsers.filter(u => u.role === 'EVALUATOR').length;
    const registryOrgs = allUsers.filter(u => u.role === 'ORGANIZATION').length;

    // Source 2: Count from evaluation data
    const evalEvaluatorIds = new Set(
      evaluations.map(e => e.evaluatorReview?.evaluatorId).filter(Boolean)
    );
    const evalOrgIds = new Set(
      evaluations
        .map(e => e.organizationEmail || e.organizationName || e.organizationId)
        .filter(Boolean)
    );

    // Use whichever source gives the higher count
    const totalEvaluators = Math.max(registryEvaluators, evalEvaluatorIds.size);
    const totalOrganizations = Math.max(registryOrgs, evalOrgIds.size);

    // console.log('📊 Admin Dashboard Stats Debug:', { ... }); // Cleaned up for production

    setStats({
      totalOrganizations,
      totalEvaluators,
      pendingAssignment: evaluations.filter(e => e.status === 'submitted' && !e.evaluatorReview?.evaluatorId).length,
      completedEvaluations: evaluations.filter(e => e.status === 'approved').length,
      totalPrinciples: 12,
      totalCriteria: 158,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  /* Removed inline styles in favor of Tailwind classes in AdminLayout */

  const statsData = [
    { label: 'Total Organizations', value: stats.totalOrganizations, icon: '🏢', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { label: 'Total Evaluators', value: stats.totalEvaluators, icon: '👥', color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { label: 'Pending Assignment', value: stats.pendingAssignment, icon: '⏳', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { label: 'Completed Evaluations', value: stats.completedEvaluations, icon: '✅', color: 'text-emerald-500', bgColor: 'bg-emerald-100' },
    { label: 'Governance Principles', value: stats.totalPrinciples, icon: '📊', color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
    { label: 'Evaluation Criteria', value: stats.totalCriteria, icon: '📋', color: 'text-pink-500', bgColor: 'bg-pink-100' },
  ];

  return (
    <AdminLayout
      title="Administrator Dashboard"
      subtitle="Manage governance framework and monitor evaluations"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/assign-evaluations')}
          className="flex items-center justify-center gap-3 p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          <span>📝</span>
          <span>Assign Evaluations</span>
        </button>
        <button
          onClick={() => navigate('/admin/reports')}
          className="flex items-center justify-center gap-3 p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          <span>📊</span>
          <span>Generate Reports</span>
        </button>
        <button
          onClick={() => navigate('/admin/governance-framework')}
          className="flex items-center justify-center gap-3 p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          <span>⚙️</span>
          <span>Manage Framework</span>
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;