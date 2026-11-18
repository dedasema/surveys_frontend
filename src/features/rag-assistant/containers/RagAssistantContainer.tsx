import React from 'react';
import CopilotChatPage from '../../copilot/components/CopilotChatPage';

export const RagAssistantContainer: React.FC<{ role?: 'suscriptor' | 'admin' }> = ({ role = 'suscriptor' }) => {
  return <CopilotChatPage role={role} />;
};

export default RagAssistantContainer;
