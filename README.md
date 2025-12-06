# 🐾 TracePaws - Chain of Custody Software for Pet Crematoriums

> **Professional documentation and tracking software that protects crematoriums and gives families peace of mind**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/waleedpersonal/tracepaws)

---

## 🎯 **What is TracePaws?**

TracePaws is a **B2B SaaS application** that helps pet crematoriums document every step of the cremation process with photos and timestamps. It provides families with a real-time tracking page and protects crematoriums with legal-grade audit trails.

**Problem Solved:** Pet crematoriums have no way to prove individual cremation to families. One accusation = business destroyed.

**Solution:** Photo + timestamp documentation at every step + family tracking page = trust + protection.

---

## 🏗️ **Technical Architecture**

### **Tech Stack**
- **Frontend:** Next.js 14 (App Router) + React 19 + TypeScript
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL) with RLS policies
- **Auth:** Supabase Auth (multi-tenant)
- **Payments:** Stripe (subscriptions + usage billing)
- **Storage:** Cloudflare R2 (photos)
- **Email/SMS:** Resend + Twilio
- **Hosting:** Vercel (auto-scaling)
- **Styling:** Tailwind CSS + Custom design system

### **Database Design**
- **8 core tables** with complete relationships
- **Multi-tenant isolation** (10,000+ organizations)
- **Usage-based billing** integration
- **Auto-generated tracking IDs** (PR-2024-NNNNNN)
- **Status workflow enforcement**
- **Complete audit trails**

### **Billing System**
- **3 subscription tiers:** $79, $179, $349/month
- **Usage-based overage:** $1.50/$1.00 per pet over limits
- **14-day free trials**
- **Annual discounts** (17% savings)
- **Complete Stripe integration**

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Supabase account
- Stripe account
- Vercel account (for deployment)

### **1. Clone and Install**
```bash
git clone https://github.com/waleedpersonal/tracepaws.git
cd tracepaws
npm install
```

### **2. Environment Setup**
```bash
cp .env.example .env.local
# Fill in your credentials
```

### **3. Database Setup**
1. Go to your Supabase project → SQL Editor
2. Copy `database/complete-setup.sql` 
3. Paste and run in SQL Editor
4. Run `database/validate-setup.sql` to verify

### **4. Development**
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📊 **Features & Capabilities**

### **For Crematorium Staff**
- ✅ **Pet intake** with photo capture
- ✅ **Workflow guidance** (status transitions)
- ✅ **Team management** (role-based access)
- ✅ **Dashboard** with today's queue
- ✅ **Search & filtering** across all pets
- ✅ **Mobile-optimized** for floor operations

### **For Pet Families**
- ✅ **Real-time tracking** page (no login required)
- ✅ **Photo timeline** of their pet's journey
- ✅ **Automatic notifications** (email + SMS)
- ✅ **Certificate download**
- ✅ **Mobile-responsive** design

### **For Business Owners**
- ✅ **Complete audit trails** (legal protection)
- ✅ **Usage analytics** and reporting
- ✅ **Billing management** (Stripe integration)
- ✅ **Team management** and permissions
- ✅ **Multi-location support**

---

## 💳 **Billing & Subscriptions**

### **Subscription Plans**
- **Starter:** $79/month (75 pets included, $1.50 overage)
- **Growth:** $179/month (250 pets included, $1.00 overage)  
- **Pro:** $349/month (unlimited pets, no overage)

### **Features**
- ✅ **14-day free trials** for all plans
- ✅ **Annual discounts** (2 months free)
- ✅ **Usage-based billing** for overage charges
- ✅ **Customer portal** for self-service
- ✅ **Webhook automation** for subscription lifecycle

---

## 🗂️ **Repository Structure**

```
tracepaws/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API endpoints
│   │   ├── billing/       # Stripe integration
│   │   └── webhooks/      # Stripe webhooks
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── lib/                   # Core libraries
│   ├── supabase/          # Database integration
│   ├── billing/           # Stripe integration
│   └── utils.ts           # Helper functions
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── forms/             # Form components
├── database/              # Database setup scripts
│   ├── complete-setup.sql # Full database setup
│   ├── validate-setup.sql # Verification tests
│   └── README.md          # Database documentation
└── docs/                  # Additional documentation
```

---

## 🛡️ **Security & Compliance**

### **Data Protection**
- ✅ **Row Level Security** (multi-tenant isolation)
- ✅ **Encrypted storage** (photos and sensitive data)
- ✅ **Audit trails** (complete accountability)
- ✅ **GDPR compliance** ready
- ✅ **Role-based permissions**

### **Business Compliance**
- ✅ **Legal-grade documentation**
- ✅ **Tamper-proof timestamps**
- ✅ **Chain of custody proof**
- ✅ **Photo evidence preservation**
- ✅ **Staff accountability tracking**

---

## 📈 **Performance & Scale**

### **Performance Targets**
- **Dashboard load:** <500ms
- **Pet search:** <100ms  
- **Tracking page:** <1 second
- **Photo upload:** <5 seconds

### **Scale Architecture**
- **Organizations:** 10,000+ (multi-tenant)
- **Users:** 50,000+ (staff members)
- **Pets:** 2M+ annually
- **Photos:** 48M+ annually
- **Concurrent users:** 5,000+

---

## 🚀 **Deployment**

### **Branch Strategy**
- **main** - Development branch
- **staging** - Pre-production testing  
- **production** - Live customer-facing

### **Vercel Deployment**
```bash
# Connect to Vercel
npx vercel

# Deploy staging
git push origin staging

# Deploy production  
git push origin production
```

### **Environment Variables Required**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (production ready)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App configuration
NEXT_PUBLIC_APP_URL=https://app.tracepaws.com
```

---

## 📚 **Documentation**

- **Database Design:** `/database-design/` folder (13 comprehensive specs)
- **Stripe Integration:** `STRIPE_INTEGRATION_MASTERCLASS.md`
- **API Documentation:** Generated from code
- **Deployment Guide:** Coming soon

---

## 🎯 **Business Model**

**Target Market:** 4,000+ small-medium pet crematoriums (US, UK, Canada, Australia)  
**Revenue Model:** SaaS subscriptions + usage-based billing  
**Goal:** $2M MRR in 12 months  
**Competitive Advantage:** 80% cheaper than enterprise solutions, built for SMB

---

## 👥 **Contributing**

This is a private business project. For questions or support:
- **Email:** contact@tracepaws.com
- **Documentation:** See `/docs` folder
- **Issues:** Use GitHub Issues for bug reports

---

## 📄 **License**

MIT License - see LICENSE file for details.

---

**Built with ❤️ for pet crematoriums and the families they serve.**

*TracePaws - Every pet deserves a dignified farewell, and every family deserves proof it happened.*