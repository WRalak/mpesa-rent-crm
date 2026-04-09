# Production Deployment Guide

This guide will help you deploy the M-Pesa Rent CRM to production.

## Quick Setup

### 1. Generate Environment Variables

Run the setup script to generate secure environment variables:

```bash
npm run setup:env
```

This will create a `.env.local` file with all necessary variables and secure random values.

### 2. Update Essential Variables

Edit `.env.local` and update these critical values:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://username:password@your-neon-host:5432/neondb?sslmode=require"

# Domain (REQUIRED)
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# M-Pesa (REQUIRED for payment features)
MPESA_CONSUMER_KEY="your-actual-consumer-key"
MPESA_CONSUMER_SECRET="your-actual-consumer-secret"
MPESA_PASSKEY="your-actual-passkey"
MPESA_SHORTCODE="your-actual-shortcode"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### 4. Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Environment Variables Explained

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Auto-generated 64-char hex |
| `NEXTAUTH_URL` | Your production domain | `https://your-domain.com` |
| `NEXT_PUBLIC_CSRF_TOKEN` | CSRF protection token | Auto-generated base64 |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `https://your-domain.com` |

### M-Pesa Variables (Required for payments)

| Variable | Description | How to get |
|----------|-------------|------------|
| `MPESA_CONSUMER_KEY` | Daraja API Consumer Key | Safaricom Developer Portal |
| `MPESA_CONSUMER_SECRET` | Daraja API Consumer Secret | Safaricom Developer Portal |
| `MPESA_PASSKEY` | STK Push Passkey | Safaricom Developer Portal |
| `MPESA_SHORTCODE` | Your Paybill/Till Number | Safaricom Business Portal |
| `MPESA_ENVIRONMENT` | `production` or `sandbox` | Set to `production` |

### Optional Variables

| Variable | Description | When needed |
|----------|-------------|-------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics tracking | Analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring | Error tracking |
| `EMAIL_*` | SMTP settings | Email notifications |
| `REDIS_URL` | Redis connection | Caching |
| `AWS_*` | S3 storage settings | File uploads |

## Deployment Platforms

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Railway

1. Create a new project on Railway
2. Add PostgreSQL database
3. Add environment variables
4. Deploy from GitHub

### DigitalOcean App Platform

1. Create a new app
2. Add PostgreSQL database
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Self-Hosted (VPS/Docker)

#### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t mpesa-rent-crm .
docker run -p 3000:3000 --env-file .env.local mpesa-rent-crm
```

#### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "mpesa-rent-crm" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## Security Checklist

### Before Production

- [ ] Update all placeholder values in `.env.local`
- [ ] Use strong, unique secrets
- [ ] Enable SSL/HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable monitoring

### Database Security

- [ ] Use connection pooling
- [ ] Enable SSL connections
- [ ] Set up read replicas if needed
- [ ] Regular backups

### Application Security

- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Input validation active
- [ ] Error boundaries in place
- [ ] Logging enabled

## Performance Optimization

### Database

- [ ] Add indexes for queries
- [ ] Use connection pooling
- [ ] Enable query caching
- [ ] Monitor slow queries

### Application

- [ ] Enable compression
- [ ] Use CDN for static assets
- [ ] Implement caching
- [ ] Monitor performance

## Monitoring

### Recommended Tools

- **Sentry** - Error tracking
- **Vercel Analytics** - Performance metrics
- **Google Analytics** - User analytics
- **UpTime Robot** - Uptime monitoring

### Health Checks

Add health check endpoints:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database is running
   - Ensure SSL is enabled

2. **Authentication Errors**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches domain
   - Clear browser cookies

3. **M-Pesa API Errors**
   - Verify credentials are correct
   - Check if environment is set to `production`
   - Ensure shortcode is active

4. **Build Errors**
   - Check all environment variables are set
   - Verify Node.js version (18+)
   - Clear node_modules and reinstall

### Getting Help

- Check application logs
- Review error messages
- Test environment variables
- Verify database connectivity

## Post-Deployment

### Testing Checklist

- [ ] User registration works
- [ ] Login/logout functions
- [ ] Dashboard loads correctly
- [ ] CRUD operations work
- [ ] M-Pesa integration (if configured)
- [ ] Error handling works
- [ ] Mobile responsive

### Maintenance

- Regular security updates
- Database backups
- Monitor performance
- Update dependencies
- Review logs regularly

## Support

For deployment issues:
1. Check this guide first
2. Review error logs
3. Test in staging environment
4. Create GitHub issue with details
