import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES, MATURITY_LEVELS, getGovernanceLabel } from '../../utils/constants';

const ScoreAdjustmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [adjustments, setAdjustments] = useState({});
  const [evidenceVerification, setEvidenceVerification] = useState({});
  const [expandedPrinciples, setExpandedPrinciples] = useState([1]);
  const [overallComment, setOverallComment] = useState('');

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = () => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      const evalData = JSON.parse(data);
      setEvaluation(evalData);
      setAdjustments(evalData.evaluatorReview?.adjustments || {});
      setEvidenceVerification(evalData.evaluatorReview?.evidenceVerification || {});
      setOverallComment(evalData.evaluatorReview?.overallComment || '');
    }
  };

  const handleAdjustment = (key, orgLevel, newLevel, justification) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: {
        orgLevel,
        evaluatorLevel: newLevel,
        adjusted: newLevel !== orgLevel,
        justification: justification || prev[key]?.justification || ''
      }
    }));
  };

  const handleJustification = (key, justification) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: { ...prev[key], justification }
    }));
  };

  const handleEvidenceVerification = (key, field, value) => {
    setEvidenceVerification(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const calculateScore = (useAdjustments = false) => {
    if (!evaluation) return 0;
    const responses = Object.entries(evaluation.responses || {});
    if (responses.length === 0) return 0;

    const total = responses.reduce((sum, [key, response]) => {
      const level = useAdjustments && adjustments[key]?.evaluatorLevel !== undefined 
        ? adjustments[key].evaluatorLevel 
        : response.maturityLevel || 0;
      return sum + level;
    }, 0);

    return Math.round((total / (responses.length * 3)) * 100);
  };

  const handleSave = () => {
    const updatedEval = {
      ...evaluation,
      evaluatorReview: {
        ...evaluation.evaluatorReview,
        adjustments,
        evidenceVerification,
        overallComment
      }
    };
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEval));
    alert('Adjustments saved!');
  };

  const calculateFinalScore = () => {
    if (!evaluation) return 0;
    const responses = Object.entries(evaluation.responses || {});
    if (responses.length === 0) return 0;

    const total = responses.reduce((sum, [key, response]) => {
      const level = adjustments[key]?.evaluatorLevel !== undefined
        ? adjustments[key].evaluatorLevel
        : response.maturityLevel || 0;
      return sum + level;
    }, 0);

    return Math.round((total / (responses.length * 3)) * 100);
  };

  const handleApprove = () => {
    if (!window.confirm('Approve this evaluation?')) return;

    const finalScore = calculateFinalScore();
    const label = getGovernanceLabel(finalScore);

    const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

    const updatedEval = {
      ...evaluation,
      status: 'approved',
      evaluatorReview: {
        evaluatorId: user.id,
        evaluatorName: user.fullName || user.email,
        reviewCompleted: new Date().toISOString(),
        adjustments,
        evidenceVerification,
        overallComment
      },
      scoring: {
        finalScore,
        governanceLabel: label.label,
        certification: {
          certified: finalScore >= 50,
          level: label.label,
          validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        }
      }
    };

    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEval));
    alert(`Evaluation approved! Score: ${finalScore}% - ${label.label}`);
    navigate('/evaluator/dashboard');
  };

  const handleReject = () => {
    const reason = window.prompt('Reason for rejection:');
    if (!reason) return;

    const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

    const updatedEval = {
      ...evaluation,
      status: 'rejected',
      evaluatorReview: {
        evaluatorId: user.id,
        evaluatorName: user.fullName || user.email,
        reviewCompleted: new Date().toISOString(),
        adjustments,
        evidenceVerification,
        overallComment,
        rejectionReason: reason
      }
    };

    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEval));
    alert('Evaluation rejected');
    navigate('/evaluator/dashboard');
  };

  if (!evaluation) return <div style={{padding: '40px', textAlign: 'center'}}>Loading...</div>;

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb', padding: '24px'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <button
            onClick={() => navigate(-1)}
            style={{padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer'}}
          >
            ← Back
          </button>
          <button
            onClick={() => navigate(`/evaluator/evidence/${id}`)}
            style={{padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}}
          >
            Verify Evidence
          </button>
        </div>
        
        <h1 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '8px'}}>Evaluation Review</h1>
        <p style={{color: '#666', marginBottom: '24px'}}>Review each criterion: see the organization claim, available evidence and set your final maturity level.</p>

        {/* Overall Comment */}
        <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px'}}>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>Overall Evaluator Assessment</label>
          <textarea
            value={overallComment}
            onChange={(e) => setOverallComment(e.target.value)}
            placeholder="Summarize your overall assessment and justification..."
            style={{width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'}}
          />
        </div>

        {/* Principles */}
        {GOVERNANCE_PRINCIPLES.map(principle => {
          const isExpanded = expandedPrinciples.includes(principle.id);
          
          return (
            <div key={principle.id} style={{background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '16px', overflow: 'hidden'}}>
              <div 
                onClick={() => setExpandedPrinciples(prev => prev.includes(principle.id) ? prev.filter(p => p !== principle.id) : [...prev, principle.id])}
                style={{padding: '20px', background: '#fafafa', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '32px', height: '32px', background: '#2563eb', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{principle.id}</div>
                  <div style={{fontSize: '16px', fontWeight: '600'}}>{principle.name}</div>
                </div>
                <span>{isExpanded ? '▼' : '▶'}</span>
              </div>

              {isExpanded && (
                <div style={{padding: '20px'}}>
                  {principle.practices.map(practice => (
                    <div key={practice.id} style={{marginBottom: '24px'}}>
                      <div style={{fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px'}}>
                        Practice {practice.id}: {practice.name}
                      </div>
                      {practice.criteria.map(criterion => {
                        const key = `${principle.id}-${practice.id}-${criterion.id}`;
                        const response = evaluation.responses?.[key];
                        if (!response || response.maturityLevel === undefined) return null;

                        const adjustment = adjustments[key] || {};
                        const verification = evidenceVerification[key] || {};
                        const currentLevel = adjustment.evaluatorLevel !== undefined ? adjustment.evaluatorLevel : response.maturityLevel;
                        const isAdjusted = adjustment.adjusted;

                        return (
                          <div key={criterion.id} style={{padding: '16px', background: isAdjusted ? '#fef3c7' : '#f9fafb', borderRadius: '8px', marginBottom: '12px', border: isAdjusted ? '2px solid #fbbf24' : '1px solid #e5e7eb'}}>
                            <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '12px'}}>
                              Criterion {criterion.id}: {criterion.text}
                            </div>

                            {/* Organization claim and evidence */}
                            <div style={{marginBottom: '12px'}}>
                              <div style={{fontSize: '11px', color: '#6b7280', marginBottom: '4px'}}>Organization Claimed:</div>
                              <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center'}}>
                                <div style={{padding: '8px 12px', background: '#e5e7eb', borderRadius: '6px', fontSize: '13px', fontWeight: '600'}}>
                                  Level {response.maturityLevel} - {MATURITY_LEVELS[response.maturityLevel]?.label}
                                </div>
                                {response.fileName ? (
                                  <div style={{padding: '8px 12px', background: '#eff6ff', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #bfdbfe'}}>
                                    <span>📎</span>
                                    <span>{response.fileName}</span>
                                  </div>
                                ) : (
                                  <span style={{fontSize: '12px', color: '#9ca3af'}}>No evidence uploaded</span>
                                )}
                              </div>
                              {response.comment && (
                                <div style={{marginTop: '8px', padding: '10px', background: '#fff', borderRadius: '6px', fontSize: '12px', color: '#374151', border: '1px solid #e5e7eb'}}>
                                  {response.comment}
                                </div>
                              )}
                            </div>

                            {/* Evidence verification inline (only for highest maturity) */}
                            {response.fileName && response.maturityLevel === 3 && (
                              <div style={{marginBottom: '12px', padding: '12px', borderRadius: '8px', background: '#f9fafb', border: '1px dashed #d1d5db'}}>
                                <div style={{fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Evidence Verification</div>
                                <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer'}}>
                                  <input
                                    type="checkbox"
                                    checked={verification.verified || false}
                                    onChange={(e) => handleEvidenceVerification(key, 'verified', e.target.checked)}
                                    style={{width: '16px', height: '16px'}}
                                  />
                                  <span style={{fontSize: '13px'}}>Evidence verified & supports claim</span>
                                </label>
                                <div style={{marginBottom: '8px'}}>
                                  <span style={{display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px'}}>Quality (1–5)</span>
                                  <div style={{display: 'flex', gap: '4px'}}>
                                    {[1,2,3,4,5].map(star => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleEvidenceVerification(key, 'quality', star)}
                                        style={{
                                          fontSize: '20px',
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          color: (verification.quality || 0) >= star ? '#eab308' : '#d1d5db'
                                        }}
                                      >
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <textarea
                                  value={verification.notes || ''}
                                  onChange={(e) => handleEvidenceVerification(key, 'notes', e.target.value)}
                                  placeholder="Notes about evidence (optional)..."
                                  style={{width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit'}}
                                />
                              </div>
                            )}

                            {/* Evaluator assessment */}
                            <div style={{marginBottom: '12px'}}>
                              <div style={{fontSize: '11px', color: '#6b7280', marginBottom: '4px'}}>Evaluator Assessment:</div>
                              <select
                                value={currentLevel}
                                onChange={(e) => handleAdjustment(key, response.maturityLevel, parseInt(e.target.value))}
                                style={{width: '100%', padding: '8px 12px', border: '2px solid #2563eb', borderRadius: '6px', fontSize: '13px', fontWeight: '600', background: '#fff'}}
                              >
                                {MATURITY_LEVELS.map(level => (
                                  <option key={level.value} value={level.value}>
                                    Level {level.value} - {level.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {isAdjusted && (
                              <div>
                                <label style={{display: 'block', fontSize: '11px', fontWeight: '600', color: '#92400e', marginBottom: '6px'}}>
                                  Justification Required:
                                </label>
                                <textarea
                                  value={adjustment.justification || ''}
                                  onChange={(e) => handleJustification(key, e.target.value)}
                                  placeholder="Explain why you're adjusting this score..."
                                  style={{width: '100%', padding: '8px', border: '1px solid #fbbf24', borderRadius: '6px', fontSize: '12px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit'}}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Actions */}
        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px'}}>
          <button onClick={handleSave} style={{padding: '12px 24px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
            💾 Save Progress
          </button>
          <button onClick={handleReject} style={{padding: '12px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
            ❌ Reject
          </button>
          <button onClick={handleApprove} style={{padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
            ✅ Approve & Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreAdjustmentPage;