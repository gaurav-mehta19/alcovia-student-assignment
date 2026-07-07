import { StyleSheet, View } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/Colors';
import { Skeleton } from '@/components/ui/Skeleton';

export function AchievementsSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={180} height={22} style={styles.line} />
      <Skeleton height={112} radius={16} style={styles.header} />
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.card}>
            <Skeleton width={48} height={48} radius={24} />
            <Skeleton width={90} height={14} style={styles.line} />
            <Skeleton width={60} height={10} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xs },
  line: { marginBottom: Spacing.sm },
  header: { marginTop: Spacing.md, marginBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
});
