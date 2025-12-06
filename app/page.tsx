// app/page.tsx - TracePaws Landing Page
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Clock, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TP</span>
          </div>
          <span className="font-heading font-bold text-xl">TracePaws</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link href="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
            Chain of Custody Software for 
            <span className="text-primary-600"> Pet Crematoriums</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Document every step with photos and timestamps. Give families peace of mind 
            and protect your business with undeniable proof of individual cremation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link 
              href="/signup" 
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#demo" 
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Watch Demo
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            ✅ 14-day free trial • ✅ No credit card required • ✅ 5-minute setup
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-20">
          <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
            Everything You Need for Chain of Custody
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Photo Documentation</h3>
              <p className="text-gray-600">
                Capture photo evidence at every step of the cremation process
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Family Tracking</h3>
              <p className="text-gray-600">
                Real-time tracking pages for families to follow their pet's journey
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Automated Workflow</h3>
              <p className="text-gray-600">
                Guided workflow prevents mistakes and ensures consistency
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Team Management</h3>
              <p className="text-gray-600">
                Role-based access for owners, admins, and staff members
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="mt-20 text-center">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Starting at $79/month. The first 75 pets are included.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="font-semibold text-xl mb-2">Starter</h3>
              <div className="text-3xl font-bold text-primary-600 mb-4">$79<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />75 pets included</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Photo documentation</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Family tracking</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Email notifications</li>
              </ul>
            </div>

            {/* Growth */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white text-sm px-4 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="font-semibold text-xl mb-2">Growth</h3>
              <div className="text-3xl font-bold text-primary-600 mb-4">$179<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />250 pets included</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Everything in Starter</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />SMS notifications</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Team management</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="font-semibold text-xl mb-2">Pro</h3>
              <div className="text-3xl font-bold text-primary-600 mb-4">$349<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited pets</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Everything in Growth</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Custom branding</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />API access</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <Link 
              href="/pricing" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              View detailed pricing <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">TP</span>
              </div>
              <span className="font-semibold">TracePaws</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 TracePaws. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}