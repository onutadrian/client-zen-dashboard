
import React from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

interface ClientLinksSectionProps {
  links: string[];
}

const ClientLinksSection = ({ links }: ClientLinksSectionProps) => {
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
};

export default ClientLinksSection;
