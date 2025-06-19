
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  amount?: number;
  currency?: string;
  completionPercentage: number;
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
}

export const useMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('target_date', { ascending: true });

      if (error) throw error;

      const transformedMilestones: Milestone[] = data.map(milestone => ({
        id: milestone.id,
        projectId: milestone.project_id,
        title: milestone.title,
        description: milestone.description || undefined,
        targetDate: milestone.target_date,
        status: milestone.status as 'pending' | 'in-progress' | 'completed',
        amount: milestone.amount || undefined,
        currency: milestone.currency || 'USD',
        completionPercentage: milestone.completion_percentage || 0,
        estimatedHours: milestone.estimated_hours || undefined,
        createdAt: milestone.created_at,
        updatedAt: milestone.updated_at
      }));

      setMilestones(transformedMilestones);
    } catch (error) {
      console.error('Error loading milestones:', error);
      toast({
        title: "Error",
        description: "Failed to load milestones",
        variant: "destructive"
      });
    }
  };

  const addMilestone = async (newMilestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'completionPercentage'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('milestones')
        .insert([{
          project_id: newMilestone.projectId,
          title: newMilestone.title,
          description: newMilestone.description,
          target_date: newMilestone.targetDate,
          status: newMilestone.status,
          amount: newMilestone.amount,
          currency: newMilestone.currency || 'USD',
          estimated_hours: newMilestone.estimatedHours,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedMilestone: Milestone = {
        id: data.id,
        projectId: data.project_id,
        title: data.title,
        description: data.description || undefined,
        targetDate: data.target_date,
        status: data.status as 'pending' | 'in-progress' | 'completed',
        amount: data.amount || undefined,
        currency: data.currency || 'USD',
        completionPercentage: data.completion_percentage || 0,
        estimatedHours: data.estimated_hours || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setMilestones(prev => [...prev, transformedMilestone]);
      
      toast({
        title: "Success",
        description: "Milestone added successfully"
      });
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast({
        title: "Error",
        description: "Failed to add milestone",
        variant: "destructive"
      });
    }
  };

  const updateMilestone = async (milestoneId: string, updates: Partial<Milestone>) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update({
          title: updates.title,
          description: updates.description,
          target_date: updates.targetDate,
          status: updates.status,
          amount: updates.amount,
          currency: updates.currency,
          completion_percentage: updates.completionPercentage,
          estimated_hours: updates.estimatedHours
        })
        .eq('id', milestoneId);

      if (error) throw error;

      setMilestones(prev => prev.map(milestone => 
        milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
      ));

      toast({
        title: "Success",
        description: "Milestone updated successfully"
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive"
      });
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;

      setMilestones(prev => prev.filter(milestone => milestone.id !== milestoneId));

      toast({
        title: "Success",
        description: "Milestone deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive"
      });
    }
  };

  const refreshMilestones = () => {
    loadMilestones();
  };

  return {
    milestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    refreshMilestones
  };
};
