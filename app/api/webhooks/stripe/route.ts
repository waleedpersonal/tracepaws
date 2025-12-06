// app/api/webhooks/stripe/route.ts - Complete webhook handler
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { stripe } from '@/lib/billing/stripe-config'
import { TracePawsBilling } from '@/lib/billing/stripe-integration'
import { supabaseAdmin } from '@/lib/supabase/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    // Get request body and signature
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log(`Processing webhook: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Webhook event handlers
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organization_id
  
  if (!organizationId) {
    console.error('No organization_id in checkout session metadata')
    return
  }

  await supabaseAdmin
    .from('organizations')
    .update({
      subscription_status: 'active',
      trial_ends_at: null
    })
    .eq('id', organizationId)

  await TracePawsBilling.logBillingEvent({
    event_type: 'trial_converted',
    organization_id: organizationId,
    stripe_customer_id: session.customer as string,
    details: {
      session_id: session.id,
      amount_total: session.amount_total,
      currency: session.currency
    }
  })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  await TracePawsBilling.handleSubscriptionSuccess(subscription)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organization_id
  
  if (!organizationId) return

  const planTier = TracePawsBilling.getPlanTierFromPrice(subscription.items.data[0].price.id)
  
  await supabaseAdmin
    .from('organizations')
    .update({
      subscription_status: subscription.status as any,
      subscription_plan: planTier,
      updated_at: new Date().toISOString()
    })
    .eq('id', organizationId)

  await TracePawsBilling.logBillingEvent({
    event_type: 'subscription_updated',
    organization_id: organizationId,
    stripe_subscription_id: subscription.id,
    details: {
      new_status: subscription.status,
      new_plan: planTier,
      change_reason: 'stripe_webhook_update'
    }
  })
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organization_id
  
  if (!organizationId) return

  await supabaseAdmin
    .from('organizations')
    .update({
      subscription_status: 'canceled',
      trial_ends_at: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', organizationId)

  await TracePawsBilling.logBillingEvent({
    event_type: 'subscription_canceled',
    organization_id: organizationId,
    stripe_subscription_id: subscription.id,
    details: {
      cancellation_reason: subscription.cancellation_details?.reason || 'unknown',
      canceled_at: new Date((subscription.canceled_at || Date.now() / 1000) * 1000).toISOString()
    }
  })
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  const { data: org } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!org) return

  await TracePawsBilling.logBillingEvent({
    event_type: 'payment_successful',
    organization_id: org.id,
    stripe_customer_id: customerId,
    details: {
      invoice_id: invoice.id,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      billing_period: {
        start: new Date((invoice.period_start || 0) * 1000).toISOString(),
        end: new Date((invoice.period_end || 0) * 1000).toISOString()
      }
    }
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  const { data: org } = await supabaseAdmin
    .from('organizations')
    .select('id, name')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!org) return

  await supabaseAdmin
    .from('organizations')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('id', org.id)

  await TracePawsBilling.logBillingEvent({
    event_type: 'payment_failed',
    organization_id: org.id,
    stripe_customer_id: customerId,
    details: {
      invoice_id: invoice.id,
      amount_due: invoice.amount_due,
      currency: invoice.currency,
      failure_reason: invoice.last_finalization_error?.message || 'unknown',
      attempt_count: invoice.attempt_count
    }
  })
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organization_id
  
  if (!organizationId) return

  await TracePawsBilling.logBillingEvent({
    event_type: 'trial_ending_soon',
    organization_id: organizationId,
    stripe_subscription_id: subscription.id,
    details: {
      trial_end: subscription.trial_end ? 
        new Date(subscription.trial_end * 1000).toISOString() : null,
      days_until_end: subscription.trial_end ? 
        Math.ceil((subscription.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)) : 0
    }
  })
}