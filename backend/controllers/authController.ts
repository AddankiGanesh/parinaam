import { db } from '../database/db';
import { signToken } from '../auth/auth';
import { QRService } from '../services/qrService';
import bcrypt from 'bcryptjs';

/**
 * Controller handling user authentication, student registration, and session retrieval
 */
export class AuthController {
  static async registerStudent(data: {
    student_type: 'amrita' | 'other';
    email: string;
    password: string;
    full_name: string;
    phone: string;
    college_name?: string;
    roll_number?: string;
    department?: string;
    year_of_study?: string;
    city?: string;
    id_card_url?: string;
  }) {
    const emailLower = data.email.toLowerCase().trim();
    const isAmritaDomain = emailLower.endsWith('@av.students.amrita.edu') || emailLower.endsWith('.amrita.edu') || emailLower.endsWith('@amrita.edu');
    const isAmritaStudent = data.student_type === 'amrita' || (data.student_type !== 'other' && isAmritaDomain);

    const passwordHash = await bcrypt.hash(data.password, 12);
    const qrToken = QRService.generateToken();

    const result = await db.query(
      `INSERT INTO users (
        email, password_hash, full_name, phone,
        college_name, is_amrita_student, roll_number, department,
        year_of_study, city, verification_status, qr_token,
        email_verify_token, email_verified, platform_fee_paid, id_card_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING id, email, full_name, role, is_amrita_student, verification_status, qr_token, platform_fee_paid, id_card_url`,
      [
        emailLower,
        passwordHash,
        data.full_name,
        data.phone,
        data.college_name || (isAmritaStudent ? 'Amrita Vishwa Vidyapeetham, Amaravati' : null),
        isAmritaStudent,
        data.roll_number || null,
        data.department || null,
        data.year_of_study || null,
        data.city || (isAmritaStudent ? 'Amaravati' : null),
        'pending',
        qrToken,
        qrToken,
        true,
        false,
        data.id_card_url || null,
      ]
    );

    return result.rows[0];
  }
}
