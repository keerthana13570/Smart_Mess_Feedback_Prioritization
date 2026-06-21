import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/components/ui/Colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, state } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.status === 'signed_in') {
      router.replace('/(app)');
    }
  }, [state.status]);

  if (state.status === 'loading') {
    return null;
  }

  async function handleLogin() {
    const trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();
    if (!trimEmail || !trimPass) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      await signIn({ email: trimEmail, password: trimPass });
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message ?? e?.message ?? 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>SQ</Text>
            </View>
            <Text style={styles.title}>SmartQueue</Text>
            <Text style={styles.subtitle}>Mess Feedback Prioritization System</Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              showToggle
            />
            <Button title="Sign In" loading={loading} onPress={handleLogin} style={styles.btn} />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 24 },
  header: { alignItems: 'center', gap: 8 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  logoText: { color: '#fff', fontSize: 28, fontWeight: '900' },
  title: { fontSize: 28, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: Colors.muted, textAlign: 'center' },
  card: { gap: 16 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  btn: { marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerText: { color: Colors.muted, fontSize: 14 },
  footerLink: { color: Colors.primary, fontSize: 14, fontWeight: '800' },
});
