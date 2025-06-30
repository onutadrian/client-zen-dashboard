
import React from 'react';
import { FileText } from 'lucide-react';

interface ClientNotesSectionProps {
  notes: string;
}

const ClientNotesSection = ({ notes }: ClientNotesSectionProps) => {
  if (!notes) return null;

  return (
    <div>
      <h4 className="font-medium text-slate-700 mb-2 flex items-center">
        <FileText className="w-4 h-4 mr-2" />
        Notes
      </h4>
      <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{notes}</p>
    </div>
  );
};

export default ClientNotesSection;
