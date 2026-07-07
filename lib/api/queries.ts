import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Achievement,
  PaginatedResponse,
  Session,
  SessionDetail,
  SessionType,
  Student,
  WeeklyStats,
} from '@/types/api';
import { apiFetch } from './client';

export const STUDENT_ID = 'stu_01';
export type HistoryFilter = 'today' | 'week' | 'month' | 'all';

export const keys = {
  student: ['student', STUDENT_ID] as const,
  stats: ['stats', STUDENT_ID] as const,
  achievements: ['achievements', STUDENT_ID] as const,
  sessions: (filter: HistoryFilter) => ['sessions', STUDENT_ID, filter] as const,
  session: (id: string) => ['session', STUDENT_ID, id] as const,
};

const base = `/students/${STUDENT_ID}`;

export const useStudent = () =>
  useQuery({ queryKey: keys.student, queryFn: () => apiFetch<Student>(base) });

export const useStats = () =>
  useQuery({ queryKey: keys.stats, queryFn: () => apiFetch<WeeklyStats>(`${base}/stats?period=week`) });

export const useAchievements = () =>
  useQuery({ queryKey: keys.achievements, queryFn: () => apiFetch<Achievement[]>(`${base}/achievements`) });

export function useSessionsInfinite(filter: HistoryFilter) {
  const query = filter === 'all' ? '' : `&filter=${filter}`;
  return useInfiniteQuery({
    queryKey: keys.sessions(filter),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => {
      const cursor = pageParam ? `&cursor=${pageParam}` : '';
      return apiFetch<PaginatedResponse<Session>>(`${base}/sessions?limit=10${query}${cursor}`);
    },
    getNextPageParam: (last) => last.cursor,
  });
}

export const useSession = (id: string) =>
  useQuery({ queryKey: keys.session(id), queryFn: () => apiFetch<SessionDetail>(`${base}/sessions/${id}`) });

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { type: SessionType; durationMs: number; timeline: SessionDetail['timeline'] }) =>
      apiFetch<SessionDetail>(`${base}/sessions`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions', STUDENT_ID] });
      qc.invalidateQueries({ queryKey: keys.stats });
      qc.invalidateQueries({ queryKey: keys.student });
    },
  });
}
