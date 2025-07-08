import React from 'react';
import { Card, CardContent, Box, Typography, Alert, AlertTitle } from '@mui/material';
import { Info, Warning, ErrorOutline } from '@mui/icons-material';
import { SystemAnnouncement } from '../../../../types';
import './AnnouncementsList.css';

interface AnnouncementsListProps {
  announcements: SystemAnnouncement[];
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ announcements }) => {
  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Warning />;
      case 'policy':
        return <Info />;
      case 'warning':
        return <ErrorOutline />;
      default:
        return <Info />;
    }
  };

  const getAnnouncementColor = (type: string): 'warning' | 'info' | 'error' => {
    switch (type) {
      case 'maintenance':
        return 'warning';
      case 'policy':
        return 'info';
      case 'warning':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Card className="announcements-card">
      <CardContent>
        <Box className="announcements-header">
          <Info className="announcements-icon" />
          <Typography variant="h6">Announcements</Typography>
        </Box>
        <Box className="announcements-list">
          {announcements.map((announcement) => (
            <Alert
              key={announcement.id}
              severity={getAnnouncementColor(announcement.type)}
              className="announcement-item"
              icon={getAnnouncementIcon(announcement.type)}
            >
              <AlertTitle>{announcement.title}</AlertTitle>
              {announcement.content}
            </Alert>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsList;
