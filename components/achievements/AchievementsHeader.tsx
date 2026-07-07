import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Text } from '@/components/ui/Text';

interface Props {
  unlocked: number;
  total: number;
}

export function AchievementsHeader({ unlocked, total }: Props) {
  const pct = total ? Math.round((unlocked / total) * 100) : 0;
  return (
    <View style={styles.wrap}>
      <Text variant="h2">Achievements</Text>
      <Text variant="meta" style={styles.sub}>
        {unlocked} of {total} unlocked
      </Text>
      <Card style={styles.card}>
        <ProgressRing size={72} strokeWidth={7} progress={total ? unlocked / total : 0} color={Colors.amber}>
          <Text style={styles.pct}>{pct}%</Text>
        </ProgressRing>
        <View style={styles.text}>
          <Text variant="bodyStrong">Keep collecting</Text>
          <Text variant="meta" style={styles.hint}>
            {total - unlocked} more to complete your set. Every session gets you closer.
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: Spacing.xs },
  sub: { marginTop: Spacing.xs, marginBottom: Spacing.lg },
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl, marginBottom: Spacing.xl },
  pct: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: Colors.text },
  text: { flex: 1 },
  hint: { marginTop: Spacing.xs, lineHeight: 18 },
});
