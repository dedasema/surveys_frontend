import React from 'react';
import { AppLayout } from '../../../shared/layouts/AppLayout';
import { CompanyFilesDashboard } from '../CompanyFilesDashboard';

export const CompanyFilesContainer: React.FC<{ role?: 'suscriptor' | 'admin' }> = ({
  role = 'suscriptor',
}) => {
  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <CompanyFilesDashboard />
      </div>
    </AppLayout>
  );
};

export default CompanyFilesContainer;
