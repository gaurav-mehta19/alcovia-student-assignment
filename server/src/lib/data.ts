import { getDb } from '../db';
import { CursorState } from './cursor';
import { AchievementRow, SessionRow, StudentRow, TimelineRow } from './serialize';

export function getStudent(id: string): StudentRow | undefined {
  return getDb().prepare('SELECT * FROM students WHERE id = ?').get(id) as StudentRow | undefined;
}

export interface PageParams {
  studentId: string;
  limit: number;
  cursor?: CursorState;
  since?: number;
}

export function getSessionsPage({ studentId, limit, cursor, since }: PageParams): SessionRow[] {
  const clauses = ['student_id = @studentId'];
  const params: Record<string, unknown> = { studentId, take: limit + 1 };
  if (since !== undefined) {
    clauses.push('started_at >= @since');
    params.since = since;
  }
  if (cursor) {
    clauses.push('(started_at < @curStarted OR (started_at = @curStarted AND id < @curId))');
    params.curStarted = cursor.startedAt;
    params.curId = cursor.id;
  }
  const sql = `SELECT * FROM sessions WHERE ${clauses.join(' AND ')}
    ORDER BY started_at DESC, id DESC LIMIT @take`;
  return getDb().prepare(sql).all(params) as SessionRow[];
}

export function getSession(studentId: string, sessionId: string): SessionRow | undefined {
  return getDb()
    .prepare('SELECT * FROM sessions WHERE id = ? AND student_id = ?')
    .get(sessionId, studentId) as SessionRow | undefined;
}

export function getTimeline(sessionId: string): TimelineRow[] {
  return getDb()
    .prepare('SELECT type, duration_ms, started_at FROM session_timeline WHERE session_id = ? ORDER BY id')
    .all(sessionId) as TimelineRow[];
}

export function getAchievements(studentId: string): AchievementRow[] {
  return getDb()
    .prepare('SELECT * FROM achievements WHERE student_id = ? ORDER BY unlocked_at IS NULL, progress DESC')
    .all(studentId) as AchievementRow[];
}

export function getSessionsSince(studentId: string, since: number): SessionRow[] {
  return getDb()
    .prepare('SELECT * FROM sessions WHERE student_id = ? AND started_at >= ? ORDER BY started_at DESC')
    .all(studentId, since) as SessionRow[];
}

export interface NewSession {
  id: string;
  studentId: string;
  type: string;
  durationMs: number;
  coins: number;
  startedAt: number;
  completedAt: number;
  timeline: { type: string; durationMs: number; startedAt: string }[];
}

export function insertSession(session: NewSession): void {
  const db = getDb();
  const tx = db.transaction((s: NewSession) => {
    db.prepare(
      `INSERT INTO sessions (id, student_id, type, duration_ms, coins, status, started_at, completed_at)
       VALUES (?, ?, ?, ?, ?, 'completed', ?, ?)`
    ).run(s.id, s.studentId, s.type, s.durationMs, s.coins, s.startedAt, s.completedAt);
    const insertT = db.prepare(
      'INSERT INTO session_timeline (session_id, type, duration_ms, started_at) VALUES (?, ?, ?, ?)'
    );
    for (const t of s.timeline) insertT.run(s.id, t.type, t.durationMs, t.startedAt);
    db.prepare('UPDATE students SET total_coins = total_coins + ? WHERE id = ?').run(s.coins, s.studentId);
  });
  tx(session);
}
