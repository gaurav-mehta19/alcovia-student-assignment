import { randomUUID } from 'crypto';
import { Request, Router } from 'express';
import { decodeCursor, encodeCursor } from '../lib/cursor';
import { getSession, getSessionsPage, getStudent, getTimeline, insertSession } from '../lib/data';
import { asyncHandler, notFound } from '../lib/errors';
import { toSessionDetail, toSessionListItem } from '../lib/serialize';
import { windowStart } from '../lib/time';
import { parseFilter, parseLimit, parseSessionBody } from '../lib/validate';

const COINS: Record<string, number> = { deep_focus: 50, quick_sprint: 30, pomodoro: 50 };

const router = Router({ mergeParams: true });

const params = (req: Request) => req.params as Record<string, string>;

function requireStudent(id: string) {
  const student = getStudent(id);
  if (!student) throw notFound('Student not found');
  return student;
}

router.get(
  '/',
  asyncHandler((req, res) => {
    const { id } = params(req);
    requireStudent(id);
    const limit = parseLimit(req.query.limit);
    const filter = parseFilter(req.query.filter);
    const cursor = req.query.cursor ? decodeCursor(String(req.query.cursor)) : undefined;
    const since = filter ? windowStart(filter) : undefined;

    const rows = getSessionsPage({ studentId: id, limit, cursor, since });
    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit);
    const last = page[page.length - 1];
    res.json({
      data: page.map(toSessionListItem),
      cursor: hasMore && last ? encodeCursor({ startedAt: last.started_at, id: last.id }) : null,
      hasMore,
    });
  })
);

router.get(
  '/:sessionId',
  asyncHandler((req, res) => {
    const { id, sessionId } = params(req);
    requireStudent(id);
    const session = getSession(id, sessionId);
    if (!session) throw notFound('Session not found');
    res.json(toSessionDetail(session, getTimeline(session.id)));
  })
);

router.post(
  '/',
  asyncHandler((req, res) => {
    const { id } = params(req);
    requireStudent(id);
    const body = parseSessionBody(req.body);
    const completedAt = Date.now();
    const startedAt = completedAt - body.durationMs;
    const sessionId = `ses_${randomUUID().slice(0, 8)}`;
    const coins = COINS[body.type];
    const timeline = body.timeline.length
      ? body.timeline
      : [{ type: 'focus', durationMs: body.durationMs, startedAt: new Date(startedAt).toISOString() }];

    insertSession({ id: sessionId, studentId: id, type: body.type, durationMs: body.durationMs, coins, startedAt, completedAt, timeline });

    const session = getSession(id, sessionId)!;
    res.status(201).json(toSessionDetail(session, getTimeline(sessionId)));
  })
);

export default router;
