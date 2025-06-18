
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';

interface ProjectBilledHoursProps {
  project: Project;
  client?: Client;
}

const ProjectBilledHours = ({ project, client }: ProjectBilledHoursProps) => {
  const { hourEntries } = useHourEntries();

  // Filter hour entries for this specific project
  const projectHours = hourEntries.filter(entry => entry.projectId === project.id);

  const totalHours = projectHours.reduce((sum, entry) => sum + entry.hours, 0);
  const billedHours = projectHours
    .filter(entry => entry.billed)
    .reduce((sum, entry) => sum + entry.hours, 0);
  const unbilledHours = totalHours - billedHours;
  
  const hourlyRate = client?.price || 0;
  const totalRevenue = billedHours * hourlyRate;
  const pendingRevenue = unbilledHours * hourlyRate;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Project Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-slate-50 py-[16px]">
            <p className="text-zinc-950 text-4xl font-normal">{totalHours.toFixed(2)}</p>
            <p className="text-slate-600 py-[24px] text-base">Total Hours</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <p className="text-zinc-950 text-4xl font-normal">{billedHours.toFixed(2)}</p>
            <p className="text-slate-600 py-[24px] text-base">Billed Hours</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <p className="text-zinc-950 text-4xl font-normal">{unbilledHours.toFixed(2)}</p>
            <p className="text-slate-600 py-[24px] text-base">Unbilled Hours</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <p className="text-zinc-950 font-normal text-4xl">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-slate-600 py-[24px] text-base">Total Revenue</p>
          </div>
        </div>

        {projectHours.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Recent Time Entries</h4>
            <div className="space-y-2">
              {projectHours.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{entry.description || 'Time entry'}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.hours}h</p>
                    <p className="text-sm text-slate-600">
                      {entry.billed ? 'Billed' : 'Unbilled'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projectHours.length === 0 && (
          <div className="mt-6 text-center py-4">
            <p className="text-slate-500">No time entries found for this project</p>
            <p className="text-sm text-slate-400 mt-1">
              Time entries will appear here when hours are logged for this project
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectBilledHours;
