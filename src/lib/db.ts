import { Pool, PoolClient } from 'pg';
import { mockDb } from './mockStore';

/**
 * MOCK MODE: Active ONLY when DATABASE_URL is not set AND MOCK_DB=true is explicitly configured.
 * Intended for local development without a real database.
 *
 * When DATABASE_URL is configured, ALL queries target PostgreSQL exclusively.
 * A PostgreSQL connection failure is surfaced as an error — there is NO silent fallback to mockStore.
 */
function normalizeConnectionString(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  let cleaned = rawUrl.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  const schemeMatch = cleaned.match(/^(postgres(?:ql)?:\/\/)(.*)$/);
  if (schemeMatch) {
    const scheme = schemeMatch[1];
    const rest = schemeMatch[2];
    const atIdx = rest.indexOf('@');
    if (atIdx !== -1) {
      const userInfo = rest.substring(0, atIdx);
      if (!userInfo.includes(':')) {
        cleaned = scheme + 'postgres:' + rest;
      }
    }
  }
  return cleaned;
}

const cleanedDbUrl = normalizeConnectionString(process.env.DATABASE_URL);
const IS_MOCK_MODE = !cleanedDbUrl && process.env.MOCK_DB === 'true';

/**
 * The pg Pool is created only when DATABASE_URL is configured.
 * Lazily connecting avoids startup failures when DATABASE_URL is intentionally absent (mock mode).
 */
const pool: Pool | null = cleanedDbUrl
  ? new Pool({
      connectionString: cleanedDbUrl,
      ssl: cleanedDbUrl.includes('rds.amazonaws.com')
        ? { rejectUnauthorized: false }
        : process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : null;

if (pool) {
  pool.on('error', (err) => {
    // Log without exposing connection string or credentials
    console.error('[DB] Unexpected PostgreSQL pool error:', err.message);
  });
}

export const db = {
  /**
   * Execute a single SQL query.
   *
   * Routing rules (evaluated in order):
   *   1. DATABASE_URL configured → PostgreSQL. Errors propagate — NO mockStore fallback.
   *   2. DATABASE_URL not set + MOCK_DB=true → in-memory mockStore (explicit dev mode).
   *   3. DATABASE_URL not set + MOCK_DB not set → throws a configuration error.
   */
  query: async (text: string, params?: unknown[]): Promise<{ rows: any[]; rowCount: number }> => {
    if (pool) {
      // Real PostgreSQL — errors are thrown to the caller, never swallowed.
      const res = await pool.query(text, params as any[]);
      return {
        rows: res.rows || [],
        rowCount: res.rowCount ?? (res.rows ? res.rows.length : 0),
      };
    }

    if (IS_MOCK_MODE) {
      // Explicit development mock mode (no DATABASE_URL, MOCK_DB=true).
      if (process.env.NODE_ENV === 'development') {
        console.log('[MockDB]', text.slice(0, 80).replace(/\s+/g, ' '));
      }
      return mockDb.executeQuery(text, (params || []) as any[]);
    }

    // Neither a real database nor explicit mock mode — surface the misconfiguration.
    throw new Error(
      '[DB] Database not configured. ' +
        'Set DATABASE_URL to connect to PostgreSQL, ' +
        'or set MOCK_DB=true for local development without a database.'
    );
  },

  /**
   * Acquire a dedicated PoolClient for explicit transaction management (BEGIN / COMMIT / ROLLBACK).
   *
   * IMPORTANT: Callers are responsible for calling client.release() in a finally block.
   * Only available when DATABASE_URL is configured. Not supported in mock mode —
   * transactional payment routes require a real PostgreSQL connection.
   */
  getClient: async (): Promise<PoolClient> => {
    if (!pool) {
      throw new Error(
        '[DB] Cannot acquire a database client: DATABASE_URL is not configured. ' +
          'Transactional operations require a real PostgreSQL connection.'
      );
    }
    return pool.connect();
  },
};

export default pool;
