import { StyleSheet, View } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/Colors';
import { Skeleton } from '@/components/ui/Skeleton';

export function HistorySkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.card}>
          <Skeleton width={40} height={40} radius={Radii.button} />
          <View style={styles.info}>
            <Skeleton width={120} height={15} />
            <Skeleton width={160} height={12} />
          </View>
          <Skeleton width={36} height={15} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.statCard,
    padding: Spacing.lg,
    marginBottom: 10,
    ...Shadows.card,
  },
  info: { flex: 1, gap: Spacing.sm },
});
