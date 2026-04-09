"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DebugUserInfo() {
  const { data: session, status } = useSession();
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.phone) {
      // Check user in database
      fetch(`/api/auth/check-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: session.user.phone }),
      })
        .then((res) => res.json())
        .then((data) => setDbUser(data))
        .catch((err) => console.error("Failed to check user:", err));
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug User Information</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Session Info</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Session:</strong> {session ? "Active" : "None"}</p>
              {session && (
                <>
                  <p><strong>User ID:</strong> {session.user?.id}</p>
                  <p><strong>Name:</strong> {session.user?.name}</p>
                  <p><strong>Phone:</strong> {session.user?.phone}</p>
                  <p><strong>Role:</strong> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{session.user?.role}</span></p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Database User Info</h2>
            <div className="space-y-2">
              <p><strong>DB Check:</strong> {dbUser ? "Success" : "Failed"}</p>
              {dbUser && (
                <>
                  <p><strong>Success:</strong> {dbUser.success ? "Yes" : "No"}</p>
                  <p><strong>User Role:</strong> <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{dbUser.user?.role}</span></p>
                  <p><strong>User Phone:</strong> {dbUser.user?.phone}</p>
                  <p><strong>User Name:</strong> {dbUser.user?.name}</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Routing Test</h2>
            <div className="space-y-4">
              <a href="/dashboard" className="text-blue-600 hover:text-blue-800 underline">
                Go to Landlord Dashboard
              </a>
              <br />
              <a href="/admin/dashboard" className="text-red-600 hover:text-red-800 underline">
                Go to Admin Dashboard
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Test Users</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Admin:</strong> 254700000001</p>
              <p><strong>Landlord 1:</strong> 254700000002</p>
              <p><strong>Landlord 2:</strong> 254700000003</p>
              <p><strong>Landlord 3:</strong> 254700000004</p>
              <p><strong>Landlord 4:</strong> 254700000005</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
