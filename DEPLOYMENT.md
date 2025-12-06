# TracePaws Deployment Guide

> **Production deployment instructions for staging and production environments**

---

## 🌟 **Branch Strategy**

### **main** (Development)
- **Purpose:** Active development and feature branches
- **Deployment:** Auto-deploy to `dev.tracepaws.com`
- **Database:** Development Supabase project
- **Stripe:** Test mode
- **Features:** All features enabled, test data loaded

### **staging** (Pre-Production)
- **Purpose:** Final testing before production release
- **Deployment:** Auto-deploy to `staging.tracepaws.com`
- **Database:** Staging Supabase project (production-like)
- **Stripe:** Test mode with production webhooks
- **Features:** Production features, minimal test data

### **production** (Live)
- **Purpose:** Live customer-facing application
- **Deployment:** Manual deploy to `app.tracepaws.com`
- **Database:** Production Supabase project
- **Stripe:** Live mode
- **Features:** Production-ready, no test data

---

## 🔧 **Environment Configuration**

### **Development (.env.local)**
```bash
# Supabase (Development)
NEXT_PUBLIC_SUPABASE_URL=https://yplmrwismtztyomrvzvj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=dev_service_key

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Staging (Vercel Environment)**
```bash
# Supabase (Staging)
NEXT_PUBLIC_SUPABASE_URL=staging_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=staging_service_key

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_staging_...

# App URLs
NEXT_PUBLIC_APP_URL=https://staging.tracepaws.com
```

### **Production (Vercel Environment)**
```bash
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=production_anon_key
SUPABASE_SERVICE_ROLE_KEY=production_service_key

# Stripe (LIVE MODE)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

# App URLs  
NEXT_PUBLIC_APP_URL=https://app.tracepaws.com
```

---

## 🚀 **Deployment Process**

### **To Staging**
1. **Merge to staging branch:**
   ```bash
   git checkout staging
   git merge main
   git push origin staging
   ```

2. **Vercel auto-deploys** to `staging.tracepaws.com`

3. **Test complete flow:**
   - User registration and login
   - Pet intake and workflow
   - Stripe checkout (test mode)
   - Webhook processing
   - Family tracking pages

### **To Production**
1. **Verify staging** is working perfectly

2. **Merge to production branch:**
   ```bash
   git checkout production
   git merge staging
   git push origin production
   ```

3. **Manual verification required** before going live

4. **Update Stripe webhooks** with production URL

5. **Monitor deployment** for any issues

---

## 🔍 **Pre-Deployment Checklist**

### **Database Ready**
- [ ] Supabase project created
- [ ] `complete-setup.sql` executed successfully
- [ ] `validate-setup.sql` passes all tests
- [ ] RLS policies active
- [ ] Test data appropriate for environment

### **Stripe Ready**
- [ ] Products and pricing created
- [ ] Webhook endpoints configured
- [ ] API keys added to environment
- [ ] Test transactions working

### **Application Ready**
- [ ] All environment variables set
- [ ] Build passes (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)

### **Domain & DNS**
- [ ] Domain configured in Vercel
- [ ] SSL certificate active
- [ ] Custom domain pointing to deployment

---

## 🔧 **Monitoring & Maintenance**

### **Health Checks**
- **Database:** Run `database/monitor-database.sql` weekly
- **Stripe:** Monitor webhook delivery and payment failures
- **Application:** Vercel analytics and error tracking
- **Performance:** Core Web Vitals monitoring

### **Backup Strategy**
- **Database:** Supabase automatic backups (daily)
- **Code:** GitHub repository (versioned)
- **Environment:** Document all configuration changes
- **Stripe:** Webhook event logs and audit trails

---

## 🎯 **Success Metrics**

### **Technical KPIs**
- **Uptime:** >99.9%
- **Response time:** <2 seconds average
- **Error rate:** <0.1%
- **Build success:** >95%

### **Business KPIs**
- **Trial → Paid conversion:** >30%
- **Monthly churn:** <5%
- **Usage per customer:** >50 pets/month
- **Customer satisfaction:** >4.5/5

---

## 🚨 **Incident Response**

### **Production Issues**
1. **Check Vercel deployment** status
2. **Verify Supabase** database health
3. **Check Stripe webhook** delivery
4. **Review error logs** in Vercel dashboard
5. **Rollback if necessary** to last known good version

### **Database Issues**
1. **Check Supabase dashboard** for alerts
2. **Run monitoring queries** from `database/monitor-database.sql`
3. **Verify RLS policies** are active
4. **Check connection limits** and performance

---

**Ready for $2M MRR scale!** 🚀