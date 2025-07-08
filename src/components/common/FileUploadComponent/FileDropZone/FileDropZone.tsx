import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { CloudUpload, AttachFile } from '@mui/icons-material';
import { useDropzone, FileRejection } from 'react-dropzone';
import './FileDropZone.css';

interface FileDropZoneProps {
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  maxFiles: number;
  maxFileSize: number;
  acceptedFileTypes: string[];
  currentFileCount: number;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onDrop,
  maxFiles,
  maxFileSize,
  acceptedFileTypes,
  currentFileCount,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - currentFileCount,
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
  });

  return (
    <Paper {...getRootProps()} className={`file-drop-zone ${isDragActive ? 'drag-active' : ''}`}>
      <input {...getInputProps()} />
      <CloudUpload className="drop-zone-icon" />
      <Typography variant="h6" className="drop-zone-title">
        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
      </Typography>
      <Typography variant="body2" className="drop-zone-subtitle">
        or click to browse files
      </Typography>
      <Button variant="outlined" startIcon={<AttachFile />} className="choose-files-button">
        Choose Files
      </Button>
      <Box className="drop-zone-info">
        <Typography variant="caption" className="drop-zone-info-text">
          Max {maxFiles} files, {maxFileSize}MB each
        </Typography>
        <br />
        <Typography variant="caption" className="drop-zone-info-text">
          Supported: Images, PDF, Documents, Archives
        </Typography>
      </Box>
    </Paper>
  );
};

export default FileDropZone;
