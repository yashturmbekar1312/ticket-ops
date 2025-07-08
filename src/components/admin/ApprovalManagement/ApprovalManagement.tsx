import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { ApprovalRequest } from '../../../types';
import './ApprovalManagement.css';

interface ApprovalManagementProps {
  pendingApprovals: ApprovalRequest[];
}

const ApprovalManagement: React.FC<ApprovalManagementProps> = ({ pendingApprovals }) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card className="approval-management-card">
          <CardContent className="approval-management-content">
            <Box className="approval-management-header">
              <CheckCircle className="approval-management-icon" />
              <Typography variant="h5" className="approval-management-title">
                Pending Approvals
              </Typography>
              <Chip
                label={pendingApprovals.length}
                size="small"
                className="approval-management-badge"
              />
            </Box>
            <Typography variant="body1" className="approval-management-description">
              Review and approve pending requests from team members.
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="approval-table-header">Request ID</TableCell>
                    <TableCell className="approval-table-header">Type</TableCell>
                    <TableCell className="approval-table-header">Requester</TableCell>
                    <TableCell className="approval-table-header">Description</TableCell>
                    <TableCell className="approval-table-header">Cost</TableCell>
                    <TableCell className="approval-table-header">Urgency</TableCell>
                    <TableCell className="approval-table-header">Created</TableCell>
                    <TableCell className="approval-table-header">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingApprovals.map((approval) => (
                    <TableRow key={approval.id} hover>
                      <TableCell>{approval.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={approval.type}
                          size="small"
                          className={`approval-type-chip ${approval.type}`}
                        />
                      </TableCell>
                      <TableCell>{approval.requestedByName}</TableCell>
                      <TableCell>{approval.description}</TableCell>
                      <TableCell>
                        <Typography variant="body2" className="approval-cost">
                          {approval.estimatedCost && formatCurrency(approval.estimatedCost)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approval.urgency}
                          size="small"
                          className="approval-urgency-chip"
                          style={{
                            backgroundColor: getUrgencyColor(approval.urgency) + '20',
                            color: getUrgencyColor(approval.urgency),
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(approval.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box className="approval-actions">
                          <Button size="small" variant="contained" className="approval-approve-btn">
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" className="approval-reject-btn">
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ApprovalManagement;
