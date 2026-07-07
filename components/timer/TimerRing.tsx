import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { Text } from '@/components/ui/Text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 260;
const STROKE = 14;

interface Props {
  progress: number;
  time: string;
  caption: string;
  color: string;
  smooth: boolean;
}

export function TimerRing({ progress, time, caption, color, smooth }: Props) {
  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = useSharedValue(progress);

  useEffect(() => {
    value.value = withTiming(progress, { duration: smooth ? 1000 : 300, easing: Easing.linear });
  }, [progress, smooth, value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - value.value),
  }));

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={radius} stroke={Colors.border} strokeWidth={STROKE} fill="none" />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={radius}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.time}>{time}</Text>
        <Text variant="label">{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 4 },
  time: { fontSize: 56, fontFamily: 'Inter_800ExtraBold', color: Colors.text, fontVariant: ['tabular-nums'] },
});
