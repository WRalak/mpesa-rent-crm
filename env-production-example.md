# M-Pesa Rent CRM - Production Environment Variables
# Copy this content to your .env.local file for production deployment

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_URL="postgresql://username:password@host:port/database_name?sslmode=require"

# ===========================================
# NEXTAUTH CONFIGURATION
# ===========================================
NEXTAUTH_SECRET="your-very-secure-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="https://your-domain.com"

# ===========================================
# SECURITY CONFIGURATION
# ===========================================
NEXT_PUBLIC_CSRF_TOKEN="your-random-csrf-token-for-production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# ===========================================
# M-PESA DARAJA API CONFIGURATION
# ===========================================
MPESA_CONSUMER_KEY="your-mpesa-consumer-key"
MPESA_CONSUMER_SECRET="your-mpesa-consumer-secret"
MPESA_PASSKEY="your-mpesa-passkey"
MPESA_SHORTCODE="your-mpesa-shortcode"
MPESA_ENVIRONMENT="production"  # or "sandbox" for testing

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================
NODE_ENV="production"
PORT="3000"

# ===========================================
# OPTIONAL: MONITORING & ANALYTICS
# ===========================================
# Google Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# Sentry for error monitoring
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"

# ===========================================
# OPTIONAL: EMAIL CONFIGURATION
# ===========================================
EMAIL_HOST="your-smtp-server"
EMAIL_PORT="587"
EMAIL_USER="your-email-username"
EMAIL_PASS="your-email-password"
EMAIL_FROM="noreply@your-domain.com"

# ===========================================
# OPTIONAL: REDIS CONFIGURATION (for caching)
# ===========================================
REDIS_URL="redis://username:password@host:port"

# ===========================================
# OPTIONAL: FILE STORAGE (for receipts/documents)
# ===========================================
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET="your-s3-bucket-name"

# ===========================================
# DEVELOPMENT / TESTING ONLY
# ===========================================
# Remove these in production
# NEXT_PUBLIC_DEV_MODE="true"
# DATABASE_URL="postgresql://postgres:password@localhost:5432/mpesa_rent_crm"
