export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
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
          project_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billed?: boolean
          client_id: number
          created_at?: string
          date?: string
          description?: string | null
          hours: number
          id?: number
          project_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billed?: boolean
          client_id?: number
          created_at?: string
          date?: string
          description?: string | null
          hours?: number
          id?: number
          project_id?: string
          updated_at?: string
          user_id?: string | null
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
            foreignKeyName: "hour_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
          id: string
          payment_status: string | null
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
          id?: string
          payment_status?: string | null
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
          id?: string
          payment_status?: string | null
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
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      subscriptions: {
        Row: {
          billing_date: string
          category: string
          created_at: string
          currency: string
          id: number
          login_email: string | null
          name: string
          price: number
          seats: number
          secure_notes: string | null
          status: string
          total_paid: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_date: string
          category?: string
          created_at?: string
          currency?: string
          id?: number
          login_email?: string | null
          name: string
          price?: number
          seats?: number
          secure_notes?: string | null
          status?: string
          total_paid?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_date?: string
          category?: string
          created_at?: string
          currency?: string
          id?: number
          login_email?: string | null
          name?: string
          price?: number
          seats?: number
          secure_notes?: string | null
          status?: string
          total_paid?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assets: string[] | null
          client_id: number
          client_name: string
          completed_date: string | null
          created_date: string
          description: string | null
          end_date: string | null
          estimated_hours: number | null
          id: number
          notes: string | null
          project_id: string
          start_date: string | null
          status: string
          title: string
          user_id: string | null
        }
        Insert: {
          actual_hours?: number | null
          assets?: string[] | null
          client_id: number
          client_name: string
          completed_date?: string | null
          created_date?: string
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: number
          notes?: string | null
          project_id: string
          start_date?: string | null
          status?: string
          title: string
          user_id?: string | null
        }
        Update: {
          actual_hours?: number | null
          assets?: string[] | null
          client_id?: number
          client_name?: string
          completed_date?: string | null
          created_date?: string
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: number
          notes?: string | null
          project_id?: string
          start_date?: string | null
          status?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
