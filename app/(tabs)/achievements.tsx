import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/Colors';
import { Screen } from '@/components/ui/Screen';
import { StateView } from '@/components/ui/StateView';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { AchievementSheet } from '@/components/achievements/AchievementSheet';
import { AchievementsHeader } from '@/components/achievements/AchievementsHeader';
import { AchievementsSkeleton } from '@/components/achievements/AchievementsSkeleton';
import { useAchievements } from '@/lib/api/queries';
import type { Achievement } from '@/types/api';

export default function AchievementsScreen() {
  const query = useAchievements();
  const [selected, setSelected] = useState<Achievement | null>(null);
  const open = useCallback((achievement: Achievement) => setSelected(achievement), []);

  if (query.isLoading) {
    return (
      <Screen>
        <AchievementsSkeleton />
      </Screen>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Screen>
        <StateView
          icon="cloud-offline-outline"
          title="Couldn't load achievements"
          subtitle="We couldn't reach the server. Try again in a moment."
          actionLabel="Retry"
          onAction={() => query.refetch()}
        />
      </Screen>
    );
  }

  const achievements = query.data;
  const unlocked = achievements.filter((a: Achievement) => a.unlockedAt !== null).length;

  return (
    <Screen>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<AchievementsHeader unlocked={unlocked} total={achievements.length} />}
        renderItem={({ item, index }) => <AchievementCard achievement={item} index={index} onPress={open} />}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} tintColor={Colors.primary} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <AchievementSheet achievement={selected} onClose={() => setSelected(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  column: { gap: Spacing.md },
  separator: { height: Spacing.md },
});
