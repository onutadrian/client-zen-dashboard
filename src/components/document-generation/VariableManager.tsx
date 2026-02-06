
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface VariableManagerProps {
  variables: string[];
  variableValues: Record<string, string>;
  onVariableChange: (variableName: string, value: string) => void;
  onSaveAndUpdatePreview: () => void;
  hasUnsavedChanges: boolean;
}

const VariableManager = ({
  variables,
  variableValues,
  onVariableChange,
  onSaveAndUpdatePreview,
  hasUnsavedChanges
}: VariableManagerProps) => {
  if (variables.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Template Variables</CardTitle>
          <Button
            type="button"
            onClick={onSaveAndUpdatePreview}
            variant={hasUnsavedChanges ? "success" : "outline"}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Update Preview
          </Button>
        </div>
        {hasUnsavedChanges && (
          <p className="text-sm text-amber-600">
            You have unsaved changes. Click "Save & Update Preview" to apply them.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variables.map((variable) => (
            <div key={variable} className="space-y-2">
              <Label htmlFor={variable}>
                <Badge variant="outline" className="mr-2">{variable}</Badge>
              </Label>
              <Input
                id={variable}
                value={variableValues[variable] || ''}
                onChange={(e) => onVariableChange(variable, e.target.value)}
                placeholder={`Enter ${variable.replace('_', ' ')}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableManager;
