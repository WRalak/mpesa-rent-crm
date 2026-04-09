import { cookies } from "next/headers";
import { serialize, parse } from "cookie";

// Cookie names
export const COOKIE_NAMES = {
  USER_PREFERENCES: "mpesa-user-prefs",
  THEME: "mpesa-theme",
  LANGUAGE: "mpesa-language",
  DASHBOARD_LAYOUT: "mpesa-dashboard-layout",
  PROPERTY_FILTERS: "mpesa-property-filters",
  TENANT_FILTERS: "mpesa-tenant-filters",
  LAST_VISITED_PAGE: "mpesa-last-visited",
  SIDEBAR_STATE: "mpesa-sidebar-state",
  NOTIFICATION_SETTINGS: "mpesa-notifications",
  DATE_RANGE: "mpesa-date-range",
} as const;

// Default cookie options
const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

// User preferences interface
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "en" | "sw";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  currency: "KES" | "USD" | "EUR";
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dashboard: {
    defaultView: "grid" | "list";
    itemsPerPage: number;
    showQuickStats: boolean;
  };
}

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "en",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
  currency: "KES",
  timezone: "Africa/Nairobi",
  notifications: {
    email: true,
    sms: true,
    push: false,
  },
  dashboard: {
    defaultView: "grid",
    itemsPerPage: 10,
    showQuickStats: true,
  },
};

// Server-side cookie functions
export class ServerCookieManager {
  static async set(name: string, value: string, options: Partial<typeof DEFAULT_COOKIE_OPTIONS> = {}) {
    const cookieStore = await cookies();
    const mergedOptions = { ...DEFAULT_COOKIE_OPTIONS, ...options };
    
    cookieStore.set(name, value, mergedOptions);
  }

  static async get(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  }

  static async delete(name: string) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  }

  static async setJSON<T>(name: string, value: T, options: Partial<typeof DEFAULT_COOKIE_OPTIONS> = {}) {
    await this.set(name, JSON.stringify(value), options);
  }

  static async getJSON<T>(name: string, defaultValue: T): Promise<T> {
    const value = await this.get(name);
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // User preferences
  static async setUserPreferences(preferences: Partial<UserPreferences>) {
    const current = await this.getUserPreferences();
    const updated = { ...current, ...preferences };
    await this.setJSON(COOKIE_NAMES.USER_PREFERENCES, updated);
  }

  static async getUserPreferences(): Promise<UserPreferences> {
    return await this.getJSON(COOKIE_NAMES.USER_PREFERENCES, DEFAULT_PREFERENCES);
  }

  static async updateUserPreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) {
    const current = await this.getUserPreferences();
    await this.setUserPreferences({ ...current, [key]: value });
  }

  // Theme
  static async setTheme(theme: UserPreferences["theme"]) {
    await this.updateUserPreference("theme", theme);
    await this.set(COOKIE_NAMES.THEME, theme);
  }

  static async getTheme(): Promise<UserPreferences["theme"]> {
    const themeCookie = await this.get(COOKIE_NAMES.THEME);
    const userPrefs = await this.getUserPreferences();
    return (themeCookie as UserPreferences["theme"]) || userPrefs.theme;
  }

  // Language
  static async setLanguage(language: UserPreferences["language"]) {
    await this.updateUserPreference("language", language);
    await this.set(COOKIE_NAMES.LANGUAGE, language);
  }

  static async getLanguage(): Promise<UserPreferences["language"]> {
    const langCookie = await this.get(COOKIE_NAMES.LANGUAGE);
    const userPrefs = await this.getUserPreferences();
    return (langCookie as UserPreferences["language"]) || userPrefs.language;
  }

  // Dashboard layout
  static async setDashboardLayout(layout: any) {
    await this.setJSON(COOKIE_NAMES.DASHBOARD_LAYOUT, layout);
  }

  static async getDashboardLayout() {
    return await this.getJSON(COOKIE_NAMES.DASHBOARD_LAYOUT, null);
  }

  // Property filters
  static async setPropertyFilters(filters: any) {
    await this.setJSON(COOKIE_NAMES.PROPERTY_FILTERS, filters);
  }

  static async getPropertyFilters() {
    return await this.getJSON(COOKIE_NAMES.PROPERTY_FILTERS, {});
  }

  // Tenant filters
  static async setTenantFilters(filters: any) {
    await this.setJSON(COOKIE_NAMES.TENANT_FILTERS, filters);
  }

  static async getTenantFilters() {
    return await this.getJSON(COOKIE_NAMES.TENANT_FILTERS, {});
  }

  // Last visited page
  static async setLastVisitedPage(page: string) {
    await this.set(COOKIE_NAMES.LAST_VISITED_PAGE, page, { maxAge: 7 * 24 * 60 * 60 }); // 7 days
  }

  static async getLastVisitedPage(): Promise<string | undefined> {
    return await this.get(COOKIE_NAMES.LAST_VISITED_PAGE);
  }

  // Sidebar state
  static async setSidebarState(open: boolean) {
    await this.set(COOKIE_NAMES.SIDEBAR_STATE, JSON.stringify(open));
  }

  static async getSidebarState(): Promise<boolean> {
    return await this.getJSON(COOKIE_NAMES.SIDEBAR_STATE, true);
  }

  // Notification settings
  static async setNotificationSettings(settings: UserPreferences["notifications"]) {
    await this.updateUserPreference("notifications", settings);
    await this.setJSON(COOKIE_NAMES.NOTIFICATION_SETTINGS, settings);
  }

  static async getNotificationSettings(): Promise<UserPreferences["notifications"]> {
    return await this.getJSON(COOKIE_NAMES.NOTIFICATION_SETTINGS, DEFAULT_PREFERENCES.notifications);
  }

  // Date range
  static async setDateRange(range: { start: string; end: string; preset?: string }) {
    await this.setJSON(COOKIE_NAMES.DATE_RANGE, range, { maxAge: 24 * 60 * 60 }); // 1 day
  }

  static async getDateRange() {
    return await this.getJSON(COOKIE_NAMES.DATE_RANGE, { start: "", end: "", preset: "" });
  }

  // Clear all user cookies (for logout)
  static async clearUserCookies() {
    const cookieStore = await cookies();
    Object.values(COOKIE_NAMES).forEach(name => {
      cookieStore.delete(name);
    });
  }
}
