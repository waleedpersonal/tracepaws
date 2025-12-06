// lib/supabase/types.ts
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url?: string
          address_line1?: string
          address_line2?: string
          city?: string
          state?: string
          postal_code?: string
          country: string
          phone?: string
          email?: string
          website?: string
          settings: Record<string, any>
          stripe_customer_id?: string
          stripe_subscription_id?: string
          subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
          subscription_plan?: 'starter' | 'growth' | 'pro'
          trial_ends_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string
          address_line1?: string
          address_line2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string
          email?: string
          website?: string
          settings?: Record<string, any>
          stripe_customer_id?: string
          stripe_subscription_id?: string
          subscription_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
          subscription_plan?: 'starter' | 'growth' | 'pro'
          trial_ends_at?: string
        }
        Update: {
          name?: string
          slug?: string
          logo_url?: string
          address_line1?: string
          address_line2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string
          email?: string
          website?: string
          settings?: Record<string, any>
          stripe_customer_id?: string
          stripe_subscription_id?: string
          subscription_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
          subscription_plan?: 'starter' | 'growth' | 'pro'
          trial_ends_at?: string
        }
      }
      users: {
        Row: {
          id: string
          auth_id: string
          organization_id: string
          email: string
          first_name?: string
          last_name?: string
          full_name?: string
          role: 'owner' | 'admin' | 'staff'
          avatar_url?: string
          is_active: boolean
          last_seen_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          organization_id: string
          email: string
          first_name?: string
          last_name?: string
          role?: 'owner' | 'admin' | 'staff'
          avatar_url?: string
          is_active?: boolean
          last_seen_at?: string
        }
        Update: {
          email?: string
          first_name?: string
          last_name?: string
          role?: 'owner' | 'admin' | 'staff'
          avatar_url?: string
          is_active?: boolean
          last_seen_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          organization_id: string
          tracking_id: string
          name: string
          pet_type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
          breed?: string
          weight?: number
          owner_first_name: string
          owner_last_name: string
          owner_full_name?: string
          owner_email: string
          owner_phone?: string
          service_type: 'private' | 'individual' | 'communal'
          instructions?: string
          referring_vet?: string
          status: 'received' | 'prepared' | 'in_chamber' | 'cremated' | 'packaged' | 'ready' | 'completed'
          intake_at: string
          prepared_at?: string
          chamber_entry_at?: string
          cremated_at?: string
          packaged_at?: string
          ready_at?: string
          completed_at?: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          tracking_id?: string
          name: string
          pet_type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
          breed?: string
          weight?: number
          owner_first_name: string
          owner_last_name: string
          owner_email: string
          owner_phone?: string
          service_type: 'private' | 'individual' | 'communal'
          instructions?: string
          referring_vet?: string
          status?: 'received' | 'prepared' | 'in_chamber' | 'cremated' | 'packaged' | 'ready' | 'completed'
          created_by: string
        }
        Update: {
          name?: string
          pet_type?: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
          breed?: string
          weight?: number
          owner_first_name?: string
          owner_last_name?: string
          owner_email?: string
          owner_phone?: string
          service_type?: 'private' | 'individual' | 'communal'
          instructions?: string
          referring_vet?: string
          status?: 'received' | 'prepared' | 'in_chamber' | 'cremated' | 'packaged' | 'ready' | 'completed'
        }
      }
      billing_events: {
        Row: {
          id: string
          event_type: string
          organization_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          details: Record<string, any>
          created_at: string
        }
        Insert: {
          event_type: string
          organization_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          details: Record<string, any>
        }
        Update: {
          event_type?: string
          organization_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          details?: Record<string, any>
        }
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          organization_id: string
          organization_name: string
          subscription_plan: string
          subscription_status: string
          total_pets: number
          pets_received: number
          pets_in_progress: number
          pets_ready: number
          pets_completed: number
          pets_today: number
        }
      }
    }
    Functions: {
      get_monthly_usage: {
        Args: { org_id: string }
        Returns: { pets_processed: number; month: string }[]
      }
      generate_tracking_id: {
        Args: { org_id: string }
        Returns: string
      }
    }
  }
}

// Derived types
export type Organization = Database['public']['Tables']['organizations']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Pet = Database['public']['Tables']['pets']['Row']
export type BillingEvent = Database['public']['Tables']['billing_events']['Row']
export type DashboardStats = Database['public']['Views']['dashboard_stats']['Row']

export type SubscriptionStatus = Organization['subscription_status']
export type SubscriptionPlan = Organization['subscription_plan']
export type PetStatus = Pet['status']
export type UserRole = User['role']