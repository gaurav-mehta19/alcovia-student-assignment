import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/constants/Colors';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Skeleton width={44} height={44} radius={22} />
        <View style={styles.gap}>
          <Skeleton width={140} height={22} />
          <Skeleton width={100} height={13} />
        </View>
      </View>
      <View style={styles.stats}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={92} radius={14} style={styles.stat} />
        ))}
      </View>
      <Skeleton width={120} height={16} style={styles.block} />
      <Skeleton height={130} radius={12} style={styles.block} />
      <Skeleton height={112} radius={16} style={styles.block} />
      <Skeleton height={56} radius={14} style={styles.block} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxl },
  gap: { gap: Spacing.sm },
  stats: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xxl },
  stat: { flex: 1 },
  block: { marginBottom: Spacing.xl },
});
