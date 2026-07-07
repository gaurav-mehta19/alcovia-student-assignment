export type Filter = 'today' | 'week' | 'month';

const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfToday(now = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function startOfWeek(now = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const mondayOffset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  return d.getTime();
}

export function windowStart(filter: Filter, now = new Date()): number {
  if (filter === 'today') return startOfToday(now);
  if (filter === 'week') return startOfWeek(now);
  return startOfToday(now) - 30 * DAY_MS;
}
