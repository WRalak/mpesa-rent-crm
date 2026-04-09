# Login Guide for M-Pesa Rent CRM

This guide shows you how to log in to the M-Pesa Rent CRM application with different user types.

## **Quick Login Instructions**

### **1. Go to Login Page**
Navigate to: `http://localhost:3001/login`

### **2. Enter Phone Number**
Enter any of the available phone numbers (no password required)

### **3. Automatic Redirect**
You'll be automatically redirected based on your user role:
- **Admin Users** -> `/admin/dashboard`
- **Landlord Users** -> `/dashboard`

## **Available Test Users**

### **Admin User**
```
Phone: 254700000000
Role: ADMIN
Access: Full admin dashboard with platform management
```

### **Landlord Users**
```
Phone: 254700000001 (John Landlord)
Role: LANDLORD
Access: Landlord dashboard with property management

Phone: 254700000002 (Jane Landlord)
Role: LANDLORD
Access: Landlord dashboard with property management

Phone: 254700000003 (Bob Landlord)
Role: LANDLORD
Access: Landlord dashboard with property management

Phone: 254700000004 (Alice Landlord)
Role: LANDLORD
Access: Landlord dashboard with property management

Phone: 254700000005 (Test Landlord)
Role: LANDLORD
Access: Landlord dashboard with property management
```

## **User Roles and Access**

### **Admin Role**
- **Dashboard:** `/admin/dashboard`
- **Features:**
  - Platform-wide analytics
  - User management
  - System monitoring
  - Advanced reporting
  - Multi-tenant support

### **Landlord Role**
- **Dashboard:** `/dashboard`
- **Features:**
  - Property management
  - Tenant management
  - Payment tracking
  - M-Pesa integration
  - Reports generation
  - AI-powered insights

## **Login Flow**

### **Step 1: Navigate to Login**
```
http://localhost:3001/login
```

### **Step 2: Enter Phone Number**
- Type any test phone number
- Format: `2547XXXXXXXX`
- No password required

### **Step 3: Automatic Authentication**
- System validates phone number
- Checks user role
- Redirects to appropriate dashboard

### **Step 4: Dashboard Access**
- **Admin:** Full platform management
- **Landlord:** Property management tools

## **Troubleshooting**

### **Login Issues**

**Problem:** "User not found" error
**Solution:** 
- Check phone number format
- Use one of the test numbers provided
- Ensure phone starts with `2547`

**Problem:** "Login failed" error
**Solution:**
- Verify phone number is correct
- Try a different test user
- Check if application is running

**Problem:** Redirected to wrong dashboard
**Solution:**
- Check user role in database
- Verify middleware configuration
- Clear browser cookies

### **Database Issues**

**Problem:** Database connection error
**Solution:**
- Ensure SQLite database exists
- Run `npx prisma db push`
- Check database file permissions

**Problem:** User not created
**Solution:**
- Run `npm run create:test-users`
- Check database schema
- Verify Prisma client generation

### **Application Issues**

**Problem:** Server not running
**Solution:**
- Run `npm run dev`
- Check port 3001 availability
- Verify environment variables

**Problem:** Page not loading
**Solution:**
- Check browser console for errors
- Verify Next.js build
- Restart development server

## **Creating New Users**

### **Method 1: Registration Form**
1. Go to `/register`
2. Fill in user details
3. Submit form
4. User created automatically

### **Method 2: Admin Creation**
1. Log in as admin
2. Go to admin dashboard
3. Use user management tools
4. Create new landlord accounts

### **Method 3: Script Creation**
```bash
# Create admin user
npm run create:admin

# Create test users
npm run create:test-users
```

## **Security Features**

### **Authentication**
- Phone-based authentication
- Role-based access control
- Session management
- Automatic logout

### **Authorization**
- Route protection
- API endpoint security
- CSRF protection
- Rate limiting

### **Session Management**
- 24-hour session duration
- Secure cookie configuration
- Automatic session refresh
- Logout functionality

## **Development Setup**

### **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# Create test users
npm run create:test-users
```

### **Environment Variables**
```bash
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001
DATABASE_URL=file:./dev.db
```

### **Start Application**
```bash
npm run dev
```

## **Testing Different Users**

### **Test Admin Access**
1. Use phone: `254700000000`
2. Verify redirect to `/admin/dashboard`
3. Check admin features are available

### **Test Landlord Access**
1. Use phone: `254700000001`
2. Verify redirect to `/dashboard`
3. Check landlord features are available

### **Test Multiple Users**
1. Log out from current user
2. Log in with different phone number
3. Verify role-based redirects work

## **Best Practices**

### **For Development**
- Use test users for testing
- Clear browser cache between tests
- Test both admin and landlord roles
- Verify all features work correctly

### **For Production**
- Use real phone numbers
- Implement OTP verification
- Set up proper authentication
- Configure secure sessions

### **For Testing**
- Test all user roles
- Verify redirects work
- Check error handling
- Test logout functionality

## **Next Steps**

After successful login:

### **Admin Users**
1. Explore admin dashboard
2. Check platform analytics
3. Manage user accounts
4. Monitor system performance

### **Landlord Users**
1. Set up properties
2. Add tenants
3. Track payments
4. Generate reports

### **Both Users**
1. Test logout functionality
2. Verify session management
3. Check mobile responsiveness
4. Test all features

---

**Your M-Pesa Rent CRM is now ready for testing with multiple user types!**

Use the provided test credentials to explore different user roles and features.
