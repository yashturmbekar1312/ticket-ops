import React from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import './TabCard.css';

interface TabCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor?: string;
}

const TabCard: React.FC<TabCardProps> = ({ icon, title, description, iconColor }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card className="tab-card">
          <CardContent className="tab-card-content">
            <Box className="tab-card-header">
              <Box className="tab-card-icon" style={{ color: iconColor }}>
                {icon}
              </Box>
              <Typography variant="h5" className="tab-card-title">
                {title}
              </Typography>
            </Box>
            <Typography variant="body1" className="tab-card-description">
              {description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TabCard;
