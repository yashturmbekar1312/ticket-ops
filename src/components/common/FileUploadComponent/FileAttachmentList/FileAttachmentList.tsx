import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Delete,
  Download,
  Preview,
  Image as ImageIcon,
  PictureAsPdf,
  Description,
  VideoFile,
  AudioFile,
  Archive,
} from '@mui/icons-material';
import './FileAttachmentList.css';

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

interface FileAttachmentListProps {
  attachments: FileAttachment[];
  onRemoveAttachment: (attachmentId: string) => void;
  onDownloadAttachment: (attachment: FileAttachment) => void;
  onPreviewFile: (attachment: FileAttachment) => void;
  showPreview: boolean;
}

const FileAttachmentList: React.FC<FileAttachmentListProps> = ({
  attachments,
  onRemoveAttachment,
  onDownloadAttachment,
  onPreviewFile,
  showPreview,
}) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType === 'application/pdf') return <PictureAsPdf />;
    if (fileType.startsWith('video/')) return <VideoFile />;
    if (fileType.startsWith('audio/')) return <AudioFile />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive />;
    return <Description />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canPreviewFile = (fileType: string): boolean => {
    return fileType.startsWith('image/') || fileType === 'application/pdf';
  };

  if (attachments.length === 0) {
    return null;
  }

  return (
    <Box className="file-attachment-list">
      <Typography variant="h6" gutterBottom>
        Attachments ({attachments.length})
      </Typography>
      <List>
        {attachments.map((attachment) => (
          <ListItem key={attachment.id} divider>
            <ListItemIcon>{getFileIcon(attachment.type)}</ListItemIcon>
            <ListItemText
              primary={
                <Box className="file-info">
                  <Typography variant="body2" noWrap>
                    {attachment.name}
                  </Typography>
                  <Chip label={formatFileSize(attachment.size)} size="small" variant="outlined" />
                  {attachment.status === 'uploading' && (
                    <Chip label={`${attachment.uploadProgress}%`} size="small" color="primary" />
                  )}
                  {attachment.status === 'completed' && (
                    <Chip label="Uploaded" size="small" color="success" />
                  )}
                  {attachment.status === 'error' && (
                    <Chip label="Error" size="small" color="error" />
                  )}
                </Box>
              }
              secondary={
                attachment.status === 'uploading' ? (
                  <LinearProgress
                    variant="determinate"
                    value={attachment.uploadProgress}
                    className="upload-progress"
                  />
                ) : attachment.status === 'error' ? (
                  <Alert severity="error" className="upload-error">
                    {attachment.error || 'Upload failed'}
                  </Alert>
                ) : null
              }
            />
            <ListItemSecondaryAction>
              <Box className="file-actions">
                {attachment.status === 'completed' &&
                  showPreview &&
                  canPreviewFile(attachment.type) && (
                    <IconButton
                      size="small"
                      onClick={() => onPreviewFile(attachment)}
                      title="Preview"
                    >
                      <Preview />
                    </IconButton>
                  )}
                {attachment.status === 'completed' && (
                  <IconButton
                    size="small"
                    onClick={() => onDownloadAttachment(attachment)}
                    title="Download"
                  >
                    <Download />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  title="Remove"
                >
                  <Delete />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileAttachmentList;
