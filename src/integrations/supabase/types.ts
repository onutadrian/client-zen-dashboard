export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string
          currency: string | null
          documents: string[] | null
          id: number
          invoices: Json[] | null
          links: string[] | null
          name: string
          notes: string | null
          people: Json[] | null
          price: number
          price_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          documents?: string[] | null
          id?: number
          invoices?: Json[] | null
          links?: string[] | null
          name: string
          notes?: string | null
          people?: Json[] | null
          price: number
          price_type: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          documents?: string[] | null
          id?: number
          invoices?: Json[] | null
          links?: string[] | null
          name?: string
          notes?: string | null
          people?: Json[] | null
          price?: number
          price_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          template_content: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          template_content: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          template_content?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      generated_documents: {
        Row: {
          client_id: number | null
          created_at: string
          document_name: string
          generated_content: string
          id: string
          project_id: string | null
          template_id: string
          user_id: string
          variables_used: Json | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          document_name: string
          generated_content: string
          id?: string
          project_id?: string | null
          template_id: string
          user_id?: string
          variables_used?: Json | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          document_name?: string
          generated_content?: string
          id?: string
          project_id?: string | null
          template_id?: string
          user_id?: string
          variables_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      hour_entries: {
        Row: {
          billed: boolean
          client_id: number
          created_at: string
          date: string
          description: string | null
          hours: number
          id: number
          milestone_id: string | null
          project_id: string
          task_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billed?: boolean
          client_id: number
          created_at?: string
          date?: string
          description?: string | null
          hours: number
          id?: number
          milestone_id?: string | null
          project_id: string
          task_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billed?: boolean
          client_id?: number
          created_at?: string
          date?: string
          description?: string | null
          hours?: number
          id?: number
          milestone_id?: string | null
          project_id?: string
          task_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hour_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hour_entries_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hour_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hour_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: number | null
          created_at: string
          currency: string
          date: string
          description: string | null
          id: string
          milestone_id: string | null
          project_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          client_id?: number | null
          created_at?: string
          currency?: string
          date: string
          description?: string | null
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: number | null
          created_at?: string
          currency?: string
          date?: string
          description?: string | null
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          amount: number | null
          completion_percentage: number | null
          created_at: string
          currency: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          project_id: string
          status: string
          target_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          completion_percentage?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          project_id: string
          status?: string
          target_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          completion_percentage?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          project_id?: string
          status?: string
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          archived: boolean | null
          client_id: number
          created_at: string
          currency: string
          daily_rate: number | null
          documents: string[] | null
          end_date: string | null
          estimated_end_date: string
          estimated_hours: number | null
          fixed_price: number | null
          hourly_rate: number | null
          id: string
          invoices: Json | null
          name: string
          notes: string | null
          pricing_type: string
          start_date: string
          status: string
          team: string[] | null
          updated_at: string
          urgent_hourly_rate: number | null
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          client_id: number
          created_at?: string
          currency?: string
          daily_rate?: number | null
          documents?: string[] | null
          end_date?: string | null
          estimated_end_date: string
          estimated_hours?: number | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          invoices?: Json | null
          name: string
          notes?: string | null
          pricing_type?: string
          start_date: string
          status?: string
          team?: string[] | null
          updated_at?: string
          urgent_hourly_rate?: number | null
          user_id?: string
        }
        Update: {
          archived?: boolean | null
          client_id?: number
          created_at?: string
          currency?: string
          daily_rate?: number | null
          documents?: string[] | null
          end_date?: string | null
          estimated_end_date?: string
          estimated_hours?: number | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          invoices?: Json | null
          name?: string
          notes?: string | null
          pricing_type?: string
          start_date?: string
          status?: string
          team?: string[] | null
          updated_at?: string
          urgent_hourly_rate?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          billing_date: string
          category: string
          created_at: string
          currency: string
          id: number
          invoice_link: string | null
          login_email: string | null
          name: string
          price: number
          seats: number
          secure_notes: string | null
          status: string
          total_paid: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          billing_date: string
          category?: string
          created_at?: string
          currency?: string
          id?: number
          invoice_link?: string | null
          login_email?: string | null
          name: string
          price?: number
          seats?: number
          secure_notes?: string | null
          status?: string
          total_paid?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          billing_cycle?: string
          billing_date?: string
          category?: string
          created_at?: string
          currency?: string
          id?: number
          invoice_link?: string | null
          login_email?: string | null
          name?: string
          price?: number
          seats?: number
          secure_notes?: string | null
          status?: string
          total_paid?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assets: string[] | null
          assigned_to: string | null
          client_id: number
          client_name: string
          completed_date: string | null
          created_date: string
          description: string | null
          end_date: string | null
          estimated_hours: number | null
          id: number
          milestone_id: string | null
          notes: string | null
          project_id: string
          start_date: string | null
          status: string
          title: string
          urgent: boolean | null
          user_id: string
          worked_hours: number | null
        }
        Insert: {
          actual_hours?: number | null
          assets?: string[] | null
          assigned_to?: string | null
          client_id: number
          client_name: string
          completed_date?: string | null
          created_date?: string
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: number
          milestone_id?: string | null
          notes?: string | null
          project_id: string
          start_date?: string | null
          status?: string
          title: string
          urgent?: boolean | null
          user_id?: string
          worked_hours?: number | null
        }
        Update: {
          actual_hours?: number | null
          assets?: string[] | null
          assigned_to?: string | null
          client_id?: number
          client_name?: string
          completed_date?: string | null
          created_date?: string
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: number
          milestone_id?: string | null
          notes?: string | null
          project_id?: string
          start_date?: string | null
          status?: string
          title?: string
          urgent?: boolean | null
          user_id?: string
          worked_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invites: {
        Row: {
          created_at: string
          email: string
          email_sent: boolean | null
          email_sent_at: string | null
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          token: string
          used: boolean
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          email: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          expires_at?: string
          id?: string
          invited_by?: string | null
          role: string
          token: string
          used?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          token?: string
          used?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      user_project_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_project_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_project_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: { Args: never; Returns: string }
      log_security_action: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      update_user_role: {
        Args: { new_role: string; target_user_id: string }
        Returns: undefined
      }
      validate_invite_token_secure: {
        Args: { token_input: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
