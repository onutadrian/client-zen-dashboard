
import React from 'react';
import { ContractTemplate } from '@/services/contractTemplateService';
import TemplateCard from './TemplateCard';
import EmptyState from './EmptyState';

interface TemplatesGridProps {
  templates: ContractTemplate[];
  onEdit: (template: ContractTemplate) => void;
  onGenerate: (template: ContractTemplate) => void;
  onDelete: (templateId: string) => void;
  onAddTemplate: () => void;
}

const TemplatesGrid = ({ templates, onEdit, onGenerate, onDelete, onAddTemplate }: TemplatesGridProps) => {
  if (templates.length === 0) {
    return <EmptyState type="templates" onAddTemplate={onAddTemplate} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onGenerate={onGenerate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TemplatesGrid;
