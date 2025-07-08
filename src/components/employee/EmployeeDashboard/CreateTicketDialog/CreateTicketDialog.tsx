import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import { TicketCategory, TicketPriority } from '../../../../types';
import './CreateTicketDialog.css';

interface CreateTicketDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  ticketData: {
    title: string;
    category: TicketCategory;
    description: string;
    priority: TicketPriority;
    attachments: File[];
  };
  onTicketDataChange: (data: {
    title: string;
    category: TicketCategory;
    description: string;
    priority: TicketPriority;
    attachments: File[];
  }) => void;
}

const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({
  open,
  onClose,
  onSubmit,
  ticketData,
  onTicketDataChange,
}) => {
  const isSubmitDisabled = !ticketData.title || !ticketData.category || !ticketData.description;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth className="create-ticket-dialog">
      <DialogTitle className="dialog-title">Create New Ticket</DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="dialog-form">
          <TextField
            fullWidth
            label="Title"
            value={ticketData.title}
            onChange={(e) => onTicketDataChange({ ...ticketData, title: e.target.value })}
            className="form-field"
            required
          />
          <Grid container spacing={2} className="form-row">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={ticketData.category}
                  onChange={(e) =>
                    onTicketDataChange({
                      ...ticketData,
                      category: e.target.value as TicketCategory,
                    })
                  }
                  label="Category"
                  required
                >
                  <MenuItem value="Hardware">Hardware</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Network">Network</MenuItem>
                  <MenuItem value="Access">Access</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Account">Account</MenuItem>
                  <MenuItem value="Training">Training</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={ticketData.priority}
                  onChange={(e) =>
                    onTicketDataChange({
                      ...ticketData,
                      priority: e.target.value as TicketPriority,
                    })
                  }
                  label="Priority"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={ticketData.description}
            onChange={(e) => onTicketDataChange({ ...ticketData, description: e.target.value })}
            className="form-field"
            required
          />
          <Button variant="outlined" startIcon={<AttachFile />} className="attach-button">
            Attach Files
          </Button>
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} className="cancel-button">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isSubmitDisabled}
          className="submit-button"
        >
          Create Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTicketDialog;
