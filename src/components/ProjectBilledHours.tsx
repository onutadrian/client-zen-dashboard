
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
  const projectHours = client?.hourEntries?.filter((entry: any) => 
    entry.projectId === project.id
  ) || [];

  const totalHours = projectHours.reduce((sum: number, entry: any) => sum + (entry.hours || 0), 0);
  const billedHours = projectHours.filter((entry: any) => entry.billed).reduce(
    (sum: number, entry: any) => sum + (entry.hours || 0), 0
  );
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
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{totalHours}</p>
            <p className="text-sm text-slate-600">Total Hours</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{billedHours}</p>
            <p className="text-sm text-slate-600">Billed Hours</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{unbilledHours}</p>
            <p className="text-sm text-slate-600">Unbilled Hours</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Total Revenue</p>
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
      </CardContent>
    </Card>
  );
};

export default ProjectBilledHours;
