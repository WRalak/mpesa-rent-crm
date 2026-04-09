# M-Pesa Rent CRM

A modern, secure CRM for small landlords to manage rent collection, track tenants, and maintain tax compliance.

## Features

### Core Functionality
- **Rent Collection**: Track rent payments via M-Pesa (Daraja API integration)
- **Tenant Management**: Comprehensive tenant profiles and payment history
- **Property Management**: Organize properties and units efficiently
- **Automated Defaulter Detection**: Flag late payments automatically
- **Tax Compliance**: Generate eRITS-ready monthly rental tax reports (7.5% MRI)
- **Real-time Dashboard**: Track key metrics and performance indicators

### Security & Performance
- **Rate Limiting**: Prevent abuse with configurable rate limits
- **CSRF Protection**: Cross-site request forgery protection
- **Input Validation**: Comprehensive data validation and sanitization
- **Error Handling**: Graceful error recovery and user feedback
- **Performance Monitoring**: Built-in logging and performance tracking
- **Database Optimization**: Indexed queries and efficient data access

### Developer Experience
- **TypeScript**: Full type safety across the application
- **Testing**: Comprehensive unit and integration tests
- **Error Boundaries**: Graceful error handling in React components
- **Modern UI**: Clean, responsive interface with Tailwind CSS
- **API Documentation**: Well-documented API endpoints

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with phone-based login
- **Testing**: Jest + React Testing Library
- **Validation**: Zod schemas

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- M-Pesa Daraja API credentials (optional for development)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd mpesa-rent-crm
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/mpesa_rent_crm"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # M-Pesa (optional for development)
   MPESA_CONSUMER_KEY="your-consumer-key"
   MPESA_CONSUMER_SECRET="your-consumer-secret"
   MPESA_PASSKEY="your-passkey"
   MPESA_SHORTCODE="your-shortcode"
   
   # Security
   NEXT_PUBLIC_CSRF_TOKEN="random-csrf-token"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed database with sample data (optional)
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to see the application.

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
```

### Project Structure

```
src/
  app/                 # Next.js app router pages and API routes
    (auth)/           # Authentication pages
    (dashboard)/      # Dashboard pages
    api/              # API endpoints
  components/         # Reusable React components
    ui/              # Base UI components
  lib/                # Utility libraries and configurations
  hooks/              # Custom React hooks
  services/           # External service integrations
  types/              # TypeScript type definitions
  utils/              # Helper functions
```

### Testing

The application includes comprehensive testing:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **Component Tests**: Test React components with user interactions

Run tests with coverage:
```bash
npm run test:coverage
```

### Security Features

#### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- General API: 100 requests per 15 minutes

#### Input Validation
- All user inputs validated with Zod schemas
- Phone number format validation
- Amount and data type validation

#### CSRF Protection
- CSRF tokens for all state-changing requests
- Secure cookie configuration

#### Error Handling
- Graceful error boundaries in React
- Detailed error logging
- User-friendly error messages

### Database Schema

The application uses a well-structured schema with:

- **Users**: Landlord accounts with role-based access
- **Properties**: Rental properties with unit tracking
- **Tenants**: Tenant information and rent details
- **Payments**: Payment records with M-Pesa integration

Key features:
- Optimized indexes for performance
- Soft deletes with `isActive` flags
- Audit trails with timestamps

### API Documentation

#### Authentication
- Phone-based authentication with OTP support
- JWT sessions with secure configuration

#### Dashboard API
```typescript
GET /api/dashboard/summary
Authorization: Bearer <token>

Response:
{
  "propertiesCount": number,
  "tenantsCount": number,
  "pendingPayments": number,
  "totalCollected": number,
  "successfulPayments": number,
  "period": "last_30_days"
}
```

## Deployment

### Environment Variables for Production

Ensure these are set in production:
- `DATABASE_URL`: Production database connection
- `NEXTAUTH_SECRET`: Strong secret key
- `NEXTAUTH_URL`: Production URL
- `NODE_ENV=production`

### Database Migration

Run migrations in production:
```bash
npm run db:migrate
```

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Use semantic commit messages

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run `npm run test` and `npm run lint`
4. Submit pull request with description

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Review the documentation
- Check existing issues
- Create new issue with detailed description

## Roadmap

### Upcoming Features
- [ ] Mobile app companion
- [ ] Advanced reporting and analytics
- [ ] Multi-landlord support
- [ ] SMS notifications
- [ ] Payment reminders
- [ ] Expense tracking
- [ ] Document management
- [ ] API for third-party integrations

### Technical Improvements
- [ ] Redis caching layer
- [ ] Background job processing
- [ ] Real-time updates with WebSockets
- [ ] Advanced monitoring and alerting
- [ ] Performance optimization
- [ ] Accessibility improvements
