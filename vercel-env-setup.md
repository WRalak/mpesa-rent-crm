# Vercel Environment Variables Setup

## Required Environment Variables

Copy these to your Vercel project settings:

### Authentication
```
NEXTAUTH_SECRET=your-very-secure-secret-key-minimum-32-characters-long
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require
```

### Application
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_CSRF_TOKEN=your-random-csrf-token
```

### M-Pesa (Required for payments)
```
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=your-mpesa-shortcode
MPESA_ENVIRONMENT=production
```

## Setup Instructions

### Step 1: Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository
4. Import the M-Pesa Rent CRM

### Step 2: Configure Environment Variables
1. In Vercel dashboard, go to Settings > Environment Variables
2. Add all the variables listed above
3. Make sure to mark sensitive variables as "Secret"

### Step 3: Database Setup
1. Use your Neon database connection string
2. Ensure SSL mode is enabled
3. Test the connection before deployment

### Step 4: Deploy
1. Vercel will automatically deploy on first push
2. Subsequent deployments happen on push to main branch

## Production Build Optimization

The app is optimized for Vercel with:
- Edge functions for API routes
- Optimized build settings
- Security headers
- Proper caching strategies

## Post-Deployment Checklist

- [ ] Test login functionality
- [ ] Verify database connection
- [ ] Test M-Pesa integration
- [ ] Check admin dashboard access
- [ ] Verify all pages load correctly
- [ ] Test mobile responsiveness

## Troubleshooting

### Common Issues

**Build Error: Database Connection**
- Verify DATABASE_URL is correct
- Ensure Neon database is active
- Check SSL mode is enabled

**Authentication Error**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies

**M-Pesa Integration Issues**
- Verify API credentials are correct
- Check if environment is set to "production"
- Test with small amounts first

**Performance Issues**
- Enable Edge Functions
- Check Vercel Analytics
- Monitor function execution time

## Monitoring

Vercel provides built-in monitoring:
- Real-time logs
- Function execution metrics
- Performance analytics
- Error tracking

## Custom Domain

To use a custom domain:
1. Go to Vercel project settings
2. Add your custom domain
3. Configure DNS records
4. Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL
