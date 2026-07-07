import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/typography';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'bodyStrong' | 'body' | 'meta' | 'caption' | 'label';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
}

export function Text({ variant = 'body', color, style, ...rest }: Props) {
  return <RNText {...rest} style={[styles[variant], color ? { color } : null, style]} />;
}

const styles = StyleSheet.create({
  display: { fontFamily: Fonts.extrabold, fontSize: 26, color: Colors.text, fontVariant: ['tabular-nums'] },
  h1: { fontFamily: Fonts.bold, fontSize: 24, color: Colors.text },
  h2: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.text },
  h3: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.text },
  bodyStrong: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text },
  body: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.text },
  meta: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary },
  caption: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textTertiary },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
