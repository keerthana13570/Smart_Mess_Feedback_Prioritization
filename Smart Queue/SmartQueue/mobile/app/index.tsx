import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/components/ui/Colors';

export default function Index() {
  const { state } = useAuth();

  if (state.status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (state.status === 'signed_in') {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
