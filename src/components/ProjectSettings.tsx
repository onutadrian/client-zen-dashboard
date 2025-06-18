
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Archive, Trash2 } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import ProjectExportOptions from '@/components/ProjectExportOptions';

interface ProjectSettingsProps {
  project: Project;
  onUpdateProject: (projectId: string, updates: any) => void;
}

const ProjectSettings = ({ project, onUpdateProject }: ProjectSettingsProps) => {
  const [projectData, setProjectData] = useState({
    name: project.name,
    status: project.status,
    notes: project.notes || '',
    startDate: project.startDate,
    estimatedEndDate: project.estimatedEndDate,
    endDate: project.endDate || ''
  });

  const handleSave = () => {
    onUpdateProject(project.id, { ...project, ...projectData });
  };

  const handleArchive = () => {
    onUpdateProject(project.id, { ...project, status: 'archived' });
  };

  return (
    <div className="space-y-6">
      {/* Project Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="project-status">Status</Label>
            <Select value={projectData.status} onValueChange={(value) => setProjectData({ ...projectData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={projectData.startDate}
                onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="estimated-end-date">Estimated End Date</Label>
              <Input
                id="estimated-end-date"
                type="date"
                value={projectData.estimatedEndDate}
                onChange={(e) => setProjectData({ ...projectData, estimatedEndDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="project-notes">Notes</Label>
            <Textarea
              id="project-notes"
              value={projectData.notes}
              onChange={(e) => setProjectData({ ...projectData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Export Options */}
      <ProjectExportOptions project={project} />

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div>
              <h4 className="font-medium">Archive Project</h4>
              <p className="text-sm text-slate-600">Archive this project to hide it from active projects list</p>
            </div>
            <Button onClick={handleArchive} variant="outline" className="border-yellow-600 text-yellow-600">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-600">Delete Project</h4>
              <p className="text-sm text-slate-600">Permanently delete this project and all associated data</p>
            </div>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettings;
