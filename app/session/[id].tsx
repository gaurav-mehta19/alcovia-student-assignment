import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/Colors';
import { sessionMeta } from '@/constants/sessionMeta';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateView } from '@/components/ui/StateView';
import { Text } from '@/components/ui/Text';
import { SessionTimeline } from '@/components/session/SessionTimeline';
import { useSession } from '@/lib/api/queries';
import { formatDuration, formatFullDate } from '@/lib/format';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text variant="meta">{label}</Text>
      <Text variant="bodyStrong">{value}</Text>
    </View>
  );
}

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useSession(id);

  return (
    <Screen>
      <View style={styles.header}>
        <AnimatedPressable haptic="tap" scaleTo={0.9} onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </AnimatedPressable>
        <Text variant="h3">Session</Text>
        <View style={styles.back} />
      </View>

      {query.isLoading ? (
        <View style={styles.body}>
          <Skeleton height={132} radius={16} style={styles.gap} />
          <Skeleton height={120} radius={16} />
        </View>
      ) : query.isError || !query.data ? (
        <StateView
          icon="alert-circle-outline"
          title="Session not found"
          subtitle="We couldn't load this session. It may have been removed."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(350)}>
            <Card style={styles.hero}>
              <View style={styles.heroTop}>
                <View style={[styles.badge, { backgroundColor: sessionMeta(query.data.type).tint }]}>
                  <Ionicons name={sessionMeta(query.data.type).icon} size={26} color={sessionMeta(query.data.type).accent} />
                </View>
                <View style={styles.coins}>
                  <Text variant="display" color={Colors.success}>+{query.data.coins}</Text>
                  <Text variant="label">coins earned</Text>
                </View>
              </View>
              <Text variant="h2" style={styles.title}>{sessionMeta(query.data.type).label}</Text>
              <Row label="Duration" value={formatDuration(query.data.durationMs)} />
              <Row label="Started" value={formatFullDate(query.data.startedAt)} />
              {query.data.completedAt ? <Row label="Completed" value={formatFullDate(query.data.completedAt)} /> : null}
              <Row label="Status" value={query.data.status === 'completed' ? 'Completed' : 'Abandoned'} />
            </Card>
          </Animated.View>

          {query.data.timeline.length ? (
            <Animated.View entering={FadeInDown.delay(120).duration(350)}>
              <Text variant="h3" style={styles.section}>Timeline</Text>
              <Card>
                <SessionTimeline entries={query.data.timeline} />
              </Card>
            </Animated.View>
          ) : null}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  body: { padding: Spacing.xl, gap: Spacing.xl },
  gap: { marginBottom: Spacing.xl },
  hero: { gap: Spacing.md },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  coins: { alignItems: 'flex-end' },
  title: { marginTop: Spacing.xs },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2 },
  section: { marginBottom: Spacing.md },
});
