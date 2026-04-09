"use client";

import { useState } from "react";
import { useAppCookies, useTheme, useLanguage } from "@/hooks/useCookies";

export function CookieSettings() {
  const { preferences, updatePreference } = useAppCookies();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [showSaved, setShowSaved] = useState(false);

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    updatePreference(key as any, value);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleLanguageChange = (newLanguage: typeof language) => {
    setLanguage(newLanguage);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Cookie Settings</h2>
        {showSaved && (
          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
            Saved!
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Theme</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`px-4 py-2 rounded-lg border ${
                theme === "light"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`px-4 py-2 rounded-lg border ${
                theme === "dark"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`px-4 py-2 rounded-lg border ${
                theme === "system"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              System
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Language</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-4 py-2 rounded-lg border ${
                language === "en"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("sw")}
              className={`px-4 py-2 rounded-lg border ${
                language === "sw"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Swahili
            </button>
          </div>
        </div>

        {/* Date Format */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Date Format</h3>
          <select
            value={preferences.dateFormat}
            onChange={(e) => handlePreferenceChange("dateFormat", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Time Format */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Time Format</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handlePreferenceChange("timeFormat", "12h")}
              className={`px-4 py-2 rounded-lg border ${
                preferences.timeFormat === "12h"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              12-hour
            </button>
            <button
              onClick={() => handlePreferenceChange("timeFormat", "24h")}
              className={`px-4 py-2 rounded-lg border ${
                preferences.timeFormat === "24h"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              24-hour
            </button>
          </div>
        </div>

        {/* Currency */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Currency</h3>
          <select
            value={preferences.currency}
            onChange={(e) => handlePreferenceChange("currency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => 
                  handlePreferenceChange("notifications", {
                    ...preferences.notifications,
                    email: e.target.checked,
                  })
                }
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notifications.sms}
                onChange={(e) => 
                  handlePreferenceChange("notifications", {
                    ...preferences.notifications,
                    sms: e.target.checked,
                  })
                }
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">SMS notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) => 
                  handlePreferenceChange("notifications", {
                    ...preferences.notifications,
                    push: e.target.checked,
                  })
                }
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Push notifications</span>
            </label>
          </div>
        </div>

        {/* Dashboard Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Dashboard</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.dashboard.showQuickStats}
                onChange={(e) => 
                  handlePreferenceChange("dashboard", {
                    ...preferences.dashboard,
                    showQuickStats: e.target.checked,
                  })
                }
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show quick stats</span>
            </label>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Items per page</label>
              <select
                value={preferences.dashboard.itemsPerPage}
                onChange={(e) => 
                  handlePreferenceChange("dashboard", {
                    ...preferences.dashboard,
                    itemsPerPage: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Settings Display */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Settings</h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify(preferences, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
