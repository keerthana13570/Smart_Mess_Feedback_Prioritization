import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { Colors } from '@/components/ui/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg },
        // slide_from_right is not supported on web
        animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
      }}
    />
  );
}
