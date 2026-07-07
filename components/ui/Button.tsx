import { StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/Colors';
import { AnimatedPressable } from './AnimatedPressable';
import { Text } from './Text';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', style }: Props) {
  const isPrimary = variant === 'primary';
  return (
    <AnimatedPressable
      onPress={onPress}
      haptic="press"
      style={{ ...styles.base, ...styles[variant], ...(isPrimary ? Shadows.cta : {}), ...style }}
    >
      <Text variant="bodyStrong" color={variant === 'ghost' ? Colors.text : '#FFFFFF'} style={styles.label}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: Spacing.lg, borderRadius: Radii.statCard, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: Colors.primary },
  danger: { backgroundColor: Colors.error },
  ghost: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 16, letterSpacing: 0.2 },
});
