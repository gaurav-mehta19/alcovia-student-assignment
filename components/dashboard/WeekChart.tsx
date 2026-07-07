import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/Colors';
import { Text } from '@/components/ui/Text';
import type { DayStat } from '@/types/api';

const CHART_HEIGHT = 120;

function Bar({ ratio, isToday, delay }: { ratio: number; isToday: boolean; delay: number }) {
  const height = useSharedValue(0);
  useEffect(() => {
    height.value = withDelay(delay, withTiming(Math.max(ratio, 0.04) * CHART_HEIGHT, { duration: 600 }));
  }, [ratio, delay, height]);
  const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));
  return (
    <Animated.View
      style={[styles.bar, { backgroundColor: isToday ? Colors.primary : Colors.primaryLight }, animatedStyle]}
    />
  );
}

export function WeekChart({ data }: { data: DayStat[] }) {
  const todayIndex = (new Date().getDay() + 6) % 7;
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <View style={styles.chart}>
      {data.map((d, i) => (
        <View key={d.day} style={styles.col}>
          <Bar ratio={d.count / max} isToday={i === todayIndex} delay={i * 60} />
          <Text variant="caption" color={i === todayIndex ? Colors.primary : Colors.textTertiary} style={styles.day}>
            {d.day.charAt(0).toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    height: CHART_HEIGHT + 28,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: '100%', maxWidth: 36, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  day: { position: 'absolute', bottom: -22 },
});
