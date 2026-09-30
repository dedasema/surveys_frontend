import React from 'react';
import { AppLayout } from '../../../shared/layouts/AppLayout';
import { SystemUsageDashboard } from '../SystemUsageDashboard';

export const SystemUsageContainer: React.FC<{ role?: 'suscriptor' | 'admin' }> = ({
  role = 'suscriptor',
}) => {
  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <SystemUsageDashboard />
      </div>
    </AppLayout>
  );
};

export default SystemUsageContainer;
