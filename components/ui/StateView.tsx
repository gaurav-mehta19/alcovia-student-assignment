import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/Colors';
import { Button } from './Button';
import { Text } from './Text';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  tint?: string;
}

export function StateView({ icon, title, subtitle, actionLabel, onAction, tint = Colors.primary }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: Colors.primaryLight }]}>
        <Ionicons name={icon} size={32} color={tint} />
      </View>
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="meta" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  title: { textAlign: 'center', marginBottom: Spacing.xs },
  subtitle: { textAlign: 'center', maxWidth: 260, lineHeight: 20 },
  action: { marginTop: Spacing.xl, paddingHorizontal: Spacing.xxl },
});
