import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/Colors';
import { sessionMeta } from '@/constants/sessionMeta';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Text } from '@/components/ui/Text';
import { formatDuration, formatRelative } from '@/lib/format';
import type { Session } from '@/types/api';

export const SESSION_CARD_HEIGHT = 78;

function SessionCardBase({ session, onPress }: { session: Session; onPress: (id: string) => void }) {
  const meta = sessionMeta(session.type);
  return (
    <AnimatedPressable haptic="tap" scaleTo={0.98} onPress={() => onPress(session.id)} style={styles.card}>
      <View style={[styles.icon, { backgroundColor: meta.tint }]}>
        <Ionicons name={meta.icon} size={18} color={meta.accent} />
      </View>
      <View style={styles.info}>
        <Text variant="bodyStrong">{meta.label}</Text>
        <Text variant="caption" style={styles.meta}>
          {formatDuration(session.durationMs)} · {formatRelative(session.startedAt)}
        </Text>
      </View>
      <Text variant="bodyStrong" color={session.status === 'completed' ? Colors.success : Colors.textTertiary}>
        {session.status === 'completed' ? `+${session.coins}` : 'Abandoned'}
      </Text>
    </AnimatedPressable>
  );
}

export const SessionCard = memo(SessionCardBase);

const styles = StyleSheet.create({
  card: {
    height: SESSION_CARD_HEIGHT - 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.statCard,
    paddingHorizontal: Spacing.lg,
    marginBottom: 10,
    ...Shadows.card,
  },
  icon: { width: 40, height: 40, borderRadius: Radii.button, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, minWidth: 0 },
  meta: { marginTop: 2 },
});
