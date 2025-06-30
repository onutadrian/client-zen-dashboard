
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface ClientLinksSectionProps {
  // For display mode (ClientDetailsSheet)
  links?: string[];
  // For edit mode (EditClientModal)
  formData?: any;
  setFormData?: (data: any) => void;
  newLink?: string;
  setNewLink?: (link: string) => void;
}

const ClientLinksSection = ({ links, formData, setFormData, newLink, setNewLink }: ClientLinksSectionProps) => {
  // Display mode (for ClientDetailsSheet)
  if (links && !formData) {
    if (!links || links.length === 0) return null;

    return (
      <div>
        <h4 className="font-medium text-slate-700 mb-3 flex items-center">
          <LinkIcon className="w-4 h-4 mr-2" />
          Relevant Links ({links.length})
        </h4>
        <div className="space-y-2">
          {links.map((link: string, index: number) => (
            <a 
              key={index} 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center p-2 bg-slate-50 rounded text-sm hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2 text-slate-500" />
              <span className="text-blue-600 hover:text-blue-800">{link}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Edit mode (for EditClientModal)
  if (!formData || !setFormData || !newLink || !setNewLink) return null;

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
        <div className="flex space-x-2">
          <Input
            placeholder="https://example.com"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <Button type="button" onClick={addLink} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.links.map((link: string, index: number) => (
          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
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
