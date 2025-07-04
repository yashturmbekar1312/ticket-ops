import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload,
  AttachFile,
  Delete,
  Download,
  Preview,
  Image,
  PictureAsPdf,
  Description,
  VideoFile,
  AudioFile,
  Archive,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

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

interface FileUploadComponentProps {
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  showPreview?: boolean;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  attachments,
  onAttachmentsChange,
  maxFiles = 10,
  maxFileSize = 25, // 25MB
  acceptedFileTypes = [
    'image/*',
    'application/pdf',
    '.doc,.docx',
    '.xls,.xlsx',
    '.txt',
    '.zip,.rar',
  ],
  showPreview = true,
}) => {
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(
          (rejection) =>
            `${rejection.file.name}: ${rejection.errors.map((e: any) => e.message).join(', ')}`
        );
        console.error('File upload errors:', errors);
      }

      // Process accepted files
      const newAttachments = acceptedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: 'uploading' as const,
      }));

      const updatedAttachments = [...attachments, ...newAttachments];

      // Check max files limit
      if (updatedAttachments.length > maxFiles) {
        console.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      onAttachmentsChange(updatedAttachments);

      // Simulate file upload
      newAttachments.forEach((attachment) => {
        simulateFileUpload(attachment);
      });
    },
    [attachments, maxFiles, onAttachmentsChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - attachments.length,
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
  });

  const simulateFileUpload = async (attachment: FileAttachment) => {
    const totalSteps = 100;
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= totalSteps) {
        progress = totalSteps;
        clearInterval(interval);

        // Mark as completed and create URL
        const updatedAttachments = attachments.map((att) =>
          att.id === attachment.id
            ? {
                ...att,
                uploadProgress: 100,
                status: 'completed' as const,
                url: URL.createObjectURL(attachment.file),
              }
            : att
        );
        onAttachmentsChange(updatedAttachments);
      } else {
        // Update progress
        const updatedAttachments = attachments.map((att) =>
          att.id === attachment.id ? { ...att, uploadProgress: Math.round(progress) } : att
        );
        onAttachmentsChange(updatedAttachments);
      }
    }, 100);
  };

  const removeAttachment = (attachmentId: string) => {
    const updatedAttachments = attachments.filter((att) => att.id !== attachmentId);
    onAttachmentsChange(updatedAttachments);
  };

  const downloadAttachment = (attachment: FileAttachment) => {
    if (attachment.url) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image />;
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

  const previewFileContent = (attachment: FileAttachment) => {
    if (!canPreviewFile(attachment.type)) return null;

    if (attachment.type.startsWith('image/')) {
      return (
        <Box sx={{ textAlign: 'center', maxHeight: 400, overflow: 'auto' }}>
          <img
            src={attachment.url}
            alt={attachment.name}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </Box>
      );
    }

    if (attachment.type === 'application/pdf') {
      return (
        <Box sx={{ height: 400 }}>
          <iframe src={attachment.url} width="100%" height="100%" title={attachment.name} />
        </Box>
      );
    }

    return null;
  };

  return (
    <Box>
      {/* Drop Zone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          or click to browse files
        </Typography>
        <Button variant="outlined" startIcon={<AttachFile />} sx={{ mt: 2 }}>
          Choose Files
        </Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Max {maxFiles} files, {maxFileSize}MB each
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Supported: Images, PDF, Documents, Archives
          </Typography>
        </Box>
      </Paper>

      {/* File List */}
      {attachments.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Attachments ({attachments.length})
          </Typography>
          <List>
            {attachments.map((attachment) => (
              <ListItem key={attachment.id} divider>
                <ListItemIcon>{getFileIcon(attachment.type)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" noWrap>
                        {attachment.name}
                      </Typography>
                      <Chip
                        label={formatFileSize(attachment.size)}
                        size="small"
                        variant="outlined"
                      />
                      {attachment.status === 'uploading' && (
                        <Chip
                          label={`${attachment.uploadProgress}%`}
                          size="small"
                          color="primary"
                        />
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
                        sx={{ mt: 1 }}
                      />
                    ) : attachment.status === 'error' ? (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {attachment.error || 'Upload failed'}
                      </Alert>
                    ) : null
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {attachment.status === 'completed' &&
                      showPreview &&
                      canPreviewFile(attachment.type) && (
                        <IconButton
                          size="small"
                          onClick={() => setPreviewFile(attachment)}
                          title="Preview"
                        >
                          <Preview />
                        </IconButton>
                      )}
                    {attachment.status === 'completed' && (
                      <IconButton
                        size="small"
                        onClick={() => downloadAttachment(attachment)}
                        title="Download"
                      >
                        <Download />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => removeAttachment(attachment.id)}
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
      )}

      {/* Preview Dialog */}
      {previewFile && (
        <Dialog open={true} onClose={() => setPreviewFile(null)} maxWidth="md" fullWidth>
          <DialogTitle>{previewFile.name}</DialogTitle>
          <DialogContent>{previewFileContent(previewFile)}</DialogContent>
          <DialogActions>
            <Button onClick={() => downloadAttachment(previewFile)}>Download</Button>
            <Button onClick={() => setPreviewFile(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default FileUploadComponent;
