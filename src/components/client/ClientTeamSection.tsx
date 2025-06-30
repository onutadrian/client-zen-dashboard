
import React from 'react';
import { Users, Mail } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface ClientTeamSectionProps {
  people: Array<{
    name: string;
    email: string;
    title: string;
  }>;
}

const ClientTeamSection = ({ people }: ClientTeamSectionProps) => {
  const { demoMode } = useCurrency();

  if (!people || people.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium text-slate-700 mb-3 flex items-center">
        <Users className="w-4 h-4 mr-2" />
        Team ({people.length})
      </h4>
      <div className="space-y-2">
        {people.map((person: any, index: number) => (
          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div>
              <div className="font-medium text-slate-800">{person.name}</div>
              <div className="text-sm text-slate-600">{person.title}</div>
            </div>
            <div className="flex items-center text-slate-500">
              <Mail className="w-4 h-4 mr-1" />
              <span className="text-sm">{demoMode ? '—' : person.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientTeamSection;
