import React from 'react';
import { Assignment } from '@mui/icons-material';
import TabCard from '../TabCard';

const TicketManagement: React.FC = () => {
  return (
    <TabCard
      icon={<Assignment />}
      title="Ticket Management"
      description="Comprehensive ticket management functionality will be implemented here."
      iconColor="#6366f1"
    />
  );
};

export default TicketManagement;
