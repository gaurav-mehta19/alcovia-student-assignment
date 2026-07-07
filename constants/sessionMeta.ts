import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Colors';
import type { SessionType } from '@/types/api';

type Meta = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  accent: string;
};

export const SESSION_META: Record<SessionType, Meta> = {
  deep_focus: { label: 'Deep Focus', icon: 'flame', tint: Colors.primaryLight, accent: Colors.primary },
  quick_sprint: { label: 'Quick Sprint', icon: 'flash', tint: Colors.successLight, accent: Colors.success },
  pomodoro: { label: 'Pomodoro', icon: 'nutrition', tint: Colors.amberLight, accent: Colors.amber },
};

export const SESSION_ORDER: SessionType[] = ['deep_focus', 'quick_sprint', 'pomodoro'];

export function sessionMeta(type: string): Meta {
  return SESSION_META[type as SessionType] ?? SESSION_META.deep_focus;
}

export const SESSION_MINUTES: Record<SessionType, number> = {
  deep_focus: 25,
  quick_sprint: 15,
  pomodoro: 25,
};
