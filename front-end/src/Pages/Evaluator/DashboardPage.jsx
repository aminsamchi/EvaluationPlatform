import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

const EvaluatorDashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  const [evaluations, setEvaluations] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
  });
  const [filter, setFilter] = useState('all'); // all, pending, reviewed, approved, rejected
  const [activeMenu, setActiveMenu] = useState('dashboard'); // dashboard, reviews
  const [sortMode, setSortMode] = useState('date'); // date, status

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = () => {
    const allEvals = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('evaluation_')) {
        const evalData = JSON.parse(localStorage.getItem(key));
        if (['submitted', 'under-review', 'approved', 'rejected', 'conditional'].includes(evalData.status)) {
          allEvals.push(evalData);
        }
      }
    }
    
    allEvals.sort((a, b) => new Date(b.submittedDate || b.createdDate) - new Date(a.submittedDate || a.createdDate));
    setEvaluations(allEvals);

    setStats({
      pending: allEvals.filter(e => e.status === 'submitted' || e.status === 'under-review').length,
      reviewed: allEvals.filter(e => e.status === 'approved' || e.status === 'rejected' || e.status === 'conditional').length,
      approved: allEvals.filter(e => e.status === 'approved').length,
      rejected: allEvals.filter(e => e.status === 'rejected').length,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const getFilteredEvaluations = () => {
    let list = evaluations;
    if (filter === 'pending') list = evaluations.filter(e => e.status === 'submitted' || e.status === 'under-review');
    else if (filter === 'reviewed') list = evaluations.filter(e => e.status === 'approved' || e.status === 'rejected' || e.status === 'conditional');
    else if (filter === 'approved') list = evaluations.filter(e => e.status === 'approved');
    else if (filter === 'rejected') list = evaluations.filter(e => e.status === 'rejected');

    const sorted = [...list];
    if (sortMode === 'status') {
      sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
    }
    // default "date" keeps loadEvaluations order (most recent first)
    return sorted;
  };

  const filteredEvaluations = getFilteredEvaluations();

  const getStatusColor = (status) => {
    const colors = {
      submitted: '#8b5cf6',
      'under-review': '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
      conditional: '#3b82f6',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      submitted: 'Pending Review',
      'under-review': 'In Progress',
      approved: 'Approved',
      rejected: 'Rejected',
      conditional: 'Conditional',
    };
    return labels[status] || status;
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
      minHeight: 'calc(100vh - 64px)',
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
      transition: 'background 0.2s',
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    statCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.2s',
      cursor: 'pointer',
    },
    statContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px',
    },
    statValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
    },
    filterTabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
    },
    filterTab: {
      padding: '10px 20px',
      background: '#f3f4f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      transition: 'all 0.2s',
    },
    filterTabActive: {
      background: '#2563eb',
      color: 'white',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px',
    },
    cardMeta: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '12px',
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
    cardActions: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
    },
    actionButton: {
      flex: 1,
      padding: '10px 16px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
  };

  const statsData = [
    { label: 'Pending Review', value: stats.pending, icon: '⏳', color: '#f59e0b', bgColor: '#fef3c7', filterKey: 'pending' },
    { label: 'Total Reviewed', value: stats.reviewed, icon: '📋', color: '#3b82f6', bgColor: '#dbeafe', filterKey: 'reviewed' },
    { label: 'Approved', value: stats.approved, icon: '✅', color: '#10b981', bgColor: '#d1fae5', filterKey: 'approved' },
    { label: 'Rejected', value: stats.rejected, icon: '❌', color: '#ef4444', bgColor: '#fee2e2', filterKey: 'rejected' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/evaluator/dashboard')}>
            <div style={styles.logoIcon}>🛡️</div>
            <span style={styles.logoText}>Governance Platform</span>
          </div>

          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <span>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {user.fullName || user.email}
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
            style={{
              ...styles.menuItem,
              ...(activeMenu === 'dashboard' ? styles.menuItemActive : {}),
            }}
            onClick={() => {
              setActiveMenu('dashboard');
              setFilter('all');
            }}
          >
            <span>📊</span>
            <span>Pending Reviews</span>
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(activeMenu === 'reviews' ? styles.menuItemActive : {}),
            }}
            onClick={() => {
              setActiveMenu('reviews');
              setFilter('reviewed');
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = activeMenu === 'reviews' ? '#eff6ff' : '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = activeMenu === 'reviews' ? '#eff6ff' : 'transparent'}
          >
            <span>✅</span>
            <span>My Evaluations</span>
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Evaluator Dashboard</h1>
          <p style={styles.pageSubtitle}>
            {activeMenu === 'dashboard' ? 'Work through your pending reviews' : 'Browse and analyze all your evaluations'}
          </p>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <div
                key={index}
                style={styles.statCard}
                onClick={() => {
                  if (stat.filterKey === 'pending') {
                    setActiveMenu('dashboard');
                    setFilter('pending');
                  } else {
                    setActiveMenu('reviews');
                    setFilter(stat.filterKey);
                  }
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
              >
                <div style={styles.statContent}>
                  <div style={styles.statInfo}>
                    <p style={styles.statLabel}>{stat.label}</p>
                    <p style={styles.statValue}>{stat.value}</p>
                  </div>
                  <div style={{ ...styles.statIcon, background: stat.bgColor }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main content switches between pending list and full evaluations view */}
          {activeMenu === 'dashboard' ? (
            // Pending reviews list view
            (() => {
              const pending = evaluations.filter(e => e.status === 'submitted' || e.status === 'under-review');
              if (pending.length === 0) {
                return (
                  <div style={styles.emptyState}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                    <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No pending reviews</p>
                    <p style={{ color: '#6b7280' }}>You have no evaluations waiting for review.</p>
                  </div>
                );
              }
              return (
                <div style={{ marginTop: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Pending Reviews</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{pending.length} evaluation(s)</span>
                  </div>
                  <div>
                    {pending.map((evaluation) => (
                      <div
                        key={evaluation.id}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid #f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                            {evaluation.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            {evaluation.organizationName || 'Unknown Organization'} • Period: {evaluation.period}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', minWidth: '120px' }}>
                          Submitted: {new Date(evaluation.submittedDate || evaluation.createdDate).toLocaleDateString()}
                        </div>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background: `${getStatusColor(evaluation.status)}20`,
                            color: getStatusColor(evaluation.status),
                            minWidth: '110px',
                            textAlign: 'center',
                          }}
                        >
                          {getStatusLabel(evaluation.status)}
                        </span>
                        <button
                          style={{ ...styles.actionButton, flex: '0 0 auto', padding: '8px 16px' }}
                          onClick={() => navigate(`/evaluator/adjustment/${evaluation.id}`)}
                          onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                          onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                        >
                          {evaluation.status === 'submitted' ? 'Start Review' : 'Continue Review'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            // My evaluations view with filters and sorting
            <>
              {/* Filter Tabs */}
              <div style={{ ...styles.filterTabs, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{ ...styles.filterTab, ...(filter === 'all' ? styles.filterTabActive : {}) }}
                    onClick={() => setFilter('all')}
                  >
                    All ({evaluations.length})
                  </button>
                  <button
                    style={{ ...styles.filterTab, ...(filter === 'pending' ? styles.filterTabActive : {}) }}
                    onClick={() => setFilter('pending')}
                  >
                    Pending ({stats.pending})
                  </button>
                  <button
                    style={{ ...styles.filterTab, ...(filter === 'reviewed' ? styles.filterTabActive : {}) }}
                    onClick={() => setFilter('reviewed')}
                  >
                    Reviewed ({stats.reviewed})
                  </button>
                  <button
                    style={{ ...styles.filterTab, ...(filter === 'approved' ? styles.filterTabActive : {}) }}
                    onClick={() => setFilter('approved')}
                  >
                    Approved ({stats.approved})
                  </button>
                  <button
                    style={{ ...styles.filterTab, ...(filter === 'rejected' ? styles.filterTabActive : {}) }}
                    onClick={() => setFilter('rejected')}
                  >
                    Rejected ({stats.rejected})
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>Sort by:</span>
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  >
                    <option value="date">Most Recent</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>

              {/* Evaluations Cards */}
              {filteredEvaluations.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No evaluations</p>
                  <p style={{ color: '#6b7280' }}>
                    {filter === 'pending' ? 'No pending evaluations' : 'No evaluations for this state'}
                  </p>
                </div>
              ) : (
                <div style={styles.grid}>
                  {filteredEvaluations.map((evaluation) => (
                    <div
                      key={evaluation.id}
                      style={styles.card}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                    >
                      <div style={styles.cardHeader}>
                        <div style={{ flex: 1 }}>
                          <h3 style={styles.cardTitle}>{evaluation.name}</h3>
                          <p style={styles.cardMeta}>
                            {evaluation.organizationName || 'Unknown Organization'}
                          </p>
                        </div>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background: `${getStatusColor(evaluation.status)}20`,
                            color: getStatusColor(evaluation.status),
                          }}
                        >
                          {getStatusLabel(evaluation.status)}
                        </span>
                      </div>

                      <p style={styles.cardMeta}>
                        Period: {evaluation.period}
                      </p>
                      <p style={styles.cardMeta}>
                        Submitted: {new Date(evaluation.submittedDate || evaluation.createdDate).toLocaleDateString()}
                      </p>

                      {evaluation.scoring?.finalScore !== undefined && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Final Score</div>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                            {evaluation.scoring.finalScore}% - {evaluation.scoring.governanceLabel}
                          </div>
                        </div>
                      )}

                      <div style={styles.cardActions}>
                        <button
                          style={styles.actionButton}
                          onClick={() => navigate(`/evaluator/analysis/${evaluation.id}`)}
                          onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                          onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                        >
                          View Analysis
                        </button>
                        <button
                          style={{
                            ...styles.actionButton,
                            background: '#f3f4f6',
                            color: '#111827',
                          }}
                          onClick={() => navigate(`/evaluator/adjustment/${evaluation.id}`)}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#e5e7eb';
                            e.target.style.color = '#111827';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#f3f4f6';
                            e.target.style.color = '#111827';
                          }}
                        >
                          Open Evaluation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EvaluatorDashboardPage;