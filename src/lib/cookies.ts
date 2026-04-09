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
export class CookieManager {
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

// Client-side cookie utilities
export class ClientCookieManager {
  static set(name: string, value: string, options: Partial<typeof DEFAULT_COOKIE_OPTIONS> = {}) {
    const mergedOptions = { ...DEFAULT_COOKIE_OPTIONS, ...options };
    document.cookie = serialize(name, value, mergedOptions);
  }

  static get(name: string): string | undefined {
    const cookies = parse(document.cookie);
    return cookies[name];
  }

  static delete(name: string) {
    document.cookie = serialize(name, "", {
      ...DEFAULT_COOKIE_OPTIONS,
      maxAge: -1,
    });
  }

  static setJSON<T>(name: string, value: T, options: Partial<typeof DEFAULT_COOKIE_OPTIONS> = {}) {
    this.set(name, JSON.stringify(value), options);
  }

  static getJSON<T>(name: string, defaultValue: T): T {
    const value = this.get(name);
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // User preferences (client-side)
  static setUserPreferences(preferences: Partial<UserPreferences>) {
    const current = this.getUserPreferences();
    const updated = { ...current, ...preferences };
    this.setJSON(COOKIE_NAMES.USER_PREFERENCES, updated);
  }

  static getUserPreferences(): UserPreferences {
    return this.getJSON(COOKIE_NAMES.USER_PREFERENCES, DEFAULT_PREFERENCES);
  }

  static updateUserPreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) {
    const current = this.getUserPreferences();
    this.setUserPreferences({ ...current, [key]: value });
  }

  // Theme (client-side)
  static setTheme(theme: UserPreferences["theme"]) {
    this.updateUserPreference("theme", theme);
    this.set(COOKIE_NAMES.THEME, theme);
  }

  static getTheme(): UserPreferences["theme"] {
    return this.get(COOKIE_NAMES.THEME) as UserPreferences["theme"] || this.getUserPreferences().theme;
  }

  // Clear all user cookies (client-side)
  static clearUserCookies() {
    Object.values(COOKIE_NAMES).forEach(name => {
      this.delete(name);
    });
  }

  // Language (client-side)
  static setLanguage(language: UserPreferences["language"]) {
    this.updateUserPreference("language", language);
    this.set(COOKIE_NAMES.LANGUAGE, language);
  }

  // Dashboard layout (client-side)
  static setDashboardLayout(layout: any) {
    this.setJSON(COOKIE_NAMES.DASHBOARD_LAYOUT, layout);
  }

  static getDashboardLayout() {
    return this.getJSON(COOKIE_NAMES.DASHBOARD_LAYOUT, null);
  }

  // Property filters (client-side)
  static setPropertyFilters(filters: any) {
    this.setJSON(COOKIE_NAMES.PROPERTY_FILTERS, filters);
  }

  static getPropertyFilters() {
    return this.getJSON(COOKIE_NAMES.PROPERTY_FILTERS, {});
  }

  // Tenant filters (client-side)
  static setTenantFilters(filters: any) {
    this.setJSON(COOKIE_NAMES.TENANT_FILTERS, filters);
  }

  static getTenantFilters() {
    return this.getJSON(COOKIE_NAMES.TENANT_FILTERS, {});
  }

  // Last visited page (client-side)
  static setLastVisitedPage(page: string) {
    this.set(COOKIE_NAMES.LAST_VISITED_PAGE, page, { maxAge: 7 * 24 * 60 * 60 }); // 7 days
  }

  static getLastVisitedPage(): string | undefined {
    return this.get(COOKIE_NAMES.LAST_VISITED_PAGE);
  }

  // Sidebar state (client-side)
  static setSidebarState(open: boolean) {
    this.set(COOKIE_NAMES.SIDEBAR_STATE, JSON.stringify(open));
  }

  static getSidebarState(): boolean {
    return this.getJSON(COOKIE_NAMES.SIDEBAR_STATE, true);
  }

  // Notification settings (client-side)
  static setNotificationSettings(settings: UserPreferences["notifications"]) {
    this.updateUserPreference("notifications", settings);
    this.setJSON(COOKIE_NAMES.NOTIFICATION_SETTINGS, settings);
  }

  static getNotificationSettings(): UserPreferences["notifications"] {
    return this.getJSON(COOKIE_NAMES.NOTIFICATION_SETTINGS, DEFAULT_PREFERENCES.notifications);
  }

  // Date range (client-side)
  static setDateRange(range: { start: string; end: string; preset?: string }) {
    this.setJSON(COOKIE_NAMES.DATE_RANGE, range, { maxAge: 24 * 60 * 60 }); // 1 day
  }

  static getDateRange() {
    return this.getJSON(COOKIE_NAMES.DATE_RANGE, { start: "", end: "", preset: "" });
  }

  // Form data (client-side)
  static saveFormData(formId: string, data: any) {
    this.setJSON(`mpesa-form-${formId}`, data, { maxAge: 60 * 60 }); // 1 hour
  }

  static getFormData(formId: string) {
    return this.getJSON(`mpesa-form-${formId}`, null);
  }

  static clearFormData(formId: string) {
    this.delete(`mpesa-form-${formId}`);
  }

  // Scroll position (client-side)
  static saveScrollPosition(page: string, position: { x: number; y: number }) {
    this.setJSON(`mpesa-scroll-${page}`, position, { maxAge: 60 * 60 }); // 1 hour
  }

  static getScrollPosition(page: string) {
    return this.getJSON(`mpesa-scroll-${page}`, { x: 0, y: 0 });
  }
}

// Utility functions for specific use cases
export const cookieUtils = {
  // Save user's last activity
  saveLastActivity: (userId: string) => {
    if (typeof window !== "undefined") {
      ClientCookieManager.set("mpesa-last-activity", JSON.stringify({
        userId,
        timestamp: new Date().toISOString(),
      }));
    }
  },

  // Get user's last activity
  getLastActivity: () => {
    if (typeof window !== "undefined") {
      return ClientCookieManager.getJSON("mpesa-last-activity", null);
    }
    return null;
  },

  // Save scroll position
  saveScrollPosition: (page: string, position: { x: number; y: number }) => {
    if (typeof window !== "undefined") {
      ClientCookieManager.setJSON(`mpesa-scroll-${page}`, position, { maxAge: 60 * 60 }); // 1 hour
    }
  },

  // Get scroll position
  getScrollPosition: (page: string) => {
    if (typeof window !== "undefined") {
      return ClientCookieManager.getJSON(`mpesa-scroll-${page}`, { x: 0, y: 0 });
    }
    return { x: 0, y: 0 };
  },

  // Save form data (auto-save)
  saveFormData: (formId: string, data: any) => {
    if (typeof window !== "undefined") {
      ClientCookieManager.setJSON(`mpesa-form-${formId}`, data, { maxAge: 60 * 60 }); // 1 hour
    }
  },

  // Get form data
  getFormData: (formId: string) => {
    if (typeof window !== "undefined") {
      return ClientCookieManager.getJSON(`mpesa-form-${formId}`, null);
    }
    return null;
  },

  // Clear form data
  clearFormData: (formId: string) => {
    if (typeof window !== "undefined") {
      ClientCookieManager.delete(`mpesa-form-${formId}`);
    }
  },
};
