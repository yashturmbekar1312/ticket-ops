import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { FileRejection } from 'react-dropzone';
import FileDropZone from './FileDropZone';
import FileAttachmentList from './FileAttachmentList';
import FilePreviewDialog from './FilePreviewDialog';
import './FileUploadComponent.css';

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

  const simulateFileUpload = useCallback(
    async (attachment: FileAttachment) => {
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
    },
    [attachments, onAttachmentsChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(
          (rejection) =>
            `${rejection.file.name}: ${rejection.errors.map((e) => e.message).join(', ')}`
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
    [attachments, maxFiles, onAttachmentsChange, simulateFileUpload]
  );

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

  const handlePreviewFile = (attachment: FileAttachment) => {
    setPreviewFile(attachment);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  return (
    <Box className="file-upload-component">
      <FileDropZone
        onDrop={onDrop}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        acceptedFileTypes={acceptedFileTypes}
        currentFileCount={attachments.length}
      />

      <FileAttachmentList
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        onDownloadAttachment={downloadAttachment}
        onPreviewFile={handlePreviewFile}
        showPreview={showPreview}
      />

      <FilePreviewDialog
        open={previewFile !== null}
        onClose={handleClosePreview}
        file={previewFile}
      />
    </Box>
  );
};

export default FileUploadComponent;
