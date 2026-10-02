'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PassPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/pass');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05030a] pt-28 pb-20 flex items-center justify-center text-slate-400 font-mono text-sm">
      <span>Redirecting to your digital pass...</span>
    </div>
  );
}
