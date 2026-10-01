import { db } from '../database/db';

/**
 * Service for Super Admin student profile & pass verification workflows
 */
export class VerificationService {
  /**
   * Approves or rejects a student verification request
   */
  static async verifyStudent(
    studentId: string,
    status: 'verified' | 'rejected',
    verifierId: string,
    note?: string
  ) {
    const res = await db.query(
      `UPDATE users
       SET verification_status = $1,
           verification_note   = $2,
           platform_fee_paid   = CASE WHEN $1 = 'verified' THEN TRUE ELSE platform_fee_paid END,
           verified_at         = NOW(),
           verified_by         = $3
       WHERE id = $4
       RETURNING id, full_name, email, verification_status, platform_fee_paid`,
      [status, note || null, verifierId, studentId]
    );

    return res.rows[0];
  }

  /**
   * Retrieves summary statistics of all student verification statuses
   */
  static async getVerificationStats() {
    const res = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_amrita_student = TRUE) as amrita_count,
        COUNT(*) FILTER (WHERE is_amrita_student = FALSE) as external_count,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_count
      FROM users
      WHERE role = 'student'
    `);
    return res.rows[0];
  }
}
