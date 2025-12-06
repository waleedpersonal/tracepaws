// lib/billing/stripe-integration.ts
import Stripe from 'stripe'
import { stripe, PLAN_CONFIG, PlanTier } from './stripe-config'
import { supabaseAdmin } from '@/lib/supabase/server'

export class TracePawsBilling {
  // Create customer and start trial (from masterclass)
  static async createCustomerWithTrial(
    organizationId: string,
    email: string,
    name: string,
    metadata: Record<string, string> = {}
  ) {
    try {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email,
        name,
        description: `TracePaws customer for ${name}`,
        metadata: {
          organization_id: organizationId,
          plan_tier: 'starter', // Default trial plan
          trial_start: new Date().toISOString(),
          ...metadata
        }
      })

      // Update organization with Stripe customer ID
      const { error } = await supabaseAdmin
        .from('organizations')
        .update({
          stripe_customer_id: customer.id,
          subscription_status: 'trialing',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', organizationId)

      if (error) {
        throw new Error(`Failed to update organization: ${error.message}`)
      }

      return {
        customerId: customer.id,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'trialing'
      }
    } catch (error) {
      console.error('Error creating customer with trial:', error)
      throw error
    }
  }

  // Create checkout session for subscription (from masterclass)
  static async createCheckoutSession(
    customerId: string,
    priceId: string,
    organizationId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        mode: 'subscription',
        
        // Trial configuration
        subscription_data: {
          trial_period_days: 14,
          metadata: {
            organization_id: organizationId,
            created_via: 'tracepaws_checkout'
          }
        },
        
        // URL configuration
        success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl,
        
        // Customer experience
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        tax_id_collection: {
          enabled: true
        },
        
        // Metadata for tracking
        metadata: {
          organization_id: organizationId,
          checkout_source: 'tracepaws_app',
          created_at: new Date().toISOString()
        },
        
        // Branding
        custom_text: {
          submit: {
            message: 'Start protecting your crematorium with TracePaws'
          }
        }
      })

      // Log checkout session creation
      await this.logBillingEvent({
        event_type: 'checkout_session_created',
        organization_id: organizationId,
        stripe_customer_id: customerId,
        details: {
          session_id: session.id,
          price_id: priceId,
          amount: session.amount_total,
          currency: session.currency
        }
      })

      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  // Handle successful subscription creation (from masterclass)
  static async handleSubscriptionSuccess(subscription: Stripe.Subscription) {
    try {
      const organizationId = subscription.metadata.organization_id
      
      if (!organizationId) {
        throw new Error('No organization_id in subscription metadata')
      }

      // Get subscription details
      const subscriptionItem = subscription.items.data[0]
      const price = subscriptionItem.price
      const planTier = this.getPlanTierFromPrice(price.id)
      
      // Update organization subscription status
      const { error: orgError } = await supabaseAdmin
        .from('organizations')
        .update({
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status as any,
          subscription_plan: planTier,
          trial_ends_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId)

      if (orgError) {
        throw new Error(`Failed to update organization subscription: ${orgError.message}`)
      }

      // Log subscription activation
      await this.logBillingEvent({
        event_type: 'subscription_activated',
        organization_id: organizationId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        details: {
          plan_tier: planTier,
          amount: subscriptionItem.price.unit_amount,
          currency: subscriptionItem.price.currency,
          billing_cycle: subscriptionItem.price.recurring?.interval,
          trial_used: subscription.trial_end ? true : false
        }
      })

      return {
        success: true,
        planTier,
        subscriptionId: subscription.id
      }
    } catch (error) {
      console.error('Error handling subscription success:', error)
      throw error
    }
  }

  // Usage tracking and overage billing (from masterclass)
  static async trackUsageAndBilling(organizationId: string) {
    try {
      // Get organization subscription details
      const { data: org, error: orgError } = await supabaseAdmin
        .from('organizations')
        .select('stripe_subscription_id, subscription_plan')
        .eq('id', organizationId)
        .single()

      if (orgError || !org.stripe_subscription_id) {
        throw new Error('Organization subscription not found')
      }

      // Get current month usage from database
      const { data: usage } = await supabaseAdmin
        .rpc('get_monthly_usage', { org_id: organizationId })

      if (!usage || usage.length === 0) {
        return { usage: 0, overage: 0, charges: 0 }
      }

      const monthlyUsage = usage[0]
      const planLimits = this.getPlanLimits(org.subscription_plan!)
      
      // Calculate overage
      const overage = Math.max(0, monthlyUsage.pets_processed - planLimits.pets_included)
      const overageCharges = overage * planLimits.overage_rate

      // Log usage tracking
      await this.logBillingEvent({
        event_type: 'usage_tracked',
        organization_id: organizationId,
        details: {
          pets_processed: monthlyUsage.pets_processed,
          plan_limit: planLimits.pets_included,
          overage_pets: overage,
          overage_charges: overageCharges,
          billing_period: 'current_month'
        }
      })

      return {
        usage: monthlyUsage.pets_processed,
        limit: planLimits.pets_included,
        overage,
        overageCharges,
        utilizationPercent: planLimits.pets_included > 0 ? 
          (monthlyUsage.pets_processed / planLimits.pets_included) * 100 : 0
      }
    } catch (error) {
      console.error('Error tracking usage and billing:', error)
      throw error
    }
  }

  // Helper: Get plan limits configuration (from masterclass)
  static getPlanLimits(planTier: string) {
    const limits = {
      starter: { pets_included: 75, overage_rate: 1.50 },
      growth: { pets_included: 250, overage_rate: 1.00 },
      pro: { pets_included: -1, overage_rate: 0 } // Unlimited
    }
    
    return limits[planTier as keyof typeof limits] || limits.starter
  }

  // Helper: Get plan tier from Stripe price ID (REAL PRODUCTION IDs)
  static getPlanTierFromPrice(priceId: string): PlanTier {
    const priceToTierMap: Record<string, PlanTier> = {
      // Starter prices
      'price_1SbMluDQ3Ykl2FjylJKbpC3D': 'starter', // Monthly $79
      'price_1SbMluDQ3Ykl2FjyC6jExKaO': 'starter', // Annual $790
      
      // Growth prices  
      'price_1SbMrZDQ3Ykl2FjyxlJeDcwh': 'growth', // Monthly $179
      'price_1SbMrZDQ3Ykl2Fjy2w1EKIPo': 'growth', // Annual $1790
      
      // Pro prices
      'price_1SbMwfDQ3Ykl2Fjydt1g7f4w': 'pro', // Monthly $349
      'price_1SbMwfDQ3Ykl2FjyllDFeutb': 'pro', // Annual $3490
      
      // Overage prices
      'price_1SbONrDQ3Ykl2FjyB0ajwB3e': 'starter', // Starter overage $1.50
      'price_1SbOOCDQ3Ykl2FjyOyJshDFD': 'growth'   // Growth overage $1.00
    }
    
    return priceToTierMap[priceId] || 'starter'
  }

  // Helper: Log billing events for audit trail
  static async logBillingEvent(event: {
    event_type: string
    organization_id?: string
    stripe_customer_id?: string
    stripe_subscription_id?: string
    details: Record<string, any>
  }) {
    try {
      const { error } = await supabaseAdmin
        .from('billing_events')
        .insert({
          event_type: event.event_type,
          organization_id: event.organization_id,
          stripe_customer_id: event.stripe_customer_id,
          stripe_subscription_id: event.stripe_subscription_id,
          details: event.details
        })

      if (error) {
        console.error('Failed to log billing event:', error)
      }
    } catch (error) {
      console.error('Error logging billing event:', error)
    }
  }
}