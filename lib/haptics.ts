import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS !== 'web';

export const haptics = {
  select: () => enabled && Haptics.selectionAsync(),
  tap: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  press: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warn: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};
