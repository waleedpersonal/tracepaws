// app/api/billing/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { TracePawsBilling } from '@/lib/billing/stripe-integration'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { organizationId, priceId, planTier, billingInterval } = await request.json()

    if (!organizationId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields: organizationId, priceId' },
        { status: 400 }
      )
    }

    // Get organization details
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id, name, email, stripe_customer_id')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    let customerId = org.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customerResult = await TracePawsBilling.createCustomerWithTrial(
        organizationId,
        org.email || `contact@${organizationId}.tracepaws.com`,
        org.name,
        { plan_tier: planTier, billing_interval: billingInterval }
      )
      customerId = customerResult.customerId
    }

    // Create checkout session
    const session = await TracePawsBilling.createCheckoutSession(
      customerId,
      priceId,
      organizationId,
      `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      `${process.env.NEXT_PUBLIC_APP_URL}/billing/canceled`
    )

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}