
import { useState } from 'react';
import { useProjectsData } from './projects/useProjectsData';
import { useProjectsOperations } from './projects/useProjectsOperations';

export type { Project } from './projects/types';

export const useProjects = () => {
  const { projects, setProjects, loading } = useProjectsData();
  const [showArchived, setShowArchived] = useState(false);
  
  const { addProject, updateProject, archiveProject, deleteProject } = useProjectsOperations(setProjects);

  const filteredProjects = projects.filter(project => 
    showArchived ? project.archived : !project.archived
  );

  return {
    projects: filteredProjects,
    showArchived,
    setShowArchived,
    addProject,
    updateProject,
    archiveProject,
    deleteProject,
    loading
  };
};
