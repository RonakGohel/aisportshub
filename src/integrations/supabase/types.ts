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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      athlete_profiles: {
        Row: {
          achievements: string | null
          coach_name: string | null
          created_at: string
          current_club: string | null
          experience_years: number | null
          height_cm: number | null
          id: string
          is_verified: boolean | null
          primary_sport: Database["public"]["Enums"]["sport_category"]
          secondary_sports:
            | Database["public"]["Enums"]["sport_category"][]
            | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          achievements?: string | null
          coach_name?: string | null
          created_at?: string
          current_club?: string | null
          experience_years?: number | null
          height_cm?: number | null
          id?: string
          is_verified?: boolean | null
          primary_sport: Database["public"]["Enums"]["sport_category"]
          secondary_sports?:
            | Database["public"]["Enums"]["sport_category"][]
            | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          achievements?: string | null
          coach_name?: string | null
          created_at?: string
          current_club?: string | null
          experience_years?: number | null
          height_cm?: number | null
          id?: string
          is_verified?: boolean | null
          primary_sport?: Database["public"]["Enums"]["sport_category"]
          secondary_sports?:
            | Database["public"]["Enums"]["sport_category"][]
            | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          image_url: string | null
          is_live: boolean | null
          score_away: number | null
          score_home: number | null
          sport_category: Database["public"]["Enums"]["sport_category"]
          status: string | null
          team_away: string | null
          team_home: string | null
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_live?: boolean | null
          score_away?: number | null
          score_home?: number | null
          sport_category: Database["public"]["Enums"]["sport_category"]
          status?: string | null
          team_away?: string | null
          team_home?: string | null
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_live?: boolean | null
          score_away?: number | null
          score_home?: number | null
          sport_category?: Database["public"]["Enums"]["sport_category"]
          status?: string | null
          team_away?: string | null
          team_home?: string | null
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          preferred_sports:
            | Database["public"]["Enums"]["sport_category"][]
            | null
          state: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          preferred_sports?:
            | Database["public"]["Enums"]["sport_category"][]
            | null
          state?: string | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          preferred_sports?:
            | Database["public"]["Enums"]["sport_category"][]
            | null
          state?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      program_registrations: {
        Row: {
          application_notes: string | null
          created_at: string
          id: string
          program_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["registration_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          application_notes?: string | null
          created_at?: string
          id?: string
          program_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          application_notes?: string | null
          created_at?: string
          id?: string
          program_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_registrations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "sports_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_programs: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string
          eligibility_criteria: string | null
          end_date: string | null
          fee: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          max_participants: number | null
          sport_category: Database["public"]["Enums"]["sport_category"]
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description: string
          eligibility_criteria?: string | null
          end_date?: string | null
          fee?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          max_participants?: number | null
          sport_category: Database["public"]["Enums"]["sport_category"]
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string
          eligibility_criteria?: string | null
          end_date?: string | null
          fee?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          max_participants?: number | null
          sport_category?: Database["public"]["Enums"]["sport_category"]
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      registration_status: "pending" | "approved" | "rejected"
      sport_category:
        | "cricket"
        | "football"
        | "basketball"
        | "tennis"
        | "badminton"
        | "hockey"
        | "kabaddi"
        | "athletics"
        | "swimming"
        | "other"
      user_type: "athlete" | "fan" | "admin"
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
    Enums: {
      registration_status: ["pending", "approved", "rejected"],
      sport_category: [
        "cricket",
        "football",
        "basketball",
        "tennis",
        "badminton",
        "hockey",
        "kabaddi",
        "athletics",
        "swimming",
        "other",
      ],
      user_type: ["athlete", "fan", "admin"],
    },
  },
} as const
