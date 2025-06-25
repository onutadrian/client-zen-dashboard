
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'standard';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

export interface UserInvite {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  invited_by?: string;
  created_at: string;
  expires_at: string;
  used: boolean;
  used_at?: string;
  used_by?: string;
  email_sent?: boolean;
  email_sent_at?: string;
}
