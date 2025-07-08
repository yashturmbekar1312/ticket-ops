import React from 'react';
import { People } from '@mui/icons-material';
import TabCard from '../TabCard';

const UserTeamManagement: React.FC = () => {
  return (
    <TabCard
      icon={<People />}
      title="Users & Teams"
      description="Manage user accounts, roles, and team assignments."
      iconColor="#8b5cf6"
    />
  );
};

export default UserTeamManagement;
