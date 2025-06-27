import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { ContractTemplate } from '@/services/contractTemplateService';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface EditTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: ContractTemplate;
}

const EditTemplateModal = ({ open, onOpenChange, template }: EditTemplateModalProps) => {
  const { updateTemplate } = useContractTemplates();
  const [name, setName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setTemplateContent(template.template_content);
      setVariables(template.variables || []);
    }
  }, [template]);

  const handleAddVariable = () => {
    if (newVariable.trim() && !variables.includes(newVariable.trim())) {
      setVariables([...variables, newVariable.trim()]);
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (variableToRemove: string) => {
    setVariables(variables.filter(v => v !== variableToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !templateContent.trim()) return;

    setIsSubmitting(true);
    try {
      await updateTemplate(template.id, {
        name: name.trim(),
        template_content: templateContent.trim(),
        variables
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVariable();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contract Template</DialogTitle>
          <DialogDescription>
            Modify your contract template content and variables.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Monthly Invoice Template"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variables">Template Variables</Label>
            <div className="flex space-x-2">
              <Input
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., client_name, project_name"
              />
              <Button type="button" onClick={handleAddVariable} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {variables.map((variable) => (
                <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                  {variable}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 w-4 h-4"
                    onClick={() => handleRemoveVariable(variable)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Use variables in your template like this: {`{{variable_name}}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Template Content</Label>
            <Textarea
              id="content"
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              placeholder="Enter your template content here. Use {{variable_name}} for dynamic content."
              className="min-h-[300px] font-mono text-sm"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateModal;
