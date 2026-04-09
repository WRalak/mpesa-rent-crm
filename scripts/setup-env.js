#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate secure random strings
function generateSecureString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('base64').replace(/[+/=]/g, '').substring(0, length);
}

// Interactive setup
async function setupEnvironment() {
  console.log('=== M-Pesa Rent CRM Environment Setup ===\n');

  const envVars = {
    // Database
    DATABASE_URL: 'postgresql://username:password@host:port/database_name?sslmode=require',
    
    // NextAuth
    NEXTAUTH_SECRET: generateSecureString(64),
    NEXTAUTH_URL: 'https://your-domain.com',
    
    // Security
    NEXT_PUBLIC_CSRF_TOKEN: generateSecureToken(32),
    NEXT_PUBLIC_APP_URL: 'https://your-domain.com',
    
    // M-Pesa
    MPESA_CONSUMER_KEY: 'your-mpesa-consumer-key',
    MPESA_CONSUMER_SECRET: 'your-mpesa-consumer-secret',
    MPESA_PASSKEY: 'your-mpesa-passkey',
    MPESA_SHORTCODE: 'your-mpesa-shortcode',
    MPESA_ENVIRONMENT: 'production',
    
    // Application
    NODE_ENV: 'production',
    PORT: '3000',
  };

  console.log('Generated secure values for:\n');
  console.log(`NEXTAUTH_SECRET: ${envVars.NEXTAUTH_SECRET}`);
  console.log(`NEXT_PUBLIC_CSRF_TOKEN: ${envVars.NEXT_PUBLIC_CSRF_TOKEN}\n`);

  // Create .env.local content
  let envContent = '# M-Pesa Rent CRM - Production Environment Variables\n';
  envContent += '# Generated on ' + new Date().toISOString() + '\n\n';
  
  for (const [key, value] of Object.entries(envVars)) {
    envContent += `${key}="${value}"\n`;
  }

  // Add optional variables with comments
  envContent += `
# ===========================================
# OPTIONAL CONFIGURATIONS
# ===========================================

# Google Analytics (optional)
# NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# Sentry Error Monitoring (optional)
# NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"

# Email Configuration (optional)
# EMAIL_HOST="smtp.gmail.com"
# EMAIL_PORT="587"
# EMAIL_USER="your-email@gmail.com"
# EMAIL_PASS="your-app-password"
# EMAIL_FROM="noreply@your-domain.com"

# Redis Cache (optional)
# REDIS_URL="redis://username:password@host:port"

# AWS S3 Storage (optional)
# AWS_ACCESS_KEY_ID="your-aws-access-key"
# AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
# AWS_REGION="us-east-1"
# AWS_S3_BUCKET="your-s3-bucket"
`;

  // Write to .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`\n=== SUCCESS ===`);
    console.log(`Environment file created at: ${envPath}`);
    console.log(`\nIMPORTANT: Update the following values in .env.local:`);
    console.log(`- DATABASE_URL (your actual database connection)`);
    console.log(`- NEXTAUTH_URL (your production domain)`);
    console.log(`- NEXT_PUBLIC_APP_URL (your production domain)`);
    console.log(`- M-PESA credentials (your Daraja API keys)`);
    console.log(`\nThen run: npm run db:migrate`);
  } catch (error) {
    console.error('Error creating .env.local file:', error.message);
  }
}

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('=== WARNING ===');
  console.log('.env.local already exists!');
  console.log('This will overwrite your existing configuration.');
  console.log('Press Ctrl+C to cancel, or continue to proceed...\n');
  
  // Wait for user confirmation
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', () => {
    setupEnvironment();
    process.exit(0);
  });
} else {
  setupEnvironment();
}
