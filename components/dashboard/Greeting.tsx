import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/Colors';
import { Fonts } from '@/constants/typography';
import { Text } from '@/components/ui/Text';

interface Props {
  name: string;
  initials: string;
}

export function Greeting({ name, initials }: Props) {
  const firstName = name.split(' ')[0];
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text color={Colors.primary} style={styles.initials}>
          {initials}
        </Text>
      </View>
      <View>
        <Text variant="h2">Hey, {firstName}</Text>
        <Text variant="meta">Let&apos;s crush this week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxl, paddingTop: Spacing.xs },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: Fonts.bold, fontSize: 15 },
});
