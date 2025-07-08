import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  bgColor,
  subtitle,
  trend,
  onClick,
}) => (
  <Card className={`stat-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
    <CardContent className="stat-card-content">
      <Box className="stat-card-main">
        <Box className="stat-card-text">
          <Typography variant="h3" className="stat-card-value">
            {value.toLocaleString()}
          </Typography>
          <Typography variant="body2" className="stat-card-title">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" className="stat-card-subtitle">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box className="stat-card-icon-section">
          <Box className="stat-card-icon" style={{ backgroundColor: bgColor }}>
            <Box className="stat-card-icon-inner" style={{ color }}>
              {icon}
            </Box>
          </Box>
          {trend && (
            <Box className="stat-card-trend">
              {trend.isPositive ? (
                <ArrowUpward className="stat-card-trend-icon positive" />
              ) : (
                <ArrowDownward className="stat-card-trend-icon negative" />
              )}
              <Typography
                variant="caption"
                className={`stat-card-trend-value ${trend.isPositive ? 'positive' : 'negative'}`}
              >
                {Math.abs(trend.value)}%
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
