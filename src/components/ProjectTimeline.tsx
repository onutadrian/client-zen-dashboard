
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
import ProjectTimelineHeader from './timeline/ProjectTimelineHeader';
import ProjectTimelineItem from './timeline/ProjectTimelineItem';

interface Client {
  id: number;
  name: string;
}

interface ProjectTimelineProps {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  clients: Client[];
}

const ProjectTimeline = ({ projects, tasks, milestones, clients }: ProjectTimelineProps) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return selectedProject === 'all' 
      ? projects 
      : projects.filter(p => p.id === selectedProject);
  }, [projects, selectedProject]);

  return (
    <Card>
      <CardHeader>
        <ProjectTimelineHeader
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
        />
      </CardHeader>
      
      <CardContent>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No projects to display</h3>
            <p className="text-slate-500">Create projects to see them in the timeline view</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <ProjectTimelineItem
                key={project.id}
                project={project}
                tasks={tasks}
                milestones={milestones}
                clients={clients}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
