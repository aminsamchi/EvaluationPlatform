import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES } from '../../utils/constants';

const EvidenceVerificationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [verifications, setVerifications] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = () => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      const evalData = JSON.parse(data);
      setEvaluation(evalData);
      setVerifications(evalData.evaluatorReview?.evidenceVerification || {});
    }
  };

  const getCriteriaWithEvidence = () => {
    if (!evaluation) return [];
    const items = [];
    GOVERNANCE_PRINCIPLES.forEach(principle => {
      principle.practices.forEach(practice => {
        practice.criteria.forEach(criterion => {
          const key = `${principle.id}-${practice.id}-${criterion.id}`;
          const response = evaluation.responses?.[key];
          // Only require explicit evidence verification for highest maturity claims
          if (response?.fileName && response.maturityLevel === 3) {
            items.push({
              key,
              principleId: principle.id,
              principleName: principle.name,
              practiceId: practice.id,
              practiceName: practice.name,
              criterionId: criterion.id,
              criterionText: criterion.text,
              evidenceRequired: criterion.evidence,
              response
            });
          }
        });
      });
    });
    return items;
  };

  const criteriaWithEvidence = getCriteriaWithEvidence();
  const currentItem = criteriaWithEvidence[currentIndex];

  const handleVerification = (key, field, value) => {
    setVerifications(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleSave = () => {
    const updatedEval = {
      ...evaluation,
      evaluatorReview: {
        ...evaluation.evaluatorReview,
        evidenceVerification: verifications
      }
    };
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEval));
    alert('Evidence verification saved!');
  };

  const handleNext = () => {
    if (currentIndex < criteriaWithEvidence.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSave();
      navigate(`/evaluator/adjustment/${id}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!evaluation || !currentItem) return <div style={{padding: '40px', textAlign: 'center'}}>No evidence to verify</div>;

  const verification = verifications[currentItem.key] || {};

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb', padding: '24px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <button
          onClick={() => navigate(-1)}
          style={{padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '20px', cursor: 'pointer'}}
        >
          ← Back
        </button>
        
        <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Evidence Verification</h1>
            <div style={{fontSize: '14px', color: '#6b7280'}}>
              {currentIndex + 1} of {criteriaWithEvidence.length}
            </div>
          </div>
          <div style={{height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden'}}>
            <div style={{height: '100%', background: '#2563eb', width: ((currentIndex + 1) / criteriaWithEvidence.length * 100) + '%'}}></div>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px'}}>
          {/* Main Content */}
          <div>
            <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px'}}>
              <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '8px'}}>
                Principle {currentItem.principleId}: {currentItem.principleName} → Practice {currentItem.practiceId}
              </div>
              <h2 style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px'}}>
                Criterion {currentItem.criterionId}: {currentItem.criterionText}
              </h2>
              <div style={{padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', marginBottom: '16px'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#1e40af', marginBottom: '4px'}}>Required Evidence:</div>
                <div style={{fontSize: '13px', color: '#1e40af'}}>{currentItem.evidenceRequired}</div>
              </div>
              <div style={{padding: '16px', background: '#f9fafb', borderRadius: '8px'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px'}}>Organization's Response:</div>
                <div style={{fontSize: '14px', marginBottom: '8px'}}>
                  Maturity Level: <span style={{fontWeight: '600', color: '#2563eb'}}>{currentItem.response.maturityLevel}</span>
                </div>
                {currentItem.response.comment && (
                  <div style={{marginTop: '12px', padding: '12px', background: '#fff', borderRadius: '6px', border: '1px solid #e5e7eb'}}>
                    <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>Comment:</div>
                    <div style={{fontSize: '13px'}}>{currentItem.response.comment}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Evidence File */}
            <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '16px'}}>Uploaded Evidence</h3>
              <div style={{padding: '40px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center', border: '2px dashed #d1d5db'}}>
                <div style={{fontSize: '48px', marginBottom: '12px'}}>📄</div>
                <div style={{fontSize: '14px', fontWeight: '600', marginBottom: '4px'}}>{currentItem.response.fileName}</div>
                <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '16px'}}>
                  {(currentItem.response.fileSize / 1024).toFixed(1)} KB
                </div>
                <button style={{padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'}}>
                  Download & Review
                </button>
              </div>
            </div>
          </div>

          {/* Verification Panel */}
          <div>
            <div style={{background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', position: 'sticky', top: '24px'}}>
              <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '20px'}}>Verification Assessment</h3>
              
              {/* Verified Checkbox */}
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', background: verification.verified ? '#d1fae5' : '#f9fafb', borderRadius: '8px', border: verification.verified ? '2px solid #10b981' : '1px solid #e5e7eb'}}>
                  <input 
                    type="checkbox" 
                    checked={verification.verified || false}
                    onChange={(e) => handleVerification(currentItem.key, 'verified', e.target.checked)}
                    style={{width: '18px', height: '18px'}}
                  />
                  <span style={{fontSize: '14px', fontWeight: '600', color: verification.verified ? '#065f46' : '#374151'}}>
                    Evidence Verified
                  </span>
                </label>
              </div>

              {/* Quality Rating */}
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                  Evidence Quality (1-5 stars)
                </label>
                <div style={{display: 'flex', gap: '8px'}}>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleVerification(currentItem.key, 'quality', star)}
                      style={{
                        fontSize: '28px',
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

              {/* Adequacy */}
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                  Evidence Adequacy
                </label>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {['insufficient', 'adequate', 'excellent'].map(level => (
                    <label key={level} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#f9fafb', borderRadius: '6px', cursor: 'pointer', border: verification.adequacy === level ? '2px solid #2563eb' : '1px solid #e5e7eb'}}>
                      <input
                        type="radio"
                        name="adequacy"
                        value={level}
                        checked={verification.adequacy === level}
                        onChange={(e) => handleVerification(currentItem.key, 'adequacy', e.target.value)}
                      />
                      <span style={{fontSize: '13px', fontWeight: '500', textTransform: 'capitalize'}}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                  Verification Notes
                </label>
                <textarea
                  value={verification.notes || ''}
                  onChange={(e) => handleVerification(currentItem.key, 'notes', e.target.value)}
                  style={{width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'}}
                  placeholder="Add notes about the evidence quality, authenticity, or concerns..."
                />
              </div>

              {/* Navigation */}
              <div style={{display: 'flex', gap: '8px'}}>
                <button 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  style={{flex: 1, padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', opacity: currentIndex === 0 ? 0.5 : 1}}
                >
                  ← Previous
                </button>
                <button 
                  onClick={handleNext}
                  style={{flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}}
                >
                  {currentIndex === criteriaWithEvidence.length - 1 ? 'Finish →' : 'Next →'}
                </button>
              </div>

              <button 
                onClick={handleSave}
                style={{width: '100%', marginTop: '12px', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#6b7280'}}
              >
                💾 Save Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceVerificationPage;