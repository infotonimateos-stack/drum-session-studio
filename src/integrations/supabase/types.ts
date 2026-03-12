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
      historical_clients: {
        Row: {
          address: string | null
          alt_names: string[] | null
          bands: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          emails: string[] | null
          first_session: string | null
          id: number
          last_session: string | null
          name: string
          nif: string | null
          notes: string[] | null
          organization: string | null
          phones: string[] | null
          roles: string[] | null
          sessions: number | null
          sources: string[] | null
          total_revenue: number | null
        }
        Insert: {
          address?: string | null
          alt_names?: string[] | null
          bands?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          emails?: string[] | null
          first_session?: string | null
          id?: number
          last_session?: string | null
          name: string
          nif?: string | null
          notes?: string[] | null
          organization?: string | null
          phones?: string[] | null
          roles?: string[] | null
          sessions?: number | null
          sources?: string[] | null
          total_revenue?: number | null
        }
        Update: {
          address?: string | null
          alt_names?: string[] | null
          bands?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          emails?: string[] | null
          first_session?: string | null
          id?: number
          last_session?: string | null
          name?: string
          nif?: string | null
          notes?: string[] | null
          organization?: string | null
          phones?: string[] | null
          roles?: string[] | null
          sessions?: number | null
          sources?: string[] | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      invoice_counters: {
        Row: {
          last_number: number
          series: string
        }
        Insert: {
          last_number?: number
          series: string
        }
        Update: {
          last_number?: number
          series?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          base_price: number
          billing_email: string | null
          billing_phone: string | null
          business_name: string | null
          city: string | null
          client_type: string
          contact_email: string | null
          country_code: string
          created_at: string
          currency: string
          deadline: string | null
          email_sent_at: string | null
          email_status: string
          files_detected_at: string | null
          files_detection_method: string | null
          files_last_checked_at: string | null
          files_status: string
          first_name: string | null
          full_address: string | null
          id: string
          invoice_number: string | null
          invoice_series: string | null
          is_professional_invoice: boolean
          items: Json
          last_name: string | null
          payment_id: string | null
          payment_method: string
          payment_status: string
          paypal_fee: number
          paypal_payer_info: Json | null
          postal_code: string | null
          song_count: number
          state_province: string | null
          subtotal: number
          tax_amount: number
          tax_rate: number
          tax_rule: string
          total: number
          vat_number: string | null
          vies_response: Json | null
          vies_valid: boolean | null
          work_notes: string | null
          work_status: string
        }
        Insert: {
          base_price: number
          billing_email?: string | null
          billing_phone?: string | null
          business_name?: string | null
          city?: string | null
          client_type: string
          contact_email?: string | null
          country_code: string
          created_at?: string
          currency?: string
          deadline?: string | null
          email_sent_at?: string | null
          email_status?: string
          files_detected_at?: string | null
          files_detection_method?: string | null
          files_last_checked_at?: string | null
          files_status?: string
          first_name?: string | null
          full_address?: string | null
          id?: string
          invoice_number?: string | null
          invoice_series?: string | null
          is_professional_invoice?: boolean
          items?: Json
          last_name?: string | null
          payment_id?: string | null
          payment_method: string
          payment_status?: string
          paypal_fee?: number
          paypal_payer_info?: Json | null
          postal_code?: string | null
          song_count?: number
          state_province?: string | null
          subtotal: number
          tax_amount?: number
          tax_rate?: number
          tax_rule: string
          total: number
          vat_number?: string | null
          vies_response?: Json | null
          vies_valid?: boolean | null
          work_notes?: string | null
          work_status?: string
        }
        Update: {
          base_price?: number
          billing_email?: string | null
          billing_phone?: string | null
          business_name?: string | null
          city?: string | null
          client_type?: string
          contact_email?: string | null
          country_code?: string
          created_at?: string
          currency?: string
          deadline?: string | null
          email_sent_at?: string | null
          email_status?: string
          files_detected_at?: string | null
          files_detection_method?: string | null
          files_last_checked_at?: string | null
          files_status?: string
          first_name?: string | null
          full_address?: string | null
          id?: string
          invoice_number?: string | null
          invoice_series?: string | null
          is_professional_invoice?: boolean
          items?: Json
          last_name?: string | null
          payment_id?: string | null
          payment_method?: string
          payment_status?: string
          paypal_fee?: number
          paypal_payer_info?: Json | null
          postal_code?: string | null
          song_count?: number
          state_province?: string | null
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          tax_rule?: string
          total?: number
          vat_number?: string | null
          vies_response?: Json | null
          vies_valid?: boolean | null
          work_notes?: string | null
          work_status?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          base_price: number
          business_name: string | null
          city: string | null
          client_type: string
          contact_email: string | null
          converted_order_id: string | null
          country_code: string
          created_at: string
          first_name: string | null
          full_address: string | null
          id: string
          items: Json
          last_name: string | null
          notes: string | null
          payment_terms: string | null
          phone: string | null
          postal_code: string | null
          quote_number: string
          song_count: number
          state_province: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          tax_rule: string
          total: number
          valid_until: string | null
          validity_days: number
          vat_number: string | null
        }
        Insert: {
          base_price?: number
          business_name?: string | null
          city?: string | null
          client_type?: string
          contact_email?: string | null
          converted_order_id?: string | null
          country_code?: string
          created_at?: string
          first_name?: string | null
          full_address?: string | null
          id?: string
          items?: Json
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          quote_number: string
          song_count?: number
          state_province?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          tax_rule?: string
          total?: number
          valid_until?: string | null
          validity_days?: number
          vat_number?: string | null
        }
        Update: {
          base_price?: number
          business_name?: string | null
          city?: string | null
          client_type?: string
          contact_email?: string | null
          converted_order_id?: string | null
          country_code?: string
          created_at?: string
          first_name?: string | null
          full_address?: string | null
          id?: string
          items?: Json
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          quote_number?: string
          song_count?: number
          state_province?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          tax_rule?: string
          total?: number
          valid_until?: string | null
          validity_days?: number
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_converted_order_id_fkey"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_invoice_number: { Args: { p_series?: string }; Returns: string }
      match_historical_clients: {
        Args: { p_emails: string[]; p_phones: string[] }
        Returns: {
          address: string | null
          alt_names: string[] | null
          bands: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          emails: string[] | null
          first_session: string | null
          id: number
          last_session: string | null
          name: string
          nif: string | null
          notes: string[] | null
          organization: string | null
          phones: string[] | null
          roles: string[] | null
          sessions: number | null
          sources: string[] | null
          total_revenue: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "historical_clients"
          isOneToOne: false
          isSetofReturn: true
        }
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
