
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Upload, Link as LinkIcon } from 'lucide-react';

interface ClientDocumentsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  newDocument: any;
  setNewDocument: (doc: any) => void;
}

const ClientDocumentsSection = ({ formData, setFormData, newDocument, setNewDocument }: ClientDocumentsSectionProps) => {
  const addDocument = () => {
    if (newDocument.name.trim()) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { ...newDocument, id: Date.now() }]
      });
      setNewDocument({ name: '', url: '', type: 'upload' });
    }
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div>
      <Label>Documents</Label>
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <Input
            placeholder="Document name"
            value={newDocument.name}
            onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
          />
          <Input
            placeholder="URL or file path"
            value={newDocument.url}
            onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={newDocument.type}
            onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
          >
            <option value="upload">Upload</option>
            <option value="link">Link</option>
          </select>
          <Button type="button" onClick={addDocument} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.documents.map((doc: any, index: number) => (
          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              {doc.type === 'upload' ? <Upload className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              <span className="font-medium">{doc.name || doc}</span>
              {doc.url && (
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
                  View
                </a>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeDocument(index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDocumentsSection;
