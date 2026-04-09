# Properties and Tenants Guide

## How to Add Properties

### Step 1: Navigate to Properties Page
1. Log in to your dashboard
2. Click "Add Property" in the Quick Actions section
3. Or go directly to: `/properties`

### Step 2: Fill Property Form
- **Property Name**: Enter the name of your property (e.g., "Sunset Apartments")
- **Location**: Enter the property address/location (e.g., "Nairobi, Kenya")
- **Unit Count**: Enter the number of units in the property (e.g., 12)

### Step 3: Save Property
- Click "Save Property" button
- You should see a green success message: "Property created successfully!"
- The property will appear in the list below

## How to Add Tenants

### Step 1: Navigate to Tenants Page
1. Log in to your dashboard
2. Click "Add Tenant" in the Quick Actions section
3. Or go directly to: `/tenants`

### Step 2: Fill Tenant Form
- **Full Name**: Enter tenant's full name (e.g., "John Doe")
- **Phone Number**: Enter tenant's phone number (e.g., "254712345678")
- **Unit Number**: Enter the unit number (e.g., "A-101" or "Unit 5")
- **Rent Amount**: Enter monthly rent amount (e.g., 15000)
- **Property**: Select the property from dropdown

### Step 3: Save Tenant
- Click "Save Tenant" button
- You should see a green success message: "Tenant created successfully!"
- The tenant will appear in the list below

## Common Issues and Solutions

### Property Creation Issues

**Problem**: "Property name is required"
**Solution**: Make sure you enter a property name

**Problem**: "Location is required"
**Solution**: Make sure you enter a location

**Problem**: "Unit count must be at least 1"
**Solution**: Enter a number greater than 0

**Problem**: "Error: Failed to create property"
**Solution**: Check if you're logged in and try again

### Tenant Creation Issues

**Problem**: "Full name is required"
**Solution**: Enter tenant's full name (at least 2 characters)

**Problem**: "Phone number is required"
**Solution**: Enter a valid phone number (at least 5 digits)

**Problem**: "Unit number is required"
**Solution**: Enter the unit number/identifier

**Problem**: "Rent amount must be greater than 0"
**Solution**: Enter a positive number for rent amount

**Problem**: "Please select a property"
**Solution**: Make sure you have created at least one property first

## Error Messages Explained

### Success Messages (Green)
- "Property created successfully!"
- "Tenant created successfully!"

### Error Messages (Red)
- "Error: [specific error message]" - Something went wrong
- "Error: Failed to create property" - Server error
- "Error: Failed to create tenant" - Server error

### Info Messages (Blue)
- "Property created." - Basic success message
- "Tenant created." - Basic success message

## Troubleshooting Steps

### If Property Creation Fails
1. Check you're logged in
2. Verify all fields are filled correctly
3. Check network connection
4. Try refreshing the page
5. Contact support if issue persists

### If Tenant Creation Fails
1. Make sure you have at least one property created first
2. Check all fields are filled correctly
3. Verify phone number format
4. Check rent amount is a positive number
5. Try refreshing the page

## Best Practices

### Property Management
1. Use descriptive property names
2. Include full location details
3. Keep unit count accurate
4. Update property details when needed

### Tenant Management
1. Use full legal names for tenants
2. Keep phone numbers up to date
3. Use consistent unit numbering
4. Set appropriate rent amounts
5. Link tenants to correct properties

## Data Validation Rules

### Property Validation
- **Name**: 1-100 characters, required
- **Location**: 1-200 characters, required
- **Unit Count**: Whole number, 1-1000, required

### Tenant Validation
- **Full Name**: 2-100 characters, required
- **Phone**: 5-20 digits, auto-formatted
- **Unit Number**: 1-20 characters, required
- **Rent Amount**: Positive number, max 1,000,000
- **Property**: Must be valid property ID, required

## API Endpoints

### Properties
- **GET**: `/api/properties` - List all properties
- **POST**: `/api/properties` - Create new property

### Tenants
- **GET**: `/api/tenants` - List all tenants
- **POST**: `/api/tenants` - Create new tenant

## Sample Data

### Sample Property
```json
{
  "name": "Sunset Apartments",
  "location": "Nairobi, Kenya",
  "unitCount": 12
}
```

### Sample Tenant
```json
{
  "fullName": "John Doe",
  "phone": "254712345678",
  "unitNumber": "A-101",
  "rentAmount": 15000,
  "propertyId": "property-id-here"
}
```

## Support

If you continue to experience issues:
1. Check browser console for errors
2. Verify network connectivity
3. Ensure you're logged in properly
4. Contact technical support

---

**Your properties and tenants management system is now ready to use!**
