import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/Colors';
import { Screen } from '@/components/ui/Screen';
import { StateView } from '@/components/ui/StateView';
import { Text } from '@/components/ui/Text';
import { FilterPills } from '@/components/history/FilterPills';
import { HistorySkeleton } from '@/components/history/HistorySkeleton';
import { SESSION_CARD_HEIGHT, SessionCard } from '@/components/history/SessionCard';
import { HistoryFilter, useSessionsInfinite } from '@/lib/api/queries';
import type { Session } from '@/types/api';

export default function HistoryScreen() {
  const [filter, setFilter] = useState<HistoryFilter>('week');
  const query = useSessionsInfinite(filter);
  const sessions = query.data?.pages.flatMap((page) => page.data) ?? [];

  const openSession = useCallback((id: string) => router.push(`/session/${id}`), []);
  const renderItem = useCallback(
    ({ item }: { item: Session }) => <SessionCard session={item} onPress={openSession} />,
    [openSession]
  );

  const footer = query.isFetchingNextPage ? (
    <ActivityIndicator color={Colors.primary} style={styles.footer} />
  ) : sessions.length && !query.hasNextPage ? (
    <Text variant="caption" style={styles.end}>
      You&apos;ve reached the end
    </Text>
  ) : null;

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          History
        </Text>
      </View>
      <FilterPills value={filter} onChange={setFilter} />

      {query.isLoading ? (
        <HistorySkeleton />
      ) : query.isError ? (
        <StateView
          icon="cloud-offline-outline"
          title="Couldn't load sessions"
          subtitle="Something went wrong reaching the server. Pull to retry."
          actionLabel="Retry"
          onAction={() => query.refetch()}
        />
      ) : sessions.length === 0 ? (
        <StateView
          icon="moon-outline"
          title="No sessions here yet"
          subtitle="Start a focus session and it'll show up in your history."
        />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: SESSION_CARD_HEIGHT, offset: SESSION_CARD_HEIGHT * index, index })}
          onEndReachedThreshold={0.4}
          onEndReached={() => query.hasNextPage && !query.isFetchingNextPage && query.fetchNextPage()}
          ListFooterComponent={footer}
          refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} />}
          removeClippedSubviews
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.xl },
  title: { marginTop: Spacing.xs, marginBottom: Spacing.sm },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.xxl },
  footer: { marginVertical: Spacing.lg },
  end: { textAlign: 'center', marginVertical: Spacing.lg },
});
