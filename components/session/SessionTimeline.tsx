import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/Colors';
import { Text } from '@/components/ui/Text';
import { formatDuration } from '@/lib/format';
import type { TimelineEntry } from '@/types/api';

const COLOR = { focus: Colors.primary, break: Colors.amber };

export function SessionTimeline({ entries }: { entries: TimelineEntry[] }) {
  const total = entries.reduce((sum, e) => sum + e.durationMs, 0) || 1;
  return (
    <View>
      <View style={styles.bar}>
        {entries.map((entry, i) => (
          <View
            key={i}
            style={{ flex: entry.durationMs / total, backgroundColor: COLOR[entry.type] }}
          />
        ))}
      </View>
      <View style={styles.list}>
        {entries.map((entry, i) => (
          <View key={i} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: COLOR[entry.type] }]} />
            <Text variant="bodyStrong" style={styles.type}>
              {entry.type === 'focus' ? 'Focus' : 'Break'}
            </Text>
            <Text variant="meta">{formatDuration(entry.durationMs)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: Spacing.lg, gap: 2 },
  list: { gap: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5 },
  type: { flex: 1 },
});
