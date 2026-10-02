/**
 * Institutional Email & Fee Policy Helper
 * 
 * Centralized business logic for identifying institutional student email domains
 * (e.g. Amrita Vishwa Vidyapeetham) and calculating platform & event registration fees.
 */

// Recognized institutional email domains
export const RECOGNIZED_INSTITUTION_DOMAINS = [
  'av.students.amrita.edu',
  'students.amrita.edu',
  'amrita.edu',
  'cb.amrita.edu',
  'amritanet.edu',
];

// Standard non-Amrita platform registration fee in INR
export const STANDARD_PLATFORM_FEE_INR = 150;

/**
 * Checks if an email address belongs to a recognized institutional domain.
 */
export function isInstitutionalEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const lower = email.toLowerCase().trim();
  return RECOGNIZED_INSTITUTION_DOMAINS.some(domain => lower.endsWith(`@${domain}`) || lower.endsWith(`.${domain}`));
}

export interface FeeUserContext {
  email: string;
  is_amrita_student: boolean;
  platform_fee_paid: boolean;
}

export interface EventFeeItem {
  id: string;
  fee: number;
}

export interface FeeBreakdown {
  eventFeesTotal: number;
  platformFee: number;
  platformFeeWaived: boolean;
  totalFee: number;
}

/**
 * Calculates the exact payable fee breakdown for a user and a list of events.
 * Server-side source of truth for checkout and cart calculation.
 */
export function calculatePayableFees(user: FeeUserContext, events: EventFeeItem[]): FeeBreakdown {
  const isAmrita = user.is_amrita_student || isInstitutionalEmail(user.email);
  
  // Sum event-specific fees (always follow individual event pricing)
  const eventFeesTotal = events.reduce((sum, item) => sum + Math.max(0, Number(item.fee) || 0), 0);
  
  // Platform fee policy:
  // - Waived for Amrita students (₹0)
  // - Waived if non-Amrita student already paid platform fee previously
  // - Standard platform fee (₹150) applied if non-Amrita student registering for the first time
  let platformFee = 0;
  let platformFeeWaived = false;

  if (isAmrita) {
    platformFee = 0;
    platformFeeWaived = true;
  } else if (user.platform_fee_paid) {
    platformFee = 0;
    platformFeeWaived = false;
  } else {
    platformFee = STANDARD_PLATFORM_FEE_INR;
    platformFeeWaived = false;
  }

  const totalFee = eventFeesTotal + platformFee;

  return {
    eventFeesTotal,
    platformFee,
    platformFeeWaived,
    totalFee,
  };
}
