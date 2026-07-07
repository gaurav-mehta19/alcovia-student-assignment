import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Text } from '@/components/ui/Text';

interface Props {
  completed: number;
  goal: number;
}

export function ProgressCard({ completed, goal }: Props) {
  const remaining = Math.max(0, goal - completed);
  const done = remaining === 0;
  const title = done ? 'Goal complete!' : remaining === 1 ? 'Almost there!' : 'Keep going';
  const subtitle = done
    ? "You've hit your daily goal — streak secured."
    : `${remaining} more session${remaining === 1 ? '' : 's'} to keep your streak alive`;

  return (
    <Card style={styles.card}>
      <ProgressRing size={72} strokeWidth={7} progress={goal ? completed / goal : 0} color={done ? Colors.success : Colors.primary}>
        <Text style={styles.count}>{completed}/{goal}</Text>
        <Text variant="caption">sessions</Text>
      </ProgressRing>
      <View style={styles.text}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="meta" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl },
  count: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: Colors.text },
  text: { flex: 1 },
  subtitle: { marginTop: Spacing.xs, lineHeight: 18 },
});
