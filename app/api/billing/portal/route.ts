// app/api/billing/portal/route.ts - Customer portal integration
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/billing/stripe-config'
import { TracePawsBilling } from '@/lib/billing/stripe-integration'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { organizationId } = await request.json()
    
    // Get organization's Stripe customer ID
    const { data: org, error } = await supabaseAdmin
      .from('organizations')
      .select('stripe_customer_id, name')
      .eq('id', organizationId)
      .single()

    if (error || !org?.stripe_customer_id) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`
    })

    return NextResponse.json({ 
      portal_url: portalSession.url 
    })
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}

// Get comprehensive billing information for dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    // Get complete billing information
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select(`
        stripe_customer_id, stripe_subscription_id, subscription_status, 
        subscription_plan, trial_ends_at, name
      `)
      .eq('id', organizationId)
      .single()

    if (!org?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing information found' }, { status: 404 })
    }

    // Get Stripe data
    const [customer, subscription, upcomingInvoice, paymentMethods] = await Promise.all([
      stripe.customers.retrieve(org.stripe_customer_id),
      org.stripe_subscription_id ? stripe.subscriptions.retrieve(org.stripe_subscription_id) : null,
      org.stripe_subscription_id ? stripe.invoices.retrieveUpcoming({ 
        customer: org.stripe_customer_id 
      }).catch(() => null) : null,
      stripe.paymentMethods.list({
        customer: org.stripe_customer_id,
        type: 'card'
      })
    ])

    // Get usage information
    const usage = await TracePawsBilling.trackUsageAndBilling(organizationId)

    // Get recent invoices
    const invoices = await stripe.invoices.list({
      customer: org.stripe_customer_id,
      limit: 12
    })

    return NextResponse.json({
      data: {
        customer: {
          id: customer.id,
          email: (customer as any).email,
          name: (customer as any).name,
          created: new Date((customer as any).created * 1000).toISOString()
        },
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          plan: org.subscription_plan,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
        } : null,
        usage: {
          current_month: usage.usage,
          limit: usage.limit,
          overage: usage.overage,
          overage_charges: usage.overageCharges,
          utilization_percent: usage.utilizationPercent
        },
        upcoming_invoice: upcomingInvoice ? {
          amount_due: upcomingInvoice.amount_due,
          currency: upcomingInvoice.currency,
          period_start: new Date(upcomingInvoice.period_start * 1000).toISOString(),
          period_end: new Date(upcomingInvoice.period_end * 1000).toISOString()
        } : null,
        payment_methods: paymentMethods.data.map(pm => ({
          id: pm.id,
          type: pm.type,
          card: pm.card ? {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year
          } : null
        })),
        invoices: invoices.data.slice(0, 6).map(inv => ({
          id: inv.id,
          amount_paid: inv.amount_paid,
          amount_due: inv.amount_due,
          currency: inv.currency,
          status: inv.status,
          created: new Date(inv.created * 1000).toISOString(),
          pdf_url: inv.hosted_invoice_url
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching billing information:', error)
    return NextResponse.json({ error: 'Failed to fetch billing information' }, { status: 500 })
  }
}