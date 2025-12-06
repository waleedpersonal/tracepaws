// lib/billing/stripe-config.ts
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'TracePaws',
    version: '1.0.0',
    url: 'https://tracepaws.com'
  }
})

// Production Stripe Price IDs (REAL LIVE PRICES)
export const STRIPE_PRICES = {
  starter: {
    monthly: 'price_1SbMluDQ3Ykl2FjylJKbpC3D', // $79.00
    annual: 'price_1SbMluDQ3Ykl2FjyC6jExKaO',  // $790.00
    overage: 'price_1SbONrDQ3Ykl2FjyB0ajwB3e' // $1.50/pet over 75
  },
  growth: {
    monthly: 'price_1SbMrZDQ3Ykl2FjyxlJeDcwh', // $179.00
    annual: 'price_1SbMrZDQ3Ykl2Fjy2w1EKIPo',  // $1,790.00
    overage: 'price_1SbOOCDQ3Ykl2FjyOyJshDFD'  // $1.00/pet over 250
  },
  pro: {
    monthly: 'price_1SbMwfDQ3Ykl2Fjydt1g7f4w', // $349.00
    annual: 'price_1SbMwfDQ3Ykl2FjyllDFeutb'   // $3,490.00 (unlimited pets)
  }
} as const

// Plan Configuration
export const PLAN_CONFIG = {
  starter: {
    name: 'TracePaws Starter',
    pets_included: 75,
    overage_rate: 1.50,
    monthly_price: 7900,
    annual_price: 79000,
    features: [
      'Photo documentation',
      'Family tracking pages', 
      'Email notifications',
      'QR code labels',
      '1 staff account',
      'Basic support'
    ]
  },
  growth: {
    name: 'TracePaws Growth',
    pets_included: 250,
    overage_rate: 1.00,
    monthly_price: 17900,
    annual_price: 179000,
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'SMS notifications',
      'Certificates',
      'Team management',
      '5 staff accounts',
      'Analytics',
      'Priority support'
    ]
  },
  pro: {
    name: 'TracePaws Pro',
    pets_included: -1, // Unlimited
    overage_rate: 0,
    monthly_price: 34900,
    annual_price: 349000,
    features: [
      'Everything in Growth',
      'Unlimited pets',
      'Unlimited staff',
      'Custom branding',
      'API access',
      'Dedicated support',
      'Phone support'
    ]
  }
} as const

export type PlanTier = keyof typeof PLAN_CONFIG
export type BillingInterval = 'monthly' | 'annual'