# Vercel Deployment Guide

This guide will help you deploy the M-Pesa Rent CRM to Vercel.

## **Prerequisites**

- GitHub account with the repository
- Vercel account
- Neon database (or PostgreSQL)
- M-Pesa Daraja API credentials

## **Step 1: Connect to Vercel**

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Authorize Vercel access to your repositories

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your M-Pesa Rent CRM repository
   - Click "Import"

## **Step 2: Configure Environment Variables**

In your Vercel project dashboard:

1. Go to **Settings** > **Environment Variables**
2. Add the following variables:

### **Required Variables**

```bash
NEXTAUTH_SECRET
# Generate a secure 32+ character secret
# Example: your-very-secure-secret-key-minimum-32-characters-long

NEXTAUTH_URL
# Your Vercel URL
# Example: https://mpesa-rent-crm.vercel.app

DATABASE_URL
# Your Neon database connection string
# Example: postgresql://username:password@host:port/database?sslmode=require

NEXT_PUBLIC_APP_URL
# Same as NEXTAUTH_URL
# Example: https://mpesa-rent-crm.vercel.app

NEXT_PUBLIC_CSRF_TOKEN
# Random 32-character token
# Example: abc123def456ghi789jkl012mno345pqr678
```

### **M-Pesa Variables**

```bash
MPESA_CONSUMER_KEY
# Your Daraja API Consumer Key

MPESA_CONSUMER_SECRET
# Your Daraja API Consumer Secret

MPESA_PASSKEY
# Your STK Push Passkey

MPESA_SHORTCODE
# Your Paybill or Till Number

MPESA_ENVIRONMENT
# Set to "production"
```

## **Step 3: Database Setup**

### **Using Neon (Recommended)**

1. **Create Neon Database**
   - Go to [console.neon.tech](https://console.neon.tech)
   - Create new project
   - Copy connection string

2. **Configure Connection**
   - Add DATABASE_URL to Vercel environment variables
   - Ensure `sslmode=require` is included

3. **Run Migrations**
   - Vercel will automatically run `npm run db:migrate`
   - Or run manually: `npx prisma migrate deploy`

### **Using PostgreSQL**

1. **Set up PostgreSQL**
   - Use Vercel Postgres or external provider
   - Get connection string
   - Add to environment variables

## **Step 4: Deploy**

### **Automatic Deployment**

Vercel will automatically deploy when you:
- Push to your main branch
- Make changes to environment variables
- Trigger manual deployment

### **Manual Deployment**

1. In Vercel dashboard, click **Deployments**
2. Click **Redeploy**
3. Choose the branch to deploy

## **Step 5: Post-Deployment Setup**

### **Domain Configuration**

1. **Custom Domain** (Optional)
   - Go to Settings > Domains
   - Add your custom domain
   - Configure DNS records
   - Update environment variables

2. **Update URLs**
   - Change `NEXTAUTH_URL` to your custom domain
   - Update `NEXT_PUBLIC_APP_URL`

### **Database Migration**

```bash
# Run migrations on Vercel
npx prisma migrate deploy

# Seed database (optional)
npx tsx prisma/seed.ts
```

## **Step 6: Test Deployment**

### **Critical Tests**

1. **Authentication**
   - Visit your site
   - Try login with admin phone: `254700000001`
   - Verify admin dashboard access

2. **Database Connection**
   - Check if pages load correctly
   - Test creating a property
   - Verify data persistence

3. **M-Pesa Integration**
   - Test STK push functionality
   - Verify webhook handling
   - Check payment processing

4. **Admin Features**
   - Access `/admin/dashboard`
   - Test landlord management
   - Verify analytics display

### **Mobile Testing**

- Test on mobile devices
- Verify responsive design
- Check PWA functionality

## **Environment Variables Reference**

### **Authentication**
- `NEXTAUTH_SECRET`: JWT signing secret
- `NEXTAUTH_URL`: Application URL
- `NEXT_PUBLIC_APP_URL`: Frontend URL

### **Database**
- `DATABASE_URL`: PostgreSQL connection string

### **Security**
- `NEXT_PUBLIC_CSRF_TOKEN`: CSRF protection token

### **M-Pesa**
- `MPESA_CONSUMER_KEY`: Daraja API key
- `MPESA_CONSUMER_SECRET`: Daraja API secret
- `MPESA_PASSKEY`: STK Push passkey
- `MPESA_SHORTCODE`: Paybill/Till number
- `MPESA_ENVIRONMENT`: "production" or "sandbox"

## **Troubleshooting**

### **Build Errors**

**Problem:** "Database connection failed"
**Solution:** 
- Verify DATABASE_URL is correct
- Check Neon database status
- Ensure SSL mode is enabled

**Problem:** "Authentication error"
**Solution:**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches domain
- Clear browser cookies

**Problem:** "M-Pesa integration not working"
**Solution:**
- Verify API credentials
- Check environment is "production"
- Test with sandbox first

### **Performance Issues**

**Problem:** "Slow page loads"
**Solution:**
- Check Vercel Analytics
- Monitor function execution time
- Optimize database queries

**Problem:** "High memory usage"
**Solution:**
- Check for memory leaks
- Optimize image usage
- Reduce function complexity

### **Domain Issues**

**Problem:** "Custom domain not working"
**Solution:**
- Verify DNS configuration
- Check SSL certificate
- Update environment variables

## **Monitoring**

### **Vercel Analytics**

- Real-time performance metrics
- Function execution time
- Error tracking
- User analytics

### **Custom Monitoring**

Add to your application:
```typescript
// logging.ts
import { logger } from '@/lib/logger';

// Log important events
logger.info('User action', { userId, action });
logger.error('API error', { error, userId });
```

## **Security Checklist**

### **Before Production**

- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure rate limiting
- [ ] Set up error monitoring
- [ ] Test all authentication flows

### **Database Security**

- [ ] Use SSL connections
- [ ] Enable connection pooling
- [ ] Regular backups
- [ ] Monitor query performance

### **Application Security**

- [ ] CSRF protection enabled
- [ ] Input validation active
- [ ] Error handling in place
- [ ] Secure cookie configuration

## **Scaling Considerations**

### **Database Scaling**

- Monitor connection pool usage
- Consider read replicas
- Optimize query performance
- Implement caching strategies

### **Function Scaling**

- Monitor function execution time
- Optimize cold starts
- Consider edge functions
- Implement proper caching

### **Cost Optimization**

- Monitor function invocations
- Optimize image usage
- Reduce build size
- Consider Edge Functions

## **Maintenance**

### **Regular Tasks**

- Update dependencies
- Monitor error logs
- Check performance metrics
- Update environment variables
- Test new features

### **Updates**

- Test in preview environment
- Update documentation
- Communicate changes
- Monitor for issues

## **Support**

### **Getting Help**

1. Check this documentation first
2. Review Vercel logs
3. Check application logs
4. Test in staging environment

### **Common Issues**

- **Build failures**: Check environment variables
- **Runtime errors**: Review Vercel logs
- **Performance issues**: Use Vercel Analytics
- **Database problems**: Check connection string

---

**Your M-Pesa Rent CRM is now ready for Vercel deployment!** 

Follow these steps carefully, and you'll have a production-ready application running on Vercel's infrastructure.
