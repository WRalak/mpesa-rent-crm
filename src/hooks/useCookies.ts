"use client";

import { useState, useEffect, useCallback } from "react";
import { ClientCookieManager, COOKIE_NAMES, DEFAULT_PREFERENCES, type UserPreferences } from "@/lib/cookies";

// Cookie hook for client-side usage
export function useCookies() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load preferences from cookies
    const savedPreferences = ClientCookieManager.getUserPreferences();
    setPreferences(savedPreferences);
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    ClientCookieManager.setUserPreferences(updated);
  }, [preferences]);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    ClientCookieManager.updateUserPreference(key, value);
  }, [preferences]);

  return {
    preferences,
    updatePreferences,
    updatePreference,
    mounted,
  };
}

// Theme hook
export function useTheme() {
  const { preferences, updatePreference } = useCookies();
  const [theme, setTheme] = useState(preferences.theme);

  useEffect(() => {
    setTheme(preferences.theme);
  }, [preferences.theme]);

  const changeTheme = useCallback((newTheme: UserPreferences["theme"]) => {
    setTheme(newTheme);
    updatePreference("theme", newTheme);
    ClientCookieManager.setTheme(newTheme);
    
    // Apply theme to document
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      
      if (newTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(newTheme);
      }
    }
  }, [updatePreference]);

  return { theme, setTheme: changeTheme };
}

// Language hook
export function useLanguage() {
  const { preferences, updatePreference } = useCookies();
  const [language, setLanguage] = useState(preferences.language);

  useEffect(() => {
    setLanguage(preferences.language);
  }, [preferences.language]);

  const changeLanguage = useCallback((newLanguage: UserPreferences["language"]) => {
    setLanguage(newLanguage);
    updatePreference("language", newLanguage);
    ClientCookieManager.setLanguage(newLanguage);
  }, [updatePreference]);

  return { language, setLanguage: changeLanguage };
}

// Dashboard preferences hook
export function useDashboardPreferences() {
  const { preferences, updatePreference } = useCookies();

  const updateDashboardPref = useCallback(<K extends keyof UserPreferences["dashboard"]>(
    key: K,
    value: UserPreferences["dashboard"][K]
  ) => {
    const updatedDashboard = { ...preferences.dashboard, [key]: value };
    updatePreference("dashboard", updatedDashboard);
  }, [preferences, updatePreference]);

  return {
    dashboard: preferences.dashboard,
    updateDashboardPref,
  };
}

// Notification settings hook
export function useNotifications() {
  const { preferences, updatePreference } = useCookies();

  const updateNotificationSetting = useCallback(<K extends keyof UserPreferences["notifications"]>(
    key: K,
    value: UserPreferences["notifications"][K]
  ) => {
    const updatedNotifications = { ...preferences.notifications, [key]: value };
    updatePreference("notifications", updatedNotifications);
    ClientCookieManager.setNotificationSettings(updatedNotifications);
  }, [preferences, updatePreference]);

  return {
    notifications: preferences.notifications,
    updateNotificationSetting,
  };
}

// Property filters hook
export function usePropertyFilters() {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const savedFilters = ClientCookieManager.getPropertyFilters();
    setFilters(savedFilters);
  }, []);

  const updateFilters = useCallback((newFilters: any) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    ClientCookieManager.setPropertyFilters(updated);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    ClientCookieManager.setPropertyFilters({});
  }, []);

  return { filters, updateFilters, clearFilters };
}

// Tenant filters hook
export function useTenantFilters() {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const savedFilters = ClientCookieManager.getTenantFilters();
    setFilters(savedFilters);
  }, []);

  const updateFilters = useCallback((newFilters: any) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    ClientCookieManager.setTenantFilters(updated);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    ClientCookieManager.setTenantFilters({});
  }, []);

  return { filters, updateFilters, clearFilters };
}

// Last visited page hook
export function useLastVisitedPage() {
  const [lastPage, setLastPage] = useState<string | undefined>();

  useEffect(() => {
    const saved = ClientCookieManager.get(COOKIE_NAMES.LAST_VISITED_PAGE);
    setLastPage(saved);
  }, []);

  const savePage = useCallback((page: string) => {
    setLastPage(page);
    ClientCookieManager.setLastVisitedPage(page);
  }, []);

  return { lastPage, savePage };
}

// Sidebar state hook
export function useSidebarState() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const saved = ClientCookieManager.getSidebarState();
    setIsOpen(saved);
  }, []);

  const toggleSidebar = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    ClientCookieManager.setSidebarState(newState);
  }, [isOpen]);

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsOpen(open);
    ClientCookieManager.setSidebarState(open);
  }, []);

  return { isOpen, toggleSidebar, setSidebarOpen };
}

// Date range hook
export function useDateRange() {
  const [dateRange, setDateRange] = useState({ start: "", end: "", preset: "" });

  useEffect(() => {
    const saved = ClientCookieManager.getDateRange();
    setDateRange(saved);
  }, []);

  const updateDateRange = useCallback((newRange: { start: string; end: string; preset?: string }) => {
    const updated = { ...dateRange, ...newRange };
    setDateRange(updated);
    ClientCookieManager.setDateRange(updated);
  }, [dateRange]);

  const clearDateRange = useCallback(() => {
    setDateRange({ start: "", end: "", preset: "" });
    ClientCookieManager.setDateRange({ start: "", end: "", preset: "" });
  }, []);

  return { dateRange, updateDateRange, clearDateRange };
}

// Form auto-save hook
export function useFormAutoSave<T>(formId: string, data: T, debounceMs = 1000) {
  const [savedData, setSavedData] = useState<T | null>(null);

  useEffect(() => {
    const saved = ClientCookieManager.getFormData(formId);
    setSavedData(saved);
  }, [formId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data) {
        ClientCookieManager.saveFormData(formId, data);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [data, formId, debounceMs]);

  const clearSavedData = useCallback(() => {
    setSavedData(null);
    ClientCookieManager.clearFormData(formId);
  }, [formId]);

  return { savedData, clearSavedData };
}

// Scroll position hook
export function useScrollPosition(page: string) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const saved = ClientCookieManager.getScrollPosition(page);
    setPosition(saved);
  }, [page]);

  const savePosition = useCallback((x: number, y: number) => {
    setPosition({ x, y });
    ClientCookieManager.saveScrollPosition(page, { x, y });
  }, [page]);

  const restorePosition = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(position.x, position.y);
    }
  }, [position]);

  return { position, savePosition, restorePosition };
}

// Combined hook for common cookie operations
export function useAppCookies() {
  const cookies = useCookies();
  const theme = useTheme();
  const language = useLanguage();
  const dashboard = useDashboardPreferences();
  const notifications = useNotifications();
  const propertyFilters = usePropertyFilters();
  const tenantFilters = useTenantFilters();
  const lastPage = useLastVisitedPage();
  const sidebar = useSidebarState();

  return {
    ...cookies,
    theme,
    language,
    dashboard,
    notifications,
    propertyFilters,
    tenantFilters,
    lastPage,
    sidebar,
  };
}
