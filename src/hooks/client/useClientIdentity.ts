import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

const normalizeEmail = (email?: string | null) => (email || '').trim().toLowerCase();

const extractEmails = (people: any[] | null | undefined) => {
  if (!people) return [];
  const emails: string[] = [];
  for (const person of people) {
    if (typeof person === 'string') {
      try {
        const parsed = JSON.parse(person);
        if (parsed?.email) emails.push(normalizeEmail(parsed.email));
      } catch {
        // ignore
      }
      continue;
    }
    if (person && typeof person === 'object' && 'email' in person) {
      emails.push(normalizeEmail((person as any).email));
    }
  }
  return emails.filter(Boolean);
};

export const useClientIdentity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      if (!user?.email) {
        setClient(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const email = normalizeEmail(user.email);
        const matched = (data || []).find((c: any) => {
          const emails = extractEmails(c.people);
          return emails.includes(email);
        });

        setClient(matched || null);
      } catch (error) {
        console.error('Error loading client identity:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client profile',
          variant: 'destructive'
        });
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [user?.email]);

  return { client, loading };
};

