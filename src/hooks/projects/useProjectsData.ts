
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project } from './types';

export const useProjectsData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      let projectsQuery = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (profile.role !== 'admin') {
        const { data: assignments, error: assignmentError } = await supabase
          .from('user_project_assignments')
          .select('project_id')
          .eq('user_id', user.id);

        if (assignmentError) throw assignmentError;

        const assignedProjectIds = assignments.map(a => a.project_id);
        
        if (assignedProjectIds.length === 0) {
          setProjects([]);
          return;
        }

        projectsQuery = projectsQuery.in('id', assignedProjectIds);
      }

      const { data, error } = await projectsQuery;
      if (error) throw error;

      const transformedProjects: Project[] = data.map((project: any) => ({
        id: project.id,
        name: project.name,
        clientId: project.client_id,
        startDate: project.start_date,
        estimatedEndDate: project.estimated_end_date,
        endDate: project.end_date || undefined,
        status: project.status,
        notes: project.notes || '',
        documents: project.documents || [],
        team: project.team || [],
        archived: project.archived || false,
        pricingType: project.pricing_type as 'fixed' | 'hourly' | 'daily',
        fixedPrice: project.fixed_price || undefined,
        hourlyRate: project.hourly_rate || undefined,
        urgentHourlyRate: project.urgent_hourly_rate || undefined,
        dailyRate: project.daily_rate || undefined,
        estimatedHours: project.estimated_hours || undefined,
        currency: project.currency || 'USD',
        useMilestones: project.use_milestones !== false, // default to true if not present
        invoices: Array.isArray(project.invoices) ? project.invoices as Array<{
          id: string;
          amount: number;
          date: string;
          status: 'paid' | 'pending' | 'overdue';
          description?: string;
        }> : []
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    setProjects,
    loadProjects
  };
};
