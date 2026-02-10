import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES, MATURITY_LEVELS, getGovernanceLabel } from '../../utils/constants';

const EvaluationAnalysisPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = () => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      const evalData = JSON.parse(data);
      setEvaluation(evalData);
      performAnalysis(evalData);
    }
  };

  const performAnalysis = (evalData) => {
    const responses = Object.values(evalData.responses || {});
    const totalCriteria = 158;
    const answered = responses.filter(r => r.maturityLevel !== undefined && r.maturityLevel !== null).length;
    
    // Maturity distribution
    const distribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
    responses.forEach(r => {
      if (r.maturityLevel !== undefined) distribution[r.maturityLevel]++;
    });

    // Evidence statistics
    const withEvidence = responses.filter(r => r.fileName).length;
    const withComments = responses.filter(r => r.comment).length;

    // Red flags
    const redFlags = [];
    if (distribution[3] / answered > 0.7) redFlags.push("⚠️ Over 70% claimed as 'Validated' - verify evidence");
    if (withEvidence / answered < 0.3) redFlags.push("⚠️ Less than 30% have evidence - inadequate support");
    if (distribution[0] === 0 && distribution[1] === 0) redFlags.push("⚠️ No low scores - suspiciously perfect");

    // Principle breakdown
    const principleStats = GOVERNANCE_PRINCIPLES.map(principle => {
      const principleCriteria = principle.practices.reduce((sum, practice) => sum + practice.criteria.length, 0);
      const principleResponses = responses.filter(r => r.principleId === principle.id);
      const avgScore = principleResponses.length > 0 
        ? principleResponses.reduce((sum, r) => sum + (r.maturityLevel || 0), 0) / principleResponses.length 
        : 0;
      
      return {
        id: principle.id,
        name: principle.name,
        total: principleCriteria,
        answered: principleResponses.length,
        avgScore: avgScore.toFixed(2),
        percentage: ((avgScore / 3) * 100).toFixed(0)
      };
    });

    setAnalysis({
      completionRate: ((answered / totalCriteria) * 100).toFixed(1),
      answered,
      totalCriteria,
      distribution,
      withEvidence,
      withComments,
      redFlags,
      principleStats,
      estimatedScore: ((responses.reduce((sum, r) => sum + (r.maturityLevel || 0), 0) / (responses.length * 3)) * 100).toFixed(0)
    });
  };

  if (!evaluation || !analysis) return <div style={{padding: '40px', textAlign: 'center'}}>Loading...</div>;

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb', padding: '24px'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        <button onClick={() => navigate('/evaluator/dashboard')} style={{padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '20px', cursor: 'pointer'}}>← Back</button>
        
        <h1 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '8px'}}>Evaluation Analysis</h1>
        <p style={{color: '#666', marginBottom: '32px'}}>{evaluation.name}</p>

        {/* Stats Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px'}}>
          <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>Completion Rate</div>
            <div style={{fontSize: '36px', fontWeight: 'bold', color: '#2563eb'}}>{analysis.completionRate}%</div>
            <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>{analysis.answered}/{analysis.totalCriteria} criteria</div>
          </div>
          <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>Estimated Score</div>
            <div style={{fontSize: '36px', fontWeight: 'bold', color: '#10b981'}}>{analysis.estimatedScore}%</div>
            <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>{getGovernanceLabel(analysis.estimatedScore).label}</div>
          </div>
          <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>With Evidence</div>
            <div style={{fontSize: '36px', fontWeight: 'bold', color: '#f59e0b'}}>{analysis.withEvidence}</div>
            <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>{((analysis.withEvidence/analysis.answered)*100).toFixed(0)}% of responses</div>
          </div>
          <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>With Comments</div>
            <div style={{fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6'}}>{analysis.withComments}</div>
            <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>{((analysis.withComments/analysis.answered)*100).toFixed(0)}% of responses</div>
          </div>
        </div>

        {/* Maturity Distribution */}
        <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px'}}>
          <h2 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px'}}>Maturity Level Distribution</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
            {MATURITY_LEVELS.map(level => {
              const count = analysis.distribution[level.value];
              const percentage = ((count / analysis.answered) * 100).toFixed(0);
              return (
                <div key={level.value} style={{padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '2px solid ' + level.color}}>
                  <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>Level {level.value}</div>
                  <div style={{fontSize: '28px', fontWeight: 'bold', color: level.color, marginBottom: '4px'}}>{count}</div>
                  <div style={{fontSize: '12px', fontWeight: '500', color: level.color}}>{level.label}</div>
                  <div style={{fontSize: '11px', color: '#6b7280', marginTop: '8px'}}>{percentage}% of responses</div>
                  <div style={{marginTop: '8px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden'}}>
                    <div style={{height: '100%', background: level.color, width: percentage + '%'}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Red Flags */}
        {analysis.redFlags.length > 0 && (
          <div style={{background: '#fef2f2', border: '2px solid #fecaca', padding: '20px', borderRadius: '12px', marginBottom: '24px'}}>
            <h3 style={{fontSize: '16px', fontWeight: '600', color: '#dc2626', marginBottom: '12px'}}>⚠️ Red Flags Detected</h3>
            <ul style={{margin: 0, paddingLeft: '20px'}}>
              {analysis.redFlags.map((flag, idx) => (
                <li key={idx} style={{color: '#7f1d1d', marginBottom: '8px'}}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Principle Breakdown */}
        <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px'}}>
          <h2 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px'}}>Principle-by-Principle Analysis</h2>
          <div style={{display: 'grid', gap: '12px'}}>
            {analysis.principleStats.map(stat => (
              <div key={stat.id} style={{padding: '16px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{width: '40px', height: '40px', background: '#2563eb', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{stat.id}</div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '14px', fontWeight: '600', marginBottom: '4px'}}>{stat.name}</div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>{stat.answered}/{stat.total} criteria answered</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2563eb'}}>{stat.percentage}%</div>
                  <div style={{fontSize: '11px', color: '#6b7280'}}>Avg: {stat.avgScore}/3</div>
                </div>
                <div style={{width: '100px'}}>
                  <div style={{height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{height: '100%', background: '#2563eb', width: stat.percentage + '%'}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
          <button
            onClick={() => navigate('/evaluator/dashboard')}
            style={{padding: '12px 24px', background: '#f3f4f6', color: '#111827', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationAnalysisPage;