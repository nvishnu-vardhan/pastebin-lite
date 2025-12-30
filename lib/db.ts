import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export type Paste = {
  id: string;
  content: string;
  created_at: string;
  expires_at: string | null;
  max_views: number | null;
  view_count: number;
};

// Generate unique 16-character ID
export function generatePasteId(): string {
  return crypto.randomBytes(8).toString('hex');
}

// Get current time (respects TEST_MODE)
export function getCurrentTime(): Date {
  if (process.env.TEST_MODE === '1') {
    const testNowMs = process.env.X_TEST_NOW_MS;
    if (testNowMs) {
      return new Date(parseInt(testNowMs));
    }
  }
  return new Date();
}

// Create a new paste
export async function createPaste(
  content: string,
  ttlSeconds?: number,
  maxViews?: number
): Promise<Paste> {
  const id = generatePasteId();
  const now = new Date();
  let expiresAt: Date | null = null;

  if (ttlSeconds && ttlSeconds > 0) {
    expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
  }

  try {
    const result = await sql`
      INSERT INTO pastes (id, content, created_at, expires_at, max_views, view_count)
      VALUES (${id}, ${content}, ${now.toISOString()}, ${expiresAt?.toISOString() || null}, ${maxViews || null}, 0)
      RETURNING *
    `;

    return result.rows[0] as Paste;
  } catch (error) {
    console.error('Error creating paste:', error);
    throw error;
  }
}

// Fetch a paste and increment view count
export async function getPaste(id: string): Promise<Paste | null> {
  try {
    const result = await sql`SELECT * FROM pastes WHERE id = ${id}`;
    
    if (result.rows.length === 0) {
      return null;
    }

    const paste = result.rows[0] as Paste;
    const now = getCurrentTime();

    // Check if expired
    if (paste.expires_at && new Date(paste.expires_at) < now) {
      return null;
    }

    // Check if view limit exceeded
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return null;
    }

    // Increment view count
    await sql`UPDATE pastes SET view_count = view_count + 1 WHERE id = ${id}`;

    return paste;
  } catch (error) {
    console.error('Error fetching paste:', error);
    throw error;
  }
}

// Check paste availability without incrementing
export async function checkPasteAvailability(id: string): Promise<boolean> {
  try {
    const result = await sql`SELECT * FROM pastes WHERE id = ${id}`;
    
    if (result.rows.length === 0) {
      return false;
    }

    const paste = result.rows[0] as Paste;
    const now = getCurrentTime();

    // Check if expired
    if (paste.expires_at && new Date(paste.expires_at) < now) {
      return false;
    }

    // Check if view limit exceeded
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking paste availability:', error);
    return false;
  }
}
