import { countCompletedSince, getWeekdayCounts } from './data';
import { StudentRow } from './serialize';
import { startOfToday, startOfWeek } from './time';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DOW: Record<(typeof DAYS)[number], number> = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0 };

export function buildWeeklyStats(student: StudentRow, now = new Date()) {
  const weekStart = startOfWeek(now);
  const counts = new Map(getWeekdayCounts(student.id, weekStart).map((r) => [r.dow, r.n]));
  const sessionsPerDay = DAYS.map((day) => ({ day, count: counts.get(DOW[day]) ?? 0 }));

  return {
    totalSessions: sessionsPerDay.reduce((sum, d) => sum + d.count, 0),
    totalCoins: student.total_coins,
    streak: student.current_streak,
    todayCompleted: countCompletedSince(student.id, startOfToday(now)),
    dailyGoal: student.daily_goal,
    sessionsPerDay,
  };
}
