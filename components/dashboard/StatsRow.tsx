import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radii, Spacing } from '@/constants/Colors';
import { Text } from '@/components/ui/Text';

interface Stat {
  icon: string;
  value: number;
  label: string;
  tint: string;
}

interface Props {
  sessions: number;
  coins: number;
  streak: number;
}

export function StatsRow({ sessions, coins, streak }: Props) {
  const stats: Stat[] = [
    { icon: '🎯', value: sessions, label: 'Sessions', tint: Colors.primaryLight },
    { icon: '🪙', value: coins, label: 'Coins', tint: Colors.successLight },
    { icon: '🔥', value: streak, label: 'Day Streak', tint: Colors.amberLight },
  ];
  return (
    <View style={styles.row}>
      {stats.map((stat, i) => (
        <Animated.View key={stat.label} entering={FadeInDown.delay(80 * i).springify()} style={[styles.card, { backgroundColor: stat.tint }]}>
          <Text style={styles.icon}>{stat.icon}</Text>
          <Text variant="display">{stat.value}</Text>
          <Text variant="label" style={styles.label}>
            {stat.label}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xxl },
  card: { flex: 1, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md, borderRadius: Radii.statCard },
  icon: { fontSize: 18, marginBottom: Spacing.sm },
  label: { marginTop: Spacing.xs },
});
