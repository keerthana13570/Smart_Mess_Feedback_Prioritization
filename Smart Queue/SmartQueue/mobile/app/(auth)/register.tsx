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

type Role = 'student' | 'admin';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, state } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.status === 'signed_in') {
      router.replace('/(app)');
    }
  }, [state.status]);

  if (state.status === 'loading') return null;

  async function handleRegister() {
    const trimName = name.trim();
    const trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();
    if (!trimName || !trimEmail || !trimPass) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (trimPass.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      await signUp({ name: trimName, email: trimEmail, password: trimPass, role });
    } catch (e: any) {
      Alert.alert('Registration failed', e?.response?.data?.message ?? e?.message ?? 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SmartQueue to submit mess feedback</Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Your Details</Text>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholder="John Doe"
            />
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
              label="Password (min 6 chars)"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              showToggle
            />

            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>I am a...</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleCard, role === 'student' && styles.roleCardActive]}
                  onPress={() => setRole('student')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>🎓</Text>
                  <Text style={[styles.roleTitle, role === 'student' && styles.roleTitleActive]}>Student</Text>
                  <Text style={styles.roleDesc}>Submit & track feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleCard, role === 'admin' && styles.roleCardActive]}
                  onPress={() => setRole('admin')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>🛠️</Text>
                  <Text style={[styles.roleTitle, role === 'admin' && styles.roleTitleActive]}>Admin</Text>
                  <Text style={styles.roleDesc}>View SmartQueue dashboard</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button title="Create Account" loading={loading} onPress={handleRegister} style={styles.btn} />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, padding: 24, gap: 20 },
  backBtn: { paddingVertical: 4 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  header: { gap: 6 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: Colors.muted },
  card: { gap: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  roleSection: { gap: 10 },
  roleLabel: { color: Colors.muted, fontSize: 13, fontWeight: '700' },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleCard: {
    flex: 1, borderWidth: 2, borderColor: Colors.border,
    borderRadius: 14, padding: 14, alignItems: 'center', gap: 4,
    backgroundColor: Colors.card,
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: '#EFF6FF' },
  roleEmoji: { fontSize: 28 },
  roleTitle: { fontSize: 15, fontWeight: '800', color: Colors.muted },
  roleTitleActive: { color: Colors.primary },
  roleDesc: { fontSize: 11, color: Colors.muted, textAlign: 'center' },
  btn: { marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerText: { color: Colors.muted, fontSize: 14 },
  footerLink: { color: Colors.primary, fontSize: 14, fontWeight: '800' },
});
