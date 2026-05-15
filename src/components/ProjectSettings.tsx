
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Archive, Trash2 } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import ProjectExportOptions from '@/components/ProjectExportOptions';
import { useNavigate } from 'react-router-dom';
import { deriveFixedProjectBillingStatus, getFixedProjectBillingStatusLabel } from '@/utils/projectBilling';

interface ProjectSettingsProps {
  project: Project;
  onUpdateProject: (projectId: string, updates: any) => void;
  onArchiveProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectSettings = ({
  project,
  onUpdateProject,
  onArchiveProject,
  onDeleteProject
}: ProjectSettingsProps) => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    name: project.name,
    status: project.status,
    notes: project.notes || '',
    startDate: project.startDate,
    estimatedEndDate: project.estimatedEndDate,
    endDate: project.endDate || '',
    billedAmount: project.billedAmount ?? 0
  });

  const fixedBillingStatus = deriveFixedProjectBillingStatus(project.fixedPrice, projectData.billedAmount);

  const fixedBillingBadgeClass =
    fixedBillingStatus === 'billed'
      ? 'ui-pill ui-pill--success'
      : fixedBillingStatus === 'partial'
        ? 'ui-pill ui-pill--warning'
        : 'ui-pill ui-pill--neutral';

  const handleSave = () => {
    onUpdateProject(project.id, {
      ...project,
      ...projectData,
      billedAmount: project.pricingType === 'fixed' ? projectData.billedAmount : undefined,
      billingStatus: project.pricingType === 'fixed' ? fixedBillingStatus : undefined,
    });
  };

  const handleArchive = () => {
    onArchiveProject(project.id);
  };

  const handleDelete = () => {
    onDeleteProject(project.id);
    navigate('/projects');
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
              onChange={e => setProjectData({
                ...projectData,
                name: e.target.value
              })}
            />
          </div>

          <div>
            <Label htmlFor="project-status">Status</Label>
            <Select
              value={projectData.status}
              onValueChange={value => setProjectData({
                ...projectData,
                status: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
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
                onChange={e => setProjectData({
                  ...projectData,
                  startDate: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="estimated-end-date">Estimated End Date</Label>
              <Input
                id="estimated-end-date"
                type="date"
                value={projectData.estimatedEndDate}
                onChange={e => setProjectData({
                  ...projectData,
                  estimatedEndDate: e.target.value
                })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="project-notes">Notes</Label>
            <Textarea
              id="project-notes"
              value={projectData.notes}
              onChange={e => setProjectData({
                ...projectData,
                notes: e.target.value
              })}
              rows={4}
            />
          </div>

          {project.pricingType === 'fixed' && (
            <div className="rounded-lg border border-border/70 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-slate-900">Fixed Project Billing</h4>
                  <p className="text-sm text-slate-500">Manually track how much of the fixed project value has been billed.</p>
                </div>
                <Badge className={fixedBillingBadgeClass}>
                  {getFixedProjectBillingStatusLabel(fixedBillingStatus)}
                </Badge>
              </div>

              <div>
                <Label htmlFor="project-billed-amount">Billed Amount</Label>
                <Input
                  id="project-billed-amount"
                  type="number"
                  step="0.01"
                  value={projectData.billedAmount}
                  onChange={e => setProjectData({
                    ...projectData,
                    billedAmount: e.target.value ? parseFloat(e.target.value) : 0
                  })}
                />
              </div>
            </div>
          )}

          <Button variant="primary"
            onClick={handleSave}
           
          >
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive this project? You can still access it by toggling "Show Archived" on the projects page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-600">Delete Project</h4>
              <p className="text-sm text-slate-600">Permanently delete this project and all associated data (tasks, milestones, etc.)</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="danger">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project "{project.name}" and all associated tasks, milestones, and data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-100 text-red-800 hover:bg-red-200">
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettings;
