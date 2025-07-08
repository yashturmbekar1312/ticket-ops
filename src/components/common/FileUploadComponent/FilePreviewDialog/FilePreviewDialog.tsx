import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import './FilePreviewDialog.css';

interface FileAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FilePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  file: FileAttachment | null;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ open, onClose, file }) => {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth className="file-preview-dialog">
      <DialogTitle>
        <Box className="dialog-title">
          <Typography variant="h6" component="div" noWrap>
            {file.name}
          </Typography>
          <IconButton aria-label="close" onClick={onClose} size="small" className="close-button">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box className="preview-container">
          {isImage && file.url && (
            <img
              src={file.url}
              alt={file.name}
              className="preview-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          )}

          {isPdf && file.url && (
            <iframe
              src={file.url}
              title={file.name}
              className="preview-pdf"
              onError={(e) => {
                const target = e.target as HTMLIFrameElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          )}

          {(!isImage && !isPdf) || !file.url ? (
            <Box className="preview-unavailable">
              <Typography variant="body1" color="textSecondary">
                Preview not available for this file type
              </Typography>
              <Typography variant="body2" color="textSecondary">
                File: {file.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Type: {file.type}
              </Typography>
            </Box>
          ) : null}

          <div className="error-fallback hidden">
            <Typography variant="body1" color="error">
              Failed to load preview
            </Typography>
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilePreviewDialog;
