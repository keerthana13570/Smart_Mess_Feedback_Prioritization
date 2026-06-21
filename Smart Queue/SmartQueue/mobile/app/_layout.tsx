import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/lib/auth';

// GestureHandlerRootView is only needed on native — importing it on web
// causes Metro to fail resolving gesture-handler's native-only modules.
const GestureRoot =
  Platform.OS === 'web'
    ? ({ children, style }: { children: React.ReactNode; style?: object }) => (
        <View style={style}>{children}</View>
      )
    : require('react-native-gesture-handler').GestureHandlerRootView;

export default function RootLayout() {
  return (
    <GestureRoot style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="modal" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <StatusBar style="dark" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureRoot>
  );
}
