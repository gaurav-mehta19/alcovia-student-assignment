import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radii, Shadows, Spacing } from '@/constants/Colors';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Text } from '@/components/ui/Text';
import type { Achievement } from '@/types/api';

interface Props {
  achievement: Achievement;
  index: number;
  onPress: (achievement: Achievement) => void;
}

function AchievementCardBase({ achievement, index, onPress }: Props) {
  const unlocked = achievement.unlockedAt !== null;
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()} style={styles.col}>
      <AnimatedPressable
        haptic="tap"
        scaleTo={0.96}
        accessibilityRole="button"
        accessibilityLabel={`${achievement.name}, ${unlocked ? 'unlocked' : `${achievement.current} of ${achievement.target}`}`}
        onPress={() => onPress(achievement)}
        style={styles.card}
      >
        <View style={[styles.badge, { backgroundColor: unlocked ? Colors.amberLight : Colors.background }]}>
          <Ionicons
            name={(achievement.icon as keyof typeof Ionicons.glyphMap) ?? 'star'}
            size={24}
            color={unlocked ? Colors.amber : Colors.textTertiary}
          />
          {!unlocked ? (
            <View style={styles.lock}>
              <Ionicons name="lock-closed" size={10} color={Colors.surface} />
            </View>
          ) : null}
        </View>
        <Text variant="bodyStrong" numberOfLines={1} color={unlocked ? Colors.text : Colors.textSecondary} style={styles.name}>
          {achievement.name}
        </Text>
        {unlocked ? (
          <Text variant="caption" color={Colors.success}>
            Unlocked
          </Text>
        ) : (
          <View style={styles.progressWrap}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${achievement.progress}%` }]} />
            </View>
            <Text variant="caption" style={styles.count}>
              {achievement.current}/{achievement.target}
            </Text>
          </View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

export const AchievementCard = memo(AchievementCardBase);

const styles = StyleSheet.create({
  col: { flex: 1 },
  card: { backgroundColor: Colors.surface, borderRadius: Radii.card, padding: Spacing.lg, ...Shadows.card },
  badge: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  lock: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  name: { marginBottom: Spacing.xs },
  progressWrap: { gap: Spacing.xs },
  track: { height: 5, borderRadius: 3, backgroundColor: Colors.border, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3, backgroundColor: Colors.primary },
  count: {},
});
