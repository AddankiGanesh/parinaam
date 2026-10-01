'use client';

import React from 'react';
import { ComingSoon } from '../../components/ui/ComingSoon';

export default function HospitalityPage() {
  return (
    <ComingSoon
      title="DELEGATE HOSPITALITY & CAMPUS ACCOMMODATION"
      subtitle="Hostel bookings, shuttle connectivity from Vijayawada / Guntur railway junctions, and campus dining passes."
      category="ACCOMMODATION DESK"
      expectedDate="OCTOBER 08, 2026"
      features={['Hostel Rooms Inside Campus', 'Complimentary Breakfast', '24/7 Security & High-speed WiFi']}
    />
  );
}
