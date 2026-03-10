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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_invoice_number: { Args: { p_series?: string }; Returns: string }
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
