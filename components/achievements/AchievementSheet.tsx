import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Colors, Radii, Spacing } from '@/constants/Colors';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Text } from '@/components/ui/Text';
import { formatFullDate } from '@/lib/format';
import type { Achievement } from '@/types/api';

export function AchievementSheet({ achievement, onClose }: { achievement: Achievement | null; onClose: () => void }) {
  const unlocked = achievement?.unlockedAt != null;
  return (
    <Modal visible={!!achievement} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
        <Pressable style={styles.fill} onPress={onClose} />
        {achievement ? (
          <Animated.View entering={FadeInUp.springify().damping(18)} style={styles.sheet}>
            <View style={[styles.badge, { backgroundColor: unlocked ? Colors.amberLight : Colors.background }]}>
              <ProgressRing
                size={96}
                strokeWidth={6}
                progress={achievement.progress / 100}
                color={unlocked ? Colors.amber : Colors.primary}
                trackColor={Colors.border}
              >
                <Ionicons
                  name={(achievement.icon as keyof typeof Ionicons.glyphMap) ?? 'star'}
                  size={34}
                  color={unlocked ? Colors.amber : Colors.textTertiary}
                />
              </ProgressRing>
            </View>
            <Text variant="h2" style={styles.center}>
              {achievement.name}
            </Text>
            <Text variant="meta" style={[styles.center, styles.desc]}>
              {achievement.description}
            </Text>
            <View style={styles.statusRow}>
              <Ionicons
                name={unlocked ? 'checkmark-circle' : 'time-outline'}
                size={16}
                color={unlocked ? Colors.success : Colors.textSecondary}
              />
              <Text variant="caption" color={unlocked ? Colors.success : Colors.textSecondary}>
                {unlocked
                  ? `Unlocked ${formatFullDate(achievement.unlockedAt!)}`
                  : `${achievement.current} / ${achievement.target} · ${achievement.progress}% complete`}
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(20,18,30,0.45)', justifyContent: 'flex-end' },
  fill: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xxl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  badge: { padding: Spacing.md, borderRadius: Radii.card, marginBottom: Spacing.lg },
  center: { textAlign: 'center' },
  desc: { marginTop: Spacing.sm, maxWidth: 280, lineHeight: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.lg },
});
