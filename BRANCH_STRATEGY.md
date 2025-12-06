# TracePaws Branch Strategy & Environment Management

> **Professional git workflow for staging and production deployments**

---

## 🌲 **Branch Structure**

```
main (development)
├── feature/auth-system
├── feature/pet-intake  
├── feature/billing-dashboard
│
staging (pre-production)
├── Stable code ready for final testing
├── Production-like environment
├── Real webhook testing
│
production (live)
├── Customer-facing code only
├── Manual deployment required
├── Zero tolerance for bugs
```

---

## 🔄 **Development Workflow**

### **Feature Development**
1. **Create feature branch** from `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Develop and test** locally

3. **Push and create PR** to `main`
   ```bash
   git push origin feature/your-feature-name
   # Create PR via GitHub UI
   ```

4. **Merge to main** after review

### **Staging Deployment**
1. **Test main branch** thoroughly locally

2. **Merge main to staging:**
   ```bash
   git checkout staging
   git merge main
   git push origin staging
   ```

3. **Vercel auto-deploys** to staging environment

4. **Test complete user flows** in staging

### **Production Deployment**
1. **Verify staging** is perfect

2. **Create production release:**
   ```bash
   git checkout production
   git merge staging
   git tag v1.0.x
   git push origin production --tags
   ```

3. **Manual deploy** to production (requires approval)

4. **Monitor deployment** for issues

---

## 🎯 **Environment Differences**

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Database** | Dev Supabase | Staging Supabase | Prod Supabase |
| **Stripe** | Test mode | Test mode | **LIVE mode** |
| **Domain** | localhost:3000 | staging.tracepaws.com | **app.tracepaws.com** |
| **Data** | Test data loaded | Minimal test data | **Clean production** |
| **Monitoring** | Basic | Enhanced | **Full monitoring** |
| **Backups** | None | Daily | **Hourly** |
| **SSL** | N/A | Let's Encrypt | **Custom certificate** |

---

## 🚨 **Deployment Safety**

### **Staging Safeguards**
- ✅ **Test mode Stripe** (no real charges)
- ✅ **Separate database** (no production data risk)
- ✅ **Full feature testing** before production
- ✅ **Webhook testing** with real endpoints

### **Production Safeguards** 
- ✅ **Manual deployment** (no auto-deploy)
- ✅ **Tagged releases** (version control)
- ✅ **Rollback capability** (previous version ready)
- ✅ **Health monitoring** (automatic alerts)
- ✅ **Database backups** (point-in-time recovery)

### **Emergency Procedures**
```bash
# Emergency rollback
git checkout production
git reset --hard v1.0.previous-working-version
git push origin production --force

# Emergency database rollback  
# (Use Supabase dashboard point-in-time recovery)
```

---

## 📊 **Branch Protection Rules**

### **Main Branch**
- ✅ **Require PR reviews** (1 reviewer minimum)
- ✅ **Require status checks** (build, lint, type-check)
- ✅ **No direct pushes** (must use PRs)
- ✅ **Delete branch after merge**

### **Staging Branch**  
- ✅ **Only merge from main** (no direct pushes)
- ✅ **Require successful build**
- ✅ **Auto-deploy on merge**

### **Production Branch**
- ✅ **Only merge from staging** (never from main directly)
- ✅ **Require manual approval**
- ✅ **Require full test suite pass**
- ✅ **Manual deployment only**

---

## 🎯 **Next Steps**

1. **Create staging branch:**
   ```bash
   git checkout -b staging
   git push origin staging
   ```

2. **Create production branch:**
   ```bash
   git checkout -b production  
   git push origin production
   ```

3. **Set up Vercel environments:**
   - Link repository to Vercel
   - Configure environment variables
   - Set up custom domains

4. **Configure Stripe webhooks:**
   - Staging: `https://staging.tracepaws.com/api/webhooks/stripe`
   - Production: `https://app.tracepaws.com/api/webhooks/stripe`

5. **Test complete deployment pipeline**

---

**Professional deployment strategy ready for $2M MRR scale!** 🚀