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

export interface InviteCode {
  id: string;
  code: string;
  role: UserRole;
  created_at: string;
  created_by?: string;
  expires_at?: string;
  used_by?: string;
  is_used: boolean;
}