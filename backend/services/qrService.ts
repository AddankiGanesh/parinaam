import { v4 as uuidv4 } from 'uuid';

/**
 * Service for generating and validating student festival QR pass tokens
 */
export class QRService {
  /**
   * Generates a 40-character secure alphanumeric token for digital QR pass
   */
  static generateToken(): string {
    return (uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '').slice(0, 8)).toUpperCase();
  }

  /**
   * Validates token format
   */
  static isValidToken(token?: string | null): boolean {
    if (!token) return false;
    return /^[A-Z0-9]{32,64}$/i.test(token.trim());
  }
}
