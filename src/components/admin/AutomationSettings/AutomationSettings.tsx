import React from 'react';
import { AutoAwesome } from '@mui/icons-material';
import TabCard from '../TabCard';

const AutomationSettings: React.FC = () => {
  return (
    <TabCard
      icon={<AutoAwesome />}
      title="Automation Rules"
      description="Configure automated workflows, routing rules, and escalation policies."
      iconColor="#f59e0b"
    />
  );
};

export default AutomationSettings;
