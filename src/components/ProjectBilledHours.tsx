
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, TrendingUp } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectBilledHoursProps {
  project: Project;
  client?: any;
}

const ProjectBilledHours = ({ project, client }: ProjectBilledHoursProps) => {
  // Calculate project-specific hours from client's hour entries
  const projectHours = client?.hourEntries?.filter((entry: any) => {
    // Check if entry has projectId matching this project, or if description mentions this project
    return entry.projectId === project.id || 
           entry.description?.toLowerCase().includes(project.name.toLowerCase());
  }) || [];

  const totalHours = projectHours.reduce((sum: number, entry: any) => sum + (entry.hours || 0), 0);
  const billedHours = projectHours
    .filter((entry: any) => entry.billed)
    .reduce((sum: number, entry: any) => sum + (entry.hours || 0), 0);
  const unbilledHours = totalHours - billedHours;
  
  const hourlyRate = client?.price || 0;
  const totalRevenue = billedHours * hourlyRate;
  const pendingRevenue = unbilledHours * hourlyRate;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Billed Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-slate-50 py-[16px]">
            <p className="text-zinc-950 text-4xl font-normal">{totalHours}</p>
            <p className="text-slate-600 py-[24px] text-base">Total Hours</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <p className="text-zinc-950 text-4xl font-normal">{billedHours}</p>
            <p className="text-slate-600 py-[24px] text-base">Billed Hours</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <p className="text-zinc-950 text-4xl font-normal">{unbilledHours}</p>
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
              {projectHours.slice(-5).map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
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
              Time entries will appear here when tasks are completed or hours are logged manually
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectBilledHours;
