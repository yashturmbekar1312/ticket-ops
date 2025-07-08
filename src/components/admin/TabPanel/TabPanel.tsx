import React from 'react';
import { Box } from '@mui/material';
import './TabPanel.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} className="tab-panel">
    {value === index && <Box>{children}</Box>}
  </div>
);

export default TabPanel;
