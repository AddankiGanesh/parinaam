'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegistrationFlow } from '../../components/registration/RegistrationFlow';

function RegistrationContent() {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('event') || undefined;

  return (
    <div className="pt-28 pb-20">
      <RegistrationFlow initialEventId={initialEventId} />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-slate-400 font-mono">Loading registration portal...</div>}>
      <RegistrationContent />
    </Suspense>
  );
}
