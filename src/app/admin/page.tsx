'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminRootRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/auth/login');
      return;
    }

    if (user.role === 'super_admin') {
      router.replace('/superadmin');
    } else if (user.role === 'club_admin') {
      const slug = user.club_slug || 'chakravyuha';
      router.replace(`/admin/${slug}`);
    } else {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#05030a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Routing to your administration portal...</p>
      </div>
    </div>
  );
}
