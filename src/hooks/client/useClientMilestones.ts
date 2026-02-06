import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/hooks/useProjects';
import type { Milestone } from '@/hooks/useMilestones';

const transformMilestone = (milestone: any): Milestone => ({
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
});

export const useClientMilestones = (projects: Project[]) => {
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const projectIds = useMemo(() => projects.map(p => p.id), [projects]);

  useEffect(() => {
    const loadMilestones = async () => {
      if (projectIds.length === 0) {
        setMilestones([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .in('project_id', projectIds)
          .order('target_date', { ascending: true });

        if (error) throw error;
        setMilestones((data || []).map(transformMilestone));
      } catch (error) {
        console.error('Error loading client milestones:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client milestones',
          variant: 'destructive'
        });
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, [projectIds.join('|')]);

  return { milestones, loading };
};

