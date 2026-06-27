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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
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
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          country: string
          created_at: string
          hero_title: string
          intro: string
          name: string
          region: string
          seo_description: string
          slug: string
        }
        Insert: {
          country?: string
          created_at?: string
          hero_title: string
          intro: string
          name: string
          region: string
          seo_description: string
          slug: string
        }
        Update: {
          country?: string
          created_at?: string
          hero_title?: string
          intro?: string
          name?: string
          region?: string
          seo_description?: string
          slug?: string
        }
        Relationships: []
      }
      trainer_profiles: {
        Row: {
          city_slug: string
          contact_info: string
          created_at: string
          display_name: string
          headline: string
          hidden_contact_hint: string
          id: string
          is_published: boolean
          languages: string[]
          long_bio: string
          modalities: string[]
          photo_url: string | null
          price_from: number
          rating: number
          review_status: string
          reviews_count: number
          short_bio: string
          slug: string
          specialties: string[]
          stripe_customer_id: string | null
          subscription_status: string
          user_id: string | null
          verified: boolean
          years_experience: number
        }
        Insert: {
          city_slug: string
          contact_info?: string
          created_at?: string
          display_name: string
          headline: string
          hidden_contact_hint?: string
          id?: string
          is_published?: boolean
          languages?: string[]
          long_bio: string
          modalities?: string[]
          photo_url?: string | null
          price_from?: number
          rating?: number
          review_status?: string
          reviews_count?: number
          short_bio: string
          slug: string
          specialties?: string[]
          stripe_customer_id?: string | null
          subscription_status?: string
          user_id?: string | null
          verified?: boolean
          years_experience?: number
        }
        Update: {
          city_slug?: string
          contact_info?: string
          created_at?: string
          display_name?: string
          headline?: string
          hidden_contact_hint?: string
          id?: string
          is_published?: boolean
          languages?: string[]
          long_bio?: string
          modalities?: string[]
          photo_url?: string | null
          price_from?: number
          rating?: number
          review_status?: string
          reviews_count?: number
          short_bio?: string
          slug?: string
          specialties?: string[]
          stripe_customer_id?: string | null
          subscription_status?: string
          user_id?: string | null
          verified?: boolean
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "trainer_profiles_city_slug_fkey"
            columns: ["city_slug"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      trainer_profiles_public: {
        Row: {
          city_slug: string | null
          created_at: string | null
          display_name: string | null
          headline: string | null
          hidden_contact_hint: string | null
          id: string | null
          is_published: boolean | null
          languages: string[] | null
          long_bio: string | null
          modalities: string[] | null
          photo_url: string | null
          price_from: number | null
          rating: number | null
          review_status: string | null
          reviews_count: number | null
          short_bio: string | null
          slug: string | null
          specialties: string[] | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          city_slug?: string | null
          created_at?: string | null
          display_name?: string | null
          headline?: string | null
          hidden_contact_hint?: string | null
          id?: string | null
          is_published?: boolean | null
          languages?: string[] | null
          long_bio?: string | null
          modalities?: string[] | null
          photo_url?: string | null
          price_from?: number | null
          rating?: number | null
          review_status?: string | null
          reviews_count?: number | null
          short_bio?: string | null
          slug?: string | null
          specialties?: string[] | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          city_slug?: string | null
          created_at?: string | null
          display_name?: string | null
          headline?: string | null
          hidden_contact_hint?: string | null
          id?: string | null
          is_published?: boolean | null
          languages?: string[] | null
          long_bio?: string | null
          modalities?: string[] | null
          photo_url?: string | null
          price_from?: number | null
          rating?: number | null
          review_status?: string | null
          reviews_count?: number | null
          short_bio?: string | null
          slug?: string | null
          specialties?: string[] | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_profiles_city_slug_fkey"
            columns: ["city_slug"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["slug"]
          },
        ]
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
