import { badRequest } from './errors';
import { Filter } from './time';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const TYPES = ['deep_focus', 'quick_sprint', 'pomodoro'];
const FILTERS = ['today', 'week', 'month'];

export function parseLimit(raw: unknown): number {
  if (raw === undefined) return DEFAULT_LIMIT;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) throw badRequest('limit must be a positive integer');
  return Math.min(value, MAX_LIMIT);
}

export function parseFilter(raw: unknown): Filter | undefined {
  if (raw === undefined || raw === '') return undefined;
  if (typeof raw !== 'string' || !FILTERS.includes(raw)) {
    throw badRequest('filter must be today, week, or month');
  }
  return raw as Filter;
}

export interface SessionBody {
  type: string;
  durationMs: number;
  timeline: { type: string; durationMs: number; startedAt: string }[];
}

export function parseSessionBody(body: unknown): SessionBody {
  if (typeof body !== 'object' || body === null) throw badRequest('Body must be an object');
  const b = body as Record<string, unknown>;
  if (typeof b.type !== 'string' || !TYPES.includes(b.type)) throw badRequest('Invalid session type');
  if (typeof b.durationMs !== 'number' || b.durationMs <= 0) throw badRequest('durationMs must be positive');
  const timeline = Array.isArray(b.timeline) ? b.timeline : [];
  for (const entry of timeline) {
    const e = entry as Record<string, unknown>;
    if (
      typeof e.type !== 'string' ||
      !['focus', 'break'].includes(e.type) ||
      typeof e.durationMs !== 'number' ||
      typeof e.startedAt !== 'string'
    ) {
      throw badRequest('Invalid timeline entry');
    }
  }
  return { type: b.type, durationMs: b.durationMs, timeline: timeline as SessionBody['timeline'] };
}
