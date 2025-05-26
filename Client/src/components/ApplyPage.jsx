import React from 'react';
import { useParams } from 'react-router-dom';
import ScholarshipApply from '../pages/ScholarshipApplyForm';
function ApplyPage() {
  const { id } = useParams();
  return <ScholarshipApply scholarshipId={id} />;
}

export default ApplyPage;
