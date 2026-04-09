# GitHub Workflows Setup Guide

## Overview

The M-Pesa Rent CRM now has proper GitHub Actions workflows for CI/CD. Here's how to set them up:

## Workflows Created

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)
- **Triggers**: Push to main/develop, Pull requests
- **Jobs**: 
  - `test`: Runs tests, linting, type checking
  - `build-and-deploy-preview`: Builds and deploys to Vercel preview

### 2. Deploy to Production (`.github/workflows/deploy-production.yml`)
- **Triggers**: Git tags (v*), Manual workflow dispatch
- **Jobs**: 
  - `deploy`: Deploys to production with health checks

### 3. Deploy Preview (`.github/workflows/deploy-preview.yml`)
- **Triggers**: Pull requests
- **Jobs**: 
  - `deploy-preview`: Creates preview deployments

## Required GitHub Secrets

Add these secrets to your GitHub repository:

### Vercel Integration
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_TEAM_ID=your_vercel_team_id
```

### Production Environment
```
DATABASE_URL=your_production_database_url
REDIS_URL=your_redis_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
PRODUCTION_URL=https://your-domain.com
```

### M-Pesa Integration
```
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_ENVIRONMENT=sandbox or production
```

### Optional: Slack Notifications
```
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## How to Get Vercel Credentials

1. **Vercel Token**:
   ```bash
   npx vercel login
   npx vercel tokens create --name "GitHub Actions"
   ```

2. **Vercel Org ID, Project ID, Team ID**:
   ```bash
   npx vercel link
   npx vercel env ls
   ```

## Workflow Features

### CI Pipeline Features
- **Node.js 18** with npm caching
- **PostgreSQL 15** and **Redis 7** services
- **Prisma** client generation and migrations
- **ESLint** linting
- **Jest** unit tests
- **TypeScript** type checking
- **Next.js** build verification

### Production Deployment Features
- **Environment-specific** builds
- **Database migrations** on deploy
- **Health checks** post-deployment
- **Slack notifications** (optional)
- **Manual deployment** triggers

### Preview Deployment Features
- **Automatic preview URLs** for PRs
- **E2E tests** on preview deployments
- **PR comments** with preview links
- **Commit status** updates

## Deployment Triggers

### Automatic Deployments
- **Main branch**: Triggers CI pipeline
- **Pull requests**: Triggers CI + preview deployments
- **Git tags** (v*): Triggers production deployments

### Manual Deployments
- **Production**: Use GitHub Actions "Run workflow"
- **Staging**: Use workflow_dispatch with environment selection

## Troubleshooting

### Common Issues

1. **Missing Secrets**: Add all required GitHub secrets
2. **Database Connection**: Ensure DATABASE_URL is correct
3. **Vercel Token**: Generate a new token if expired
4. **Build Failures**: Check logs for specific errors

### Debugging Steps

1. **Check Workflow Logs**: GitHub Actions tab in repository
2. **Verify Secrets**: Ensure all secrets are set correctly
3. **Local Testing**: Run `npm run build` locally first
4. **Database**: Test database connection separately

## Best Practices

### Security
- **Never commit secrets** to repository
- **Use environment-specific** secrets
- **Rotate tokens** regularly
- **Limit access** to production secrets

### Performance
- **Use npm caching** for faster builds
- **Run tests in parallel** where possible
- **Optimize Docker images** if using containers

### Monitoring
- **Set up health checks** for deployments
- **Monitor build times** and failures
- **Set up Slack notifications** for important events

## Example Workflow Runs

### Successful CI Pipeline
```
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (cached)
4. Generate Prisma client
5. Run database migrations
6. Run linting (passed)
7. Run tests (passed)
8. Build application (passed)
9. Run type checking (passed)
```

### Production Deployment
```
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Generate Prisma client
5. Run database migrations
6. Build application
7. Deploy to Vercel Production
8. Run health checks (passed)
9. Send Slack notification
```

## Next Steps

1. **Add GitHub secrets** to your repository
2. **Test workflows** by pushing to main branch
3. **Verify deployments** work correctly
4. **Set up monitoring** and notifications
5. **Review build times** and optimize if needed

## Support

For issues with GitHub Actions:
- Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- Review workflow logs for specific errors
- Ensure all dependencies are compatible with Node.js 18

Your M-Pesa Rent CRM is now ready for automated CI/CD!
