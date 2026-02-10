import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// This page used to be a complex "final review" screen.
// The flow has been simplified so that the score adjustment page
// is now the final review and decision step.
// To keep navigation working, this page simply redirects there.

const ReviewEvaluationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      navigate(`/evaluator/adjustment/${id}`, { replace: true });
    } else {
      navigate('/evaluator/dashboard', { replace: true });
    }
  }, [id, navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      Redirecting to the updated review flow...
    </div>
  );
};

export default ReviewEvaluationPage;