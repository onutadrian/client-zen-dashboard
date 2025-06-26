
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project } from './types';

export const useProjectsOperations = (setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
  const { toast } = useToast();

  const addProject = async (newProject: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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

  return {
    addProject,
    updateProject,
    archiveProject,
    deleteProject
  };
};
