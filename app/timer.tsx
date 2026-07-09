import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/Colors';
import { SESSION_META, SESSION_MINUTES } from '@/constants/sessionMeta';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { SessionTypePicker } from '@/components/timer/SessionTypePicker';
import { TimerComplete } from '@/components/timer/TimerComplete';
import { TimerRing } from '@/components/timer/TimerRing';
import { useCreateSession } from '@/lib/api/queries';
import { formatClock } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import type { SessionType } from '@/types/api';

export default function TimerScreen() {
  const create = useCreateSession();
  const [phase, setPhase] = useState<'setup' | 'active' | 'done'>('setup');
  const [type, setType] = useState<SessionType>('deep_focus');
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_MINUTES.deep_focus * 60);
  const total = SESSION_MINUTES[type] * 60;
  const meta = SESSION_META[type];
  const finished = useRef(false);
  const payload = useRef<{
    type: SessionType;
    durationMs: number;
    timeline: { type: 'focus' | 'break'; durationMs: number; startedAt: string }[];
  } | null>(null);

  useEffect(() => {
    if (phase !== 'active' || !running) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, running]);

  const finish = useCallback(
    (elapsedSeconds: number) => {
      if (finished.current) return;
      finished.current = true;
      setRunning(false);
      setPhase('done');
      haptics.success();
      const durationMs = Math.max(1, Math.round(elapsedSeconds)) * 1000;
      payload.current = {
        type,
        durationMs,
        timeline: [{ type: 'focus', durationMs, startedAt: new Date(Date.now() - durationMs).toISOString() }],
      };
      create.mutate(payload.current);
    },
    [create, type]
  );

  useEffect(() => {
    if (phase === 'active' && secondsLeft <= 0) finish(total);
  }, [secondsLeft, phase, finish, total]);

  const start = () => {
    finished.current = false;
    setSecondsLeft(total);
    setRunning(true);
    setPhase('active');
    haptics.press();
  };

  const giveUp = () => {
    haptics.warn();
    router.back();
  };

  if (phase === 'done') {
    return (
      <Screen edges={['top', 'bottom']}>
        <TimerComplete
          label={meta.label}
          durationMs={payload.current?.durationMs ?? total * 1000}
          coins={create.data?.coins}
          pending={create.isPending}
          error={create.isError}
          onDone={() => router.back()}
          onRetry={() => payload.current && create.mutate(payload.current)}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <AnimatedPressable
          haptic="tap"
          scaleTo={0.9}
          accessibilityRole="button"
          accessibilityLabel="Close timer"
          onPress={() => router.back()}
          style={styles.close}
        >
          <Ionicons name="close" size={24} color={Colors.text} />
        </AnimatedPressable>
        <Text variant="h3">Focus Timer</Text>
        <View style={styles.close} />
      </View>

      {phase === 'setup' ? (
        <Animated.View entering={FadeIn} style={styles.setup}>
          <Text variant="meta" style={styles.lead}>
            Pick a session type and lock in.
          </Text>
          <SessionTypePicker value={type} onChange={setType} />
          <Button label="Start Session" onPress={start} style={styles.start} />
        </Animated.View>
      ) : (
        <View style={styles.active}>
          <TimerRing
            progress={total ? secondsLeft / total : 0}
            time={formatClock(Math.max(0, secondsLeft))}
            caption={running ? 'focus' : 'paused'}
            color={meta.accent}
            smooth={running}
          />
          <View style={styles.controls}>
            <Button label={running ? 'Pause' : 'Resume'} onPress={() => setRunning((r) => !r)} />
            <View style={styles.secondary}>
              <Button label="Give up" variant="ghost" onPress={giveUp} style={styles.flex} />
              <Button label="Finish" variant="ghost" onPress={() => finish(total - Math.max(0, secondsLeft))} style={styles.flex} />
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  close: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  setup: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  lead: { marginBottom: Spacing.xl },
  start: { marginTop: Spacing.xxl },
  active: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl },
  controls: { alignSelf: 'stretch', gap: Spacing.md },
  secondary: { flexDirection: 'row', gap: Spacing.md },
  flex: { flex: 1 },
});
