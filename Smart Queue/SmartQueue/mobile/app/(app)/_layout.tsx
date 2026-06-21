import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/components/ui/Colors';

export default function AppLayout() {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.status === 'signed_out') {
      // Small delay ensures the navigator tree is mounted before replacing
      const t = setTimeout(() => router.replace('/(auth)/login'), 50);
      return () => clearTimeout(t);
    }
  }, [state.status]);

  if (state.status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (state.status === 'signed_out') return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
      }}
    />
  );
}
