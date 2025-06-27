
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, FileText } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ContractTemplate } from '@/services/contractTemplateService';

interface TemplateCardProps {
  template: ContractTemplate;
  onEdit: (template: ContractTemplate) => void;
  onGenerate: (template: ContractTemplate) => void;
  onDelete: (templateId: string) => void;
}

const TemplateCard = ({ template, onEdit, onGenerate, onDelete }: TemplateCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{template.name}</span>
          <Badge variant="secondary">{template.variables.length} vars</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {template.template_content.substring(0, 150)}...
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {template.variables.slice(0, 3).map((variable) => (
            <Badge key={variable} variant="outline" className="text-xs">
              {variable}
            </Badge>
          ))}
          {template.variables.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.variables.length - 3} more
            </Badge>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerate(template)}
          >
            <FileText className="w-4 h-4 mr-1" />
            Generate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(template)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Template</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{template.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(template.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
