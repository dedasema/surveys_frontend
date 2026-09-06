import React from 'react';
import { useParams } from 'react-router-dom';
import { SurveyWizard } from '../features/adaptive-survey/SurveyWizard';

export default function AdaptiveSurveyPage() {
  const { token } = useParams<{ token: string }>();
  return <SurveyWizard surveyId={token || 'demo'} token={token} />;
}
