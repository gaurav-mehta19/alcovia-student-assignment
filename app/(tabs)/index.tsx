import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Spacing } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { StateView } from '@/components/ui/StateView';
import { Text } from '@/components/ui/Text';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Greeting } from '@/components/dashboard/Greeting';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { WeekChart } from '@/components/dashboard/WeekChart';
import { useStats, useStudent } from '@/lib/api/queries';

export default function DashboardScreen() {
  const student = useStudent();
  const stats = useStats();

  const refetch = () => {
    student.refetch();
    stats.refetch();
  };

  if ((student.isLoading || stats.isLoading) && (!student.data || !stats.data)) {
    return (
      <Screen>
        <DashboardSkeleton />
      </Screen>
    );
  }

  if ((student.isError || stats.isError) && (!student.data || !stats.data)) {
    return (
      <Screen>
        <StateView
          icon="cloud-offline-outline"
          title="Can't load your dashboard"
          subtitle="We couldn't reach the server. Check that the API is running and try again."
          actionLabel="Retry"
          onAction={refetch}
        />
      </Screen>
    );
  }

  const s = student.data!;
  const w = stats.data!;
  const refreshing = student.isFetching || stats.isFetching;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Greeting name={s.name} initials={s.initials} />
        </Animated.View>

        <StatsRow sessions={w.totalSessions} coins={s.totalCoins} streak={s.currentStreak} />

        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Text variant="h3" style={styles.heading}>
            This Week
          </Text>
          <WeekChart data={w.sessionsPerDay} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <Text variant="h3" style={styles.heading}>
            Today&apos;s Progress
          </Text>
          <ProgressCard completed={w.todayCompleted} goal={w.dailyGoal} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(400)} style={styles.cta}>
          <Button label="Start Session" onPress={() => router.push('/timer')} />
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  heading: { marginBottom: Spacing.lg },
  cta: { marginTop: Spacing.lg },
});
