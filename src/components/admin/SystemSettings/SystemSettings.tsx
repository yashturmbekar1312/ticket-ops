import React from 'react';
import { Settings } from '@mui/icons-material';
import TabCard from '../TabCard';

const SystemSettings: React.FC = () => {
  return (
    <TabCard
      icon={<Settings />}
      title="System Settings"
      description="Configure system-wide settings, notifications, and integrations."
      iconColor="#6b7280"
    />
  );
};

export default SystemSettings;
