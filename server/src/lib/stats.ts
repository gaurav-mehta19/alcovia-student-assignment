import { getSessionsSince } from './data';
import { StudentRow } from './serialize';
import { startOfToday, startOfWeek } from './time';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export function buildWeeklyStats(student: StudentRow, now = new Date()) {
  const weekStart = startOfWeek(now);
  const todayStart = startOfToday(now);
  const sessions = getSessionsSince(student.id, weekStart).filter((s) => s.status === 'completed');

  const counts = new Array(7).fill(0);
  let todayCompleted = 0;
  for (const s of sessions) {
    const index = (new Date(s.started_at).getDay() + 6) % 7;
    counts[index] += 1;
    if (s.started_at >= todayStart) todayCompleted += 1;
  }

  return {
    totalSessions: sessions.length,
    totalCoins: student.total_coins,
    streak: student.current_streak,
    todayCompleted,
    dailyGoal: student.daily_goal,
    sessionsPerDay: DAYS.map((day, i) => ({ day, count: counts[i] })),
  };
}
