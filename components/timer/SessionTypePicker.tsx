import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Colors, Radii, Spacing } from '@/constants/Colors';
import { SESSION_META, SESSION_MINUTES, SESSION_ORDER } from '@/constants/sessionMeta';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Text } from '@/components/ui/Text';
import type { SessionType } from '@/types/api';

interface Props {
  value: SessionType;
  onChange: (type: SessionType) => void;
}

export function SessionTypePicker({ value, onChange }: Props) {
  return (
    <View style={styles.list}>
      {SESSION_ORDER.map((type) => {
        const meta = SESSION_META[type];
        const active = type === value;
        return (
          <AnimatedPressable
            key={type}
            haptic="select"
            scaleTo={0.97}
            onPress={() => onChange(type)}
            style={{ ...styles.card, borderColor: active ? meta.accent : Colors.border }}
          >
            <View style={[styles.icon, { backgroundColor: meta.tint }]}>
              <Ionicons name={meta.icon} size={20} color={meta.accent} />
            </View>
            <View style={styles.info}>
              <Text variant="bodyStrong">{meta.label}</Text>
              <Text variant="caption">{SESSION_MINUTES[type]} minutes</Text>
            </View>
            <Ionicons
              name={active ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={active ? meta.accent : Colors.textTertiary}
            />
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1.5,
    padding: Spacing.lg,
  },
  icon: { width: 40, height: 40, borderRadius: Radii.button, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
});
