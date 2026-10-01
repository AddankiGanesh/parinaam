import { Pool } from 'pg';
import { mockDb } from './mockStore';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 1500, // Quick timeout before fallback
});

let postgresAvailable = true;

pool.on('error', (err) => {
  postgresAvailable = false;
  console.warn('PostgreSQL idle client notice (falling back to mock in-memory DB if disconnected):', err.message);
});

export const db = {
  query: async (text: string, params?: unknown[]): Promise<{ rows: any[]; rowCount: number }> => {
    // If PostgreSQL URL is configured and working, attempt live query
    if (process.env.DATABASE_URL && postgresAvailable) {
      try {
        const start = Date.now();
        const res = await pool.query(text, params as any[]);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development') {
          console.log('Executed live PostgreSQL query', { text: text.slice(0, 60), duration, rows: res.rowCount });
        }
        return { rows: res.rows, rowCount: res.rowCount ?? res.rows.length };
      } catch (err: any) {
        console.warn(`[DB notice] PostgreSQL query error (${err.message}). Using built-in store.`);
        postgresAvailable = false;
      }
    }

    // Fallback in-memory database
    const start = Date.now();
    const res = await mockDb.executeQuery(text, (params || []) as any[]);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed In-Memory query', { text: text.slice(0, 60), duration, rows: res.rowCount });
    }
    return res;
  },
  getClient: () => pool.connect(),
};

export default pool;
