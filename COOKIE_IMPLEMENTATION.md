# Cookie Implementation - Complete Guide

## Overview

This application now includes comprehensive cookie management for user preferences, session persistence, and enhanced user experience.

## Features

### **1. Authentication Cookies**
- **Session Token**: Secure JWT session management
- **CSRF Protection**: Cross-site request forgery tokens
- **Secure Settings**: HttpOnly, Secure, SameSite policies

### **2. User Preferences**
- **Theme**: Light/Dark/System preference
- **Language**: English/Swahili support
- **Date/Time Format**: Customizable display formats
- **Currency**: KES/USD/EUR selection
- **Notifications**: Email/SMS/Push preferences
- **Dashboard**: Layout and display preferences

### **3. Application State**
- **Property Filters**: Saved search filters
- **Tenant Filters**: Saved tenant filters
- **Last Visited Page**: Return to previous page
- **Sidebar State**: Remember sidebar open/closed
- **Date Range**: Saved date range selections
- **Form Auto-Save**: Prevent data loss
- **Scroll Position**: Restore scroll position

## Implementation Details

### **Cookie Configuration**

#### **Authentication Cookies** (Server-side)
```typescript
// Enhanced auth config with proper cookie settings
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
  // ... other auth cookies
}
```

#### **User Preference Cookies** (Client-side)
```typescript
// 30-day expiration, client accessible
const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
};
```

### **Cookie Names**

#### **Core Preferences**
- `mpesa-user-prefs`: Main user preferences object
- `mpesa-theme`: Theme preference override
- `mpesa-language`: Language preference override

#### **Application State**
- `mpesa-dashboard-layout`: Dashboard layout preferences
- `mpesa-property-filters`: Property search filters
- `mpesa-tenant-filters`: Tenant search filters
- `mpesa-last-visited`: Last visited page
- `mpesa-sidebar-state`: Sidebar open/closed state
- `mpesa-notifications`: Notification settings
- `mpesa-date-range`: Date range selection

#### **Temporary Data**
- `mpesa-form-{id}`: Form auto-save data (1 hour)
- `mpesa-scroll-{page}`: Scroll position (1 hour)
- `mpesa-last-activity`: User activity tracking

## Usage Examples

### **1. Basic Cookie Hook Usage**

```typescript
import { useCookies } from "@/hooks/useCookies";

function MyComponent() {
  const { preferences, updatePreference } = useCookies();

  const handleChange = () => {
    updatePreference("theme", "dark");
  };

  return <div>Current theme: {preferences.theme}</div>;
}
```

### **2. Theme Management**

```typescript
import { useTheme } from "@/hooks/useCookies";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Switch to {theme === "light" ? "dark" : "light"} mode
    </button>
  );
}
```

### **3. Form Auto-Save**

```typescript
import { useFormAutoSave } from "@/hooks/useCookies";

function PropertyForm() {
  const [formData, setFormData] = useState({ name: "", location: "" });
  
  useFormAutoSave("property-form", formData);

  return (
    <form>
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
    </form>
  );
}
```

### **4. Filter Persistence**

```typescript
import { usePropertyFilters } from "@/hooks/useCookies";

function PropertyList() {
  const { filters, updateFilters, clearFilters } = usePropertyFilters();

  return (
    <div>
      <input 
        placeholder="Search properties..."
        onChange={(e) => updateFilters({ search: e.target.value })}
      />
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}
```

### **5. Server-side Cookie Access**

```typescript
import { CookieManager } from "@/lib/cookies";

export async function GET() {
  const preferences = await CookieManager.getUserPreferences();
  const theme = await CookieManager.getTheme();
  
  return Response.json({ preferences, theme });
}
```

## Security Considerations

### **1. Secure Settings**
- **Production**: Secure flag enabled
- **Development**: Secure flag disabled for localhost
- **HttpOnly**: Authentication cookies only
- **SameSite**: Lax for CSRF protection

### **2. Data Sensitivity**
- **No sensitive data** in client cookies
- **User preferences** only (no passwords/tokens)
- **Session data** handled by NextAuth.js

### **3. Expiration Policies**
- **Preferences**: 30 days
- **Temporary data**: 1 hour
- **Last visited**: 7 days
- **Session**: 24 hours (NextAuth default)

## Performance Optimization

### **1. Cookie Size Limits**
- **Individual cookies**: 4KB limit
- **Total cookies**: 40KB per domain
- **JSON serialization**: Efficient data storage

### **2. Debounced Updates**
- **Form auto-save**: 1 second debounce
- **Filter updates**: Immediate
- **Theme changes**: Immediate

### **3. Cleanup Strategy**
- **Expired cookies**: Automatic browser cleanup
- **Logout**: Clear all user cookies
- **Data rotation**: Temporary data expires automatically

## Testing

### **1. Cookie Persistence**
```typescript
// Test cookie persistence across page reloads
describe("Cookie Persistence", () => {
  it("should save theme preference", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByText("Switch to dark mode"));
    expect(document.cookie).toContain("mpesa-theme=dark");
  });
});
```

### **2. Server-side Access**
```typescript
// Test server-side cookie reading
describe("Server Cookies", () => {
  it("should read user preferences", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.preferences).toBeDefined();
  });
});
```

## Browser Compatibility

### **1. Modern Browsers**
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support

### **2. Mobile Browsers**
- **iOS Safari**: Full support
- **Chrome Mobile**: Full support
- **Samsung Internet**: Full support

### **3. Legacy Support**
- **IE11**: Not supported (use modern browsers)
- **Old Android**: Limited support

## Troubleshooting

### **1. Cookies Not Saving**
- **Check**: Browser cookie settings
- **Verify**: Domain and path configuration
- **Test**: Incognito mode behavior

### **2. Data Not Persisting**
- **Check**: Expiration settings
- **Verify**: JSON serialization
- **Test**: Cookie size limits

### **3. Performance Issues**
- **Monitor**: Cookie size
- **Optimize**: Debounced updates
- **Clean**: Expired cookies

## Migration Guide

### **From LocalStorage**
```typescript
// Before: LocalStorage
localStorage.setItem("theme", "dark");

// After: Cookies
ClientCookieManager.setTheme("dark");
```

### **From SessionStorage**
```typescript
// Before: SessionStorage
sessionStorage.setItem("formData", JSON.stringify(data));

// After: Cookies with expiration
ClientCookieManager.saveFormData("form-id", data);
```

## Best Practices

### **1. Data Structure**
- **Flat objects**: Easier serialization
- **Minimal data**: Reduce cookie size
- **Type safety**: Use TypeScript interfaces

### **2. Error Handling**
- **Graceful fallbacks**: Default values
- **Parse errors**: Try-catch blocks
- **Browser support**: Feature detection

### **3. User Experience**
- **Immediate feedback**: Show save status
- **Auto-save**: Prevent data loss
- **Persistence**: Remember user choices

## Future Enhancements

### **1. Advanced Features**
- **Cookie analytics**: Usage tracking
- **A/B testing**: Cookie-based experiments
- **Personalization**: AI-driven preferences

### **2. Performance**
- **Cookie compression**: Reduce size
- **Lazy loading**: On-demand cookies
- **Background sync**: Server synchronization

### **3. Security**
- **Cookie encryption**: Sensitive data
- **Signature verification**: Data integrity
- **Rate limiting**: Prevent abuse

## Summary

The cookie implementation provides:

- **Secure authentication** with proper cookie policies
- **Persistent user preferences** across sessions
- **Enhanced user experience** with state persistence
- **Developer-friendly APIs** for easy integration
- **TypeScript support** for type safety
- **Comprehensive testing** and documentation

**Cookies are now fully integrated and ready for production use!**
