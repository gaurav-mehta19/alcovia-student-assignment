import { Request, Router } from 'express';
import { getAchievements, getStudent } from '../lib/data';
import { asyncHandler, notFound } from '../lib/errors';
import { toAchievement, toStudent } from '../lib/serialize';
import { buildWeeklyStats } from '../lib/stats';
import sessionRoutes from './sessions';

const router = Router();

const params = (req: Request) => req.params as Record<string, string>;

function requireStudent(id: string) {
  const student = getStudent(id);
  if (!student) throw notFound('Student not found');
  return student;
}

router.get(
  '/:id',
  asyncHandler((req, res) => {
    res.json(toStudent(requireStudent(params(req).id)));
  })
);

router.get(
  '/:id/stats',
  asyncHandler((req, res) => {
    const student = requireStudent(params(req).id);
    res.json(buildWeeklyStats(student));
  })
);

router.get(
  '/:id/achievements',
  asyncHandler((req, res) => {
    const { id } = params(req);
    requireStudent(id);
    res.json(getAchievements(id).map(toAchievement));
  })
);

router.use('/:id/sessions', sessionRoutes);

export default router;
