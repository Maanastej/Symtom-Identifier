export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      disease_reports: {
        Row: {
          city: string | null
          confidence_score: number | null
          disease_id: string
          id: string
          location_lat: number
          location_lng: number
          reported_at: string
          state: string | null
          status: string | null
          symptoms_reported: string[]
          user_id: string | null
        }
        Insert: {
          city?: string | null
          confidence_score?: number | null
          disease_id: string
          id?: string
          location_lat: number
          location_lng: number
          reported_at?: string
          state?: string | null
          status?: string | null
          symptoms_reported?: string[]
          user_id?: string | null
        }
        Update: {
          city?: string | null
          confidence_score?: number | null
          disease_id?: string
          id?: string
          location_lat?: number
          location_lng?: number
          reported_at?: string
          state?: string | null
          status?: string | null
          symptoms_reported?: string[]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disease_reports_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      diseases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_communicable: boolean | null
          medications: string[] | null
          name: string
          precautions: string[] | null
          severity: string | null
          symptoms: string[]
          transmission_rate: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_communicable?: boolean | null
          medications?: string[] | null
          name: string
          precautions?: string[] | null
          severity?: string | null
          symptoms?: string[]
          transmission_rate?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_communicable?: boolean | null
          medications?: string[] | null
          name?: string
          precautions?: string[] | null
          severity?: string | null
          symptoms?: string[]
          transmission_rate?: number | null
        }
        Relationships: []
      }
      epidemic_alerts: {
        Row: {
          alert_level: string | null
          case_count: number
          created_at: string
          disease_id: string
          id: string
          region: string
          threshold_exceeded: boolean | null
          updated_at: string
        }
        Insert: {
          alert_level?: string | null
          case_count?: number
          created_at?: string
          disease_id: string
          id?: string
          region: string
          threshold_exceeded?: boolean | null
          updated_at?: string
        }
        Update: {
          alert_level?: string | null
          case_count?: number
          created_at?: string
          disease_id?: string
          id?: string
          region?: string
          threshold_exceeded?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "epidemic_alerts_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          blood_oxygen: number | null
          body_temperature: number | null
          calories_burned: number | null
          created_at: string
          heart_rate: number | null
          id: string
          notes: string | null
          recorded_at: string
          sleep_hours: number | null
          sleep_quality: string | null
          steps: number | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          blood_oxygen?: number | null
          body_temperature?: number | null
          calories_burned?: number | null
          created_at?: string
          heart_rate?: number | null
          id?: string
          notes?: string | null
          recorded_at?: string
          sleep_hours?: number | null
          sleep_quality?: string | null
          steps?: number | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          blood_oxygen?: number | null
          body_temperature?: number | null
          calories_burned?: number | null
          created_at?: string
          heart_rate?: number | null
          id?: string
          notes?: string | null
          recorded_at?: string
          sleep_hours?: number | null
          sleep_quality?: string | null
          steps?: number | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avg_sleep_hours: number | null
          avg_spo2: number | null
          blood_group: string | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          city: string | null
          created_at: string
          full_name: string | null
          height_cm: number | null
          id: string
          is_admin: boolean | null
          location_lat: number | null
          location_lng: number | null
          phone: string | null
          resting_bpm: number | null
          state: string | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          avg_sleep_hours?: number | null
          avg_spo2?: number | null
          blood_group?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          height_cm?: number | null
          id?: string
          is_admin?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          resting_bpm?: number | null
          state?: string | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          avg_sleep_hours?: number | null
          avg_spo2?: number | null
          blood_group?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          height_cm?: number | null
          id?: string
          is_admin?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          resting_bpm?: number | null
          state?: string | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
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
