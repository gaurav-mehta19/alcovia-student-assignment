import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { formatDuration } from '@/lib/format';

interface Props {
  label: string;
  durationMs: number;
  coins?: number;
  pending: boolean;
  error: boolean;
  onDone: () => void;
  onRetry: () => void;
}

export function TimerComplete({ label, durationMs, coins, pending, error, onDone, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.check}>
        <Ionicons name={error ? 'alert' : 'checkmark'} size={56} color="#FFFFFF" />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(150)} style={styles.text}>
        <Text variant="h1" style={styles.center}>
          {error ? 'Almost saved' : 'Session complete!'}
        </Text>
        <Text variant="meta" style={styles.center}>
          {label} · {formatDuration(durationMs)}
        </Text>
        {pending ? (
          <ActivityIndicator color={Colors.primary} style={styles.spin} />
        ) : error ? (
          <Text variant="meta" color={Colors.error} style={[styles.center, styles.spin]}>
            Couldn&apos;t save your session to the server.
          </Text>
        ) : (
          <View style={styles.coins}>
            <Text variant="display" color={Colors.success}>+{coins ?? 0}</Text>
            <Text variant="label">coins earned</Text>
          </View>
        )}
      </Animated.View>
      <View style={styles.actions}>
        {error ? <Button label="Try again" onPress={onRetry} /> : null}
        <Button label="Done" variant={error ? 'ghost' : 'primary'} onPress={onDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, gap: Spacing.xl },
  check: { width: 108, height: 108, borderRadius: 54, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  text: { alignItems: 'center', gap: Spacing.sm },
  center: { textAlign: 'center' },
  coins: { alignItems: 'center', marginTop: Spacing.md },
  spin: { marginTop: Spacing.lg },
  actions: { alignSelf: 'stretch', gap: Spacing.md, marginTop: Spacing.xl },
});
