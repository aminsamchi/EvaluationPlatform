import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/auth/LoginPage';
import RegisterPage from './Pages/auth/RegisterPage';

// Organization Pages
import DashboardPage from './Pages/Organization/DashboardPage';
import EvaluationsListPage from './Pages/Organization/EvaluationsListPage';
import NewEvaluationPage from './Pages/Organization/NewEvaluationPage';
import EvaluationFormPage from './Pages/Organization/EvaluationFormPage';
import EvaluationDetailsPage from './Pages/Organization/EvaluationDetailsPage';
import ResultsPage from './Pages/Organization/ResultsPage';

// Evaluator Pages
import EvalDashboardPage from './Pages/Evaluator/DashboardPage';
import EvaluationAnalysisPage from './Pages/Evaluator/EvaluationAnalysisPage';
import EvidenceVerificationPage from './Pages/Evaluator/EvidenceVerificationPage';
import ScoreAdjustmentPage from './Pages/Evaluator/ScoreAdjustmentPage';
import ReviewEvaluationPage from './Pages/Evaluator/ReviewEvaluationPage';

// Admin Pages
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage';
import AssignEvaluationsPage from './Pages/Admin/AssignEvaluationsPage';
import ReportsPage from './Pages/Admin/ReportsPage';
import GovernancePage from './Pages/Admin/GovernancePage';
import AuditPage from './Pages/Admin/AuditPage';

import { ROUTES, STORAGE_KEYS, USER_ROLES } from './utils/constants';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);

  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to={ROUTES.LOGIN} replace />;
      }
    } catch (error) {
      console.error('Error parsing user:', error);
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Organization Routes */}
        <Route
          path={ROUTES.ORG_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZATION]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORG_EVALUATIONS}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZATION]}>
              <EvaluationsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORG_EVALUATION_NEW}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZATION]}>
              <NewEvaluationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/evaluations/:id/form"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZATION]}>
              <EvaluationFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/evaluations/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZATION]}>
              <EvaluationDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORG_RESULTS}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZATION]}>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Evaluator Routes */}
        <Route
          path={ROUTES.EVAL_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EVALUATOR]}>
              <EvalDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluator/analysis/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EVALUATOR]}>
              <EvaluationAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluator/evidence/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EVALUATOR]}>
              <EvidenceVerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluator/adjustment/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EVALUATOR]}>
              <ScoreAdjustmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluator/review/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EVALUATOR]}>
              <ReviewEvaluationPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMINISTRATOR]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assign-evaluations"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMINISTRATOR]}>
              <AssignEvaluationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMINISTRATOR]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/governance-framework"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMINISTRATOR]}>
              <GovernancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMINISTRATOR]}>
              <AuditPage />
            </ProtectedRoute>
          }
        />

        {/* Default & fallback */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
