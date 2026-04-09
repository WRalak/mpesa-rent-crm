# Admin Login Guide

This guide shows you how to access the admin dashboard for the M-Pesa Rent CRM.

## **Quick Login Steps**

### **1. Go to Login Page**
Navigate to: `http://localhost:3000/login`

### **2. Enter Admin Credentials**
```
Phone Number: 254700000001
```
- Click "Login" (no password required for phone-based auth)
- The system will recognize you as an admin user

### **3. Automatic Redirect**
After successful login, you'll be automatically redirected to:
- **Admin Users:** `/admin/dashboard`
- **Regular Users:** `/dashboard`

## **Admin Dashboard Features**

### **Overview**
The admin dashboard provides platform-level insights and management tools:

- **Active Landlords:** Total number of registered landlords
- **Monthly Revenue:** Platform-wide revenue tracking
- **Open Incidents:** System issues requiring attention
- **User Analytics:** Registration and activity metrics

### **Admin Navigation**
From the admin dashboard, you can access:
- `/admin/dashboard` - Main admin overview
- `/admin/landlords` - Manage landlord accounts
- `/admin/analytics` - Platform analytics
- `/admin/audit-logs` - System activity logs
- `/admin/settings` - Platform configuration
- `/admin/support` - Customer support tools
- `/admin/subscriptions` - Subscription management

## **Admin Permissions**

### **What Admins Can Do:**
- View all landlords and their properties
- Access platform-wide analytics
- Manage user accounts
- View system logs and audits
- Configure platform settings
- Handle customer support requests

### **What Admins Cannot Do:**
- Access individual landlord data (without proper authorization)
- Modify tenant information directly
- Process payments on behalf of landlords
- Delete critical system data

## **Troubleshooting**

### **Login Issues**

**Problem:** "Invalid credentials" error
**Solution:** 
- Verify phone number format: `2547XXXXXXXX`
- Ensure admin user exists in database
- Check database connection

**Problem:** Redirected to regular dashboard
**Solution:**
- Verify user role is set to 'ADMIN' in database
- Check middleware configuration
- Clear browser cookies and try again

**Problem:** Database connection error
**Solution:**
- Verify DATABASE_URL in environment variables
- Check if Neon database is active
- Ensure SSL mode is enabled

### **Access Issues**

**Problem:** "Access denied" on admin pages
**Solution:**
- Confirm you're logged in as admin
- Check user role in database
- Verify middleware routing rules

**Problem:** Admin pages not loading
**Solution:**
- Check browser console for errors
- Verify Next.js server is running
- Check admin route files exist

## **Database Setup for Admin**

### **Create Admin User (if needed)**

If no admin user exists, create one:

```bash
npm run create:admin
```

This will create an admin user with:
- Phone: `254700000001`
- Role: `ADMIN`
- Email: `admin@mpesarentcrm.com`

### **Verify Admin User**

Check the admin user in database:

```sql
SELECT * FROM "User" WHERE role = 'ADMIN';
```

### **Update Admin Credentials**

To change admin phone number:

```sql
UPDATE "User" 
SET phone = '2547XXXXXXXX' 
WHERE role = 'ADMIN';
```

## **Security Best Practices**

### **Admin Account Security**
- Use a secure, unique phone number
- Enable two-factor authentication (when implemented)
- Regularly review admin access logs
- Limit number of admin users

### **Session Management**
- Admin sessions expire after 24 hours
- Automatic logout on inactivity
- Secure cookie configuration
- CSRF protection enabled

### **Access Control**
- Role-based permissions enforced
- Route protection in middleware
- API endpoint authorization
- Database-level access controls

## **Development vs Production**

### **Development Environment**
- Database: Local or Neon development
- URL: `http://localhost:3000`
- Admin user: Auto-created via script

### **Production Environment**
- Database: Production Neon database
- URL: `https://your-domain.com`
- Admin user: Create manually via script

## **Support**

### **Common Questions**

**Q: Can I have multiple admin users?**
A: Yes, create additional admin users using the create-admin script.

**Q: How do I reset admin access?**
A: Delete the admin user and recreate using the script.

**Q: Can admin users access landlord data?**
A: Only through proper authorization and audit trails.

**Q: Is admin access logged?**
A: Yes, all admin actions are logged in audit trails.

### **Getting Help**

1. Check this guide first
2. Review error messages in browser console
3. Verify database connection
4. Check environment variables
5. Review middleware configuration

## **Next Steps**

After logging in as admin:

1. **Review Dashboard** - Check platform metrics
2. **Manage Users** - View and manage landlord accounts
3. **Configure Settings** - Set up platform preferences
4. **Monitor Analytics** - Track growth and usage
5. **Handle Support** - Respond to user issues

---

**Note:** Admin access should be limited to trusted personnel only. Regular audits of admin activity are recommended for security.
