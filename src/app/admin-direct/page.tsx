'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [authCheckInfo, setAuthCheckInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch auth info directly
    const fetchAuthInfo = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json();
        setAuthInfo(data);
      } catch (error) {
        console.error('Error fetching auth info:', error);
      }
    };

    fetchAuthInfo();
  }, []);

  // Function to check auth status
  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/check', {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      setAuthCheckInfo(data);
      alert('Auth check completed. See results below.');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthCheckInfo({ success: false, error: String(error) });
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Direct Access (Bypass Middleware)</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">User from Context:</span>{' '}
            {user ? (
              <span className="text-green-600">
                Logged in as {user.email} (Role: {user.role})
              </span>
            ) : (
              <span className="text-red-600">Not logged in</span>
            )}
          </p>

          <p>
            <span className="font-medium">Auth API Response:</span>{' '}
            {authInfo ? (
              <span className="text-green-600">
                {authInfo.success ? 'Authenticated' : 'Not authenticated'}
                {authInfo.user && ` as ${authInfo.user.email} (Role: ${authInfo.user.role})`}
              </span>
            ) : (
              <span className="text-gray-600">Loading...</span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Admin Page (With Middleware)
        </button>

        <a
          href="/admin"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4 inline-block"
        >
          Direct Link to Admin (Bypass Router)
        </a>

        <button
          onClick={checkAuthStatus}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ml-4"
        >
          Check Auth Status
        </button>

        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-4"
        >
          Go to Login Page
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <pre className="text-xs overflow-auto max-h-60">
          {JSON.stringify({
            user,
            authInfo,
            authCheckInfo: authCheckInfo || 'Not checked yet'
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
