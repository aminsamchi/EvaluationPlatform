import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES, GOVERNANCE_PRINCIPLES, MATURITY_LEVELS } from '../../utils/constants';

const EvaluationDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadEvaluation();
  }, [id]);
  
  const loadEvaluation = () => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      setEvaluation(JSON.parse(data));
    }
    setLoading(false);
  };
  
  const calculateScore = () => {
    if (!evaluation || !evaluation.responses) return 0;
    
    const responses = Object.values(evaluation.responses);
    if (responses.length === 0) return 0;
    
    const totalScore = responses.reduce((sum, response) => {
      return sum + (response.maturityLevel || 0);
    }, 0);
    
    const maxScore = responses.length * 3; // Max maturity level is 3
    return Math.round((totalScore / maxScore) * 100);
  };
  
  const getStatusColor = (status) => {
    const colors = {
      draft: '#6b7280',
      'in-progress': '#3b82f6',
      submitted: '#8b5cf6',
      'under-review': '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };
  
  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      'in-progress': 'In Progress',
      submitted: 'Submitted',
      'under-review': 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return labels[status] || 'Unknown';
  };
  
  const getGovernanceLabel = (score) => {
    if (score >= 90) return { label: 'Platinum', color: '#8b5cf6' };
    if (score >= 80) return { label: 'Gold', color: '#f59e0b' };
    if (score >= 65) return { label: 'Silver', color: '#6b7280' };
    if (score >= 50) return { label: 'Bronze', color: '#c2410c' };
    return { label: 'None', color: '#ef4444' };
  };
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate(ROUTES.LOGIN);
  };
  
  const handleSubmit = () => {
    if (!evaluation) return;
    
    const updatedEvaluation = {
      ...evaluation,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
    };
    
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEvaluation));
    setEvaluation(updatedEvaluation);
    alert('Evaluation submitted successfully!');
  };
  
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f9fafb',
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: '#2563eb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: '#f3f4f6',
      borderRadius: '8px',
    },
    logoutBtn: {
      padding: '8px 16px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    layout: {
      display: 'flex',
      maxWidth: '1280px',
      margin: '0 auto',
    },
    sidebar: {
      width: '250px',
      background: 'white',
      borderRight: '1px solid #e5e7eb',
      padding: '24px 0',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    menuItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      borderLeft: '3px solid #2563eb',
    },
    main: {
      flex: 1,
      padding: '32px 24px',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#374151',
      marginBottom: '24px',
    },
    pageTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
    },
    pageSubtitle: {
      color: '#6b7280',
      marginBottom: '32px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '8px',
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '8px',
    },
    infoCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    },
    infoLabel: {
      fontSize: '14px',
      color: '#6b7280',
    },
    infoValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '32px',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    primaryButton: {
      background: '#2563eb',
      color: 'white',
    },
    secondaryButton: {
      background: '#f3f4f6',
      color: '#374151',
    },
    responsesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    responseItem: {
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    responsePrinciple: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '4px',
    },
    responseCriterion: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '8px',
    },
    maturityBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
  };
  
  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!evaluation) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '20px', marginBottom: '16px' }}>Evaluation not found</p>
          <button 
            style={styles.backButton}
            onClick={() => navigate(ROUTES.ORG_EVALUATIONS)}
          >
            ← Back to Evaluations
          </button>
        </div>
      </div>
    );
  }
  
  const score = calculateScore();
  const governanceLabel = getGovernanceLabel(score);
  const totalResponses = Object.keys(evaluation.responses || {}).length;
  const completedResponses = Object.values(evaluation.responses || {}).filter(r => r.maturityLevel !== null).length;
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate(ROUTES.ORG_DASHBOARD)}>
            <div style={styles.logoIcon}>🛡️</div>
            <span style={styles.logoText}>Governance Platform</span>
          </div>
          
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <span>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {user.fullName || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div 
            style={styles.menuItem}
            onClick={() => navigate(ROUTES.ORG_DASHBOARD)}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </div>
          <div style={{...styles.menuItem, ...styles.menuItemActive}}>
            <span>📝</span>
            <span>Evaluations</span>
          </div>
          <div 
            style={styles.menuItem}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </div>
        </aside>
        
        {/* Main Content */}
        <main style={styles.main}>
          <button 
            style={styles.backButton}
            onClick={() => navigate(ROUTES.ORG_EVALUATIONS)}
            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.background = 'white'}
          >
            ← Back to Evaluations
          </button>
          
          <h1 style={styles.pageTitle}>{evaluation.name}</h1>
          <p style={styles.pageSubtitle}>Evaluation Details & Summary</p>
          
          {/* Stats Grid */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <p style={styles.cardTitle}>Status</p>
              <span style={{
                ...styles.statusBadge,
                background: `${getStatusColor(evaluation.status)}20`,
                color: getStatusColor(evaluation.status),
              }}>
                {getStatusLabel(evaluation.status)}
              </span>
            </div>
            
            <div style={styles.card}>
              <p style={styles.cardTitle}>Score</p>
              <p style={styles.cardValue}>{score}%</p>
            </div>
            
            <div style={styles.card}>
              <p style={styles.cardTitle}>Governance Label</p>
              <span style={{
                ...styles.statusBadge,
                background: `${governanceLabel.color}20`,
                color: governanceLabel.color,
              }}>
                {governanceLabel.label}
              </span>
            </div>
            
            <div style={styles.card}>
              <p style={styles.cardTitle}>Completion</p>
              <p style={styles.cardValue}>{completedResponses}/{totalResponses}</p>
            </div>
          </div>
          
          {/* Info Card */}
          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>Information</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Period</span>
              <span style={styles.infoValue}>{evaluation.period}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Created</span>
              <span style={styles.infoValue}>
                {new Date(evaluation.createdDate).toLocaleDateString()}
              </span>
            </div>
            {evaluation.submittedDate && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Submitted</span>
                <span style={styles.infoValue}>
                  {new Date(evaluation.submittedDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {evaluation.description && (
              <div style={{ ...styles.infoRow, borderBottom: 'none', paddingBottom: 0 }}>
                <span style={styles.infoLabel}>Description</span>
                <span style={styles.infoValue}>{evaluation.description}</span>
              </div>
            )}
          </div>
          
          {/* Responses Summary */}
          {totalResponses > 0 && (
            <div style={styles.infoCard}>
              <h3 style={styles.sectionTitle}>Responses Summary</h3>
              <div style={styles.responsesList}>
                {Object.entries(evaluation.responses || {}).slice(0, 5).map(([key, response]) => (
                  <div key={key} style={styles.responseItem}>
                    <p style={styles.responsePrinciple}>
                      Principle {response.principleId}: {GOVERNANCE_PRINCIPLES.find(p => p.id === response.principleId)?.name}
                    </p>
                    <p style={styles.responseCriterion}>{response.criterionText}</p>
                    {response.maturityLevel !== null && (
                      <span style={{
                        ...styles.maturityBadge,
                        background: `${MATURITY_LEVELS[response.maturityLevel]?.color}20`,
                        color: MATURITY_LEVELS[response.maturityLevel]?.color,
                      }}>
                        {MATURITY_LEVELS[response.maturityLevel]?.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {totalResponses > 5 && (
                <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
                  And {totalResponses - 5} more responses...
                </p>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => navigate(`/organization/evaluations/${id}/form`)}
              onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.background = '#2563eb'}
            >
              {evaluation.status === 'draft' ? 'Continue Editing' : 'View Form'}
            </button>
            
            {evaluation.status === 'draft' && completedResponses === totalResponses && totalResponses > 0 && (
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={handleSubmit}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Submit for Review
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvaluationDetailsPage;