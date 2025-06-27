
import React from 'react';
import { GeneratedDocument } from '@/services/contractTemplateService';
import DocumentCard from './DocumentCard';
import EmptyState from './EmptyState';

interface DocumentsGridProps {
  documents: GeneratedDocument[];
  onDownload: (document: GeneratedDocument) => void;
  onDelete: (documentId: string) => void;
}

const DocumentsGrid = ({ documents, onDownload, onDelete }: DocumentsGridProps) => {
  if (documents.length === 0) {
    return <EmptyState type="documents" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DocumentsGrid;
