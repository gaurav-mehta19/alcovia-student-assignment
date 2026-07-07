import { ReactNode } from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { haptics } from '@/lib/haptics';

const AnimatedView = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
  children: ReactNode;
  style?: ViewStyle;
  scaleTo?: number;
  haptic?: keyof typeof haptics | null;
}

export function AnimatedPressable({ children, style, scaleTo = 0.96, haptic = 'tap', onPressIn, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedView
      {...rest}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        scale.value = withTiming(scaleTo, { duration: 90 });
        if (haptic) haptics[haptic]();
        onPressIn?.(e);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
    >
      {children}
    </AnimatedView>
  );
}
