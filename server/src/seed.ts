import achievements from '../fixtures/achievements.json';
import rawSessions from '../fixtures/sessions.json';
import students from '../fixtures/students.json';
import { getDb, initDb } from './db';

type Timeline = { type: string; durationMs: number; startedAt: string };
type Seed = (typeof rawSessions)[number] & { timeline?: Timeline[] };

function rebaseToNow(list: Seed[]): Seed[] {
  const maxStarted = Math.max(...list.map((s) => s.startedAt));
  const delta = Date.now() - 60 * 60 * 1000 - maxStarted;
  return list.map((s) => {
    const startedAt = s.startedAt + delta;
    let cursor = startedAt;
    const timeline = (s.timeline ?? []).map((t) => {
      const entry = { ...t, startedAt: new Date(cursor).toISOString() };
      cursor += t.durationMs;
      return entry;
    });
    return { ...s, startedAt, completedAt: s.completedAt == null ? null : s.completedAt + delta, timeline };
  });
}

export function seed() {
  const sessions = rebaseToNow(rawSessions as Seed[]);
  initDb();
  const db = getDb();

  db.exec('DELETE FROM session_timeline');
  db.exec('DELETE FROM streak_notifications');
  db.exec('DELETE FROM achievements');
  db.exec('DELETE FROM sessions');
  db.exec('DELETE FROM students');

  const insertStudent = db.prepare(`
    INSERT INTO students (id, name, initials, total_coins, current_streak, daily_goal, joined_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSession = db.prepare(`
    INSERT INTO sessions (id, student_id, type, duration_ms, coins, status, started_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTimeline = db.prepare(`
    INSERT INTO session_timeline (session_id, type, duration_ms, started_at)
    VALUES (?, ?, ?, ?)
  `);
  const insertAchievement = db.prepare(`
    INSERT INTO achievements (id, name, description, icon, student_id, unlocked_at, progress, target, current)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedAll = db.transaction(() => {
    for (const s of students) {
      insertStudent.run(s.id, s.name, s.initials, s.totalCoins, s.currentStreak, s.dailyGoal, s.joinedAt);
    }
    for (const s of sessions) {
      insertSession.run(s.id, s.studentId, s.type, s.durationMs, s.coins, s.status, s.startedAt, s.completedAt);
      for (const t of s.timeline ?? []) insertTimeline.run(s.id, t.type, t.durationMs, t.startedAt);
    }
    for (const a of achievements) {
      insertAchievement.run(a.id, a.name, a.description, a.icon, a.studentId, a.unlockedAt, a.progress, a.target, a.current);
    }
  });

  seedAll();
  return { students: students.length, sessions: sessions.length, achievements: achievements.length };
}

if (require.main === module) {
  const counts = seed();
  console.log(`Seeded: ${counts.students} students, ${counts.sessions} sessions, ${counts.achievements} achievements`);
}
