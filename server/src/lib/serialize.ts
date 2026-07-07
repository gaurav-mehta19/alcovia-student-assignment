export interface StudentRow {
  id: string;
  name: string;
  initials: string;
  total_coins: number;
  current_streak: number;
  daily_goal: number;
  joined_at: string;
}

export interface SessionRow {
  id: string;
  student_id: string;
  type: string;
  duration_ms: number;
  coins: number;
  status: string;
  started_at: number;
  completed_at: number | null;
}

export interface TimelineRow {
  type: string;
  duration_ms: number;
  started_at: string;
}

export interface AchievementRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at: string | null;
  progress: number;
  target: number;
  current: number;
}

const toIso = (ms: number | null) => (ms === null ? null : new Date(ms).toISOString());

export const toStudent = (r: StudentRow) => ({
  id: r.id,
  name: r.name,
  initials: r.initials,
  totalCoins: r.total_coins,
  currentStreak: r.current_streak,
  dailyGoal: r.daily_goal,
  joinedAt: r.joined_at,
});

export const toSessionListItem = (r: SessionRow) => ({
  id: r.id,
  studentId: r.student_id,
  type: r.type,
  durationMs: r.duration_ms,
  coins: r.coins,
  status: r.status,
  startedAt: r.started_at,
  completedAt: r.completed_at,
});

export const toSessionDetail = (r: SessionRow, timeline: TimelineRow[]) => ({
  id: r.id,
  studentId: r.student_id,
  type: r.type,
  durationMs: r.duration_ms,
  coins: r.coins,
  status: r.status,
  startedAt: toIso(r.started_at),
  completedAt: toIso(r.completed_at),
  timeline: timeline.map((t) => ({
    type: t.type,
    durationMs: t.duration_ms,
    startedAt: t.started_at,
  })),
});

export const toAchievement = (r: AchievementRow) => ({
  id: r.id,
  name: r.name,
  description: r.description,
  icon: r.icon,
  unlockedAt: r.unlocked_at,
  progress: r.progress,
  target: r.target,
  current: r.current,
});
