
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface ClientLinksSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  newLink: string;
  setNewLink: (link: string) => void;
}

const ClientLinksSection = ({ formData, setFormData, newLink, setNewLink }: ClientLinksSectionProps) => {
  const addLink = () => {
    if (newLink.trim()) {
      setFormData({
        ...formData,
        links: [...formData.links, newLink.trim()]
      });
      setNewLink('');
    }
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div>
      <Label>Relevant Links</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="Add relevant link"
          />
          <Button type="button" onClick={addLink} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.links.map((link: string, index: number) => (
          <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm truncate">
              {link}
            </a>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLink(index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLinksSection;
