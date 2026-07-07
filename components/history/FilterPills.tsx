import { ScrollView, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '@/constants/Colors';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Text } from '@/components/ui/Text';
import type { HistoryFilter } from '@/lib/api/queries';

const OPTIONS: { value: HistoryFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All' },
];

interface Props {
  value: HistoryFilter;
  onChange: (value: HistoryFilter) => void;
}

export function FilterPills({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <AnimatedPressable
            key={option.value}
            haptic="select"
            scaleTo={0.94}
            onPress={() => onChange(option.value)}
            style={{ ...styles.pill, ...(active ? styles.pillActive : styles.pillIdle) }}
          >
            <Text variant="bodyStrong" color={active ? '#FFFFFF' : Colors.textSecondary} style={styles.label}>
              {option.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row: { gap: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm },
  pill: {
    minHeight: 38,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: Colors.primary },
  pillIdle: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 13, lineHeight: 20, textAlignVertical: 'center', includeFontPadding: false },
});
