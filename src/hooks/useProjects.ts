
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  name: string;
  clientId: number;
  startDate: string;
  estimatedEndDate: string;
  endDate?: string;
  status: string;
  notes: string;
  documents: string[];
  team: string[];
  archived: boolean;
  pricingType: 'fixed' | 'hourly' | 'daily';
  fixedPrice?: number;
  hourlyRate?: number;
  dailyRate?: number;
  estimatedHours?: number;
  currency: string;
  invoices: Array<{
    id: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue';
    description?: string;
  }>;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  // Load projects from Supabase on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Project interface
      const transformedProjects: Project[] = data.map(project => ({
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
        dailyRate: project.daily_rate || undefined,
        estimatedHours: project.estimated_hours || undefined,
        currency: project.currency || 'USD',
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

  const addProject = async (newProject: any) => {
    try {
      // Get user ID for RLS
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Transform to Supabase format
      const supabaseProject = {
        name: newProject.name,
        client_id: newProject.clientId,
        start_date: newProject.startDate,
        estimated_end_date: newProject.estimatedEndDate,
        end_date: newProject.endDate || null,
        status: newProject.status || 'active',
        notes: newProject.notes || '',
        documents: newProject.documents || [],
        team: newProject.team || [],
        archived: false,
        pricing_type: newProject.pricingType,
        fixed_price: newProject.fixedPrice || null,
        hourly_rate: newProject.hourlyRate || null,
        daily_rate: newProject.dailyRate || null,
        estimated_hours: newProject.estimatedHours || null,
        currency: newProject.currency || 'USD',
        invoices: newProject.invoices || [],
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([supabaseProject])
        .select()
        .single();

      if (error) throw error;

      // Transform back to our format and add to state
      const transformedProject: Project = {
        id: data.id,
        name: data.name,
        clientId: data.client_id,
        startDate: data.start_date,
        estimatedEndDate: data.estimated_end_date,
        endDate: data.end_date || undefined,
        status: data.status,
        notes: data.notes || '',
        documents: data.documents || [],
        team: data.team || [],
        archived: data.archived || false,
        pricingType: data.pricing_type as 'fixed' | 'hourly' | 'daily',
        fixedPrice: data.fixed_price || undefined,
        hourlyRate: data.hourly_rate || undefined,
        dailyRate: data.daily_rate || undefined,
        estimatedHours: data.estimated_hours || undefined,
        currency: data.currency || 'USD',
        invoices: Array.isArray(data.invoices) ? data.invoices as Array<{
          id: string;
          amount: number;
          date: string;
          status: 'paid' | 'pending' | 'overdue';
          description?: string;
        }> : []
      };

      setProjects(prev => [...prev, transformedProject]);
      
      toast({
        title: "Success",
        description: "Project added successfully"
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive"
      });
    }
  };

  const updateProject = async (projectId: string, updatedProject: any) => {
    try {
      // Transform to Supabase format
      const supabaseUpdate = {
        name: updatedProject.name,
        client_id: updatedProject.clientId,
        start_date: updatedProject.startDate,
        estimated_end_date: updatedProject.estimatedEndDate,
        end_date: updatedProject.endDate || null,
        status: updatedProject.status,
        notes: updatedProject.notes,
        documents: updatedProject.documents,
        team: updatedProject.team,
        archived: updatedProject.archived,
        pricing_type: updatedProject.pricingType,
        fixed_price: updatedProject.fixedPrice || null,
        hourly_rate: updatedProject.hourlyRate || null,
        daily_rate: updatedProject.dailyRate || null,
        estimated_hours: updatedProject.estimatedHours || null,
        currency: updatedProject.currency || 'USD',
        invoices: updatedProject.invoices || []
      };

      const { error } = await supabase
        .from('projects')
        .update(supabaseUpdate)
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId ? updatedProject : project
      ));

      toast({
        title: "Success",
        description: "Project updated successfully"
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
    }
  };

  const archiveProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ archived: true })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.map(project => 
        project.id === projectId ? { ...project, archived: true } : project
      ));

      toast({
        title: "Success",
        description: "Project archived successfully"
      });
    } catch (error) {
      console.error('Error archiving project:', error);
      toast({
        title: "Error",
        description: "Failed to archive project",
        variant: "destructive"
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Success",
        description: "Project and all related data deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  // Filter projects based on archived status
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
    deleteProject
  };
};
