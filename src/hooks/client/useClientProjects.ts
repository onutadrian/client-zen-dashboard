import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/hooks/useProjects';
import type { Client } from '@/types/client';

const transformProject = (project: any): Project => ({
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
  useMilestones: project.use_milestones !== false,
  invoices: Array.isArray(project.invoices) ? project.invoices : []
});

export const useClientProjects = (client: Client | null) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      if (!client?.id) {
        setProjects([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects((data || []).map(transformProject));
      } catch (error) {
        console.error('Error loading client projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client projects',
          variant: 'destructive'
        });
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [client?.id]);

  return { projects, loading };
};

