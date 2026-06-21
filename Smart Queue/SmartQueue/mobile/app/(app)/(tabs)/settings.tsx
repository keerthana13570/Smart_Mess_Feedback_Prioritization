import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/components/ui/Colors';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth';

export default function SettingsScreen() {
  const { state, signOut } = useAuth();

  const user = state.status === 'signed_in' ? state.user : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Unknown'}</Text>
          <View style={[styles.roleBadge, user?.role === 'admin' ? styles.adminBadge : styles.studentBadge]}>
            <Text style={styles.roleText}>
              {user?.role === 'admin' ? '🛠️ Admin' : '🎓 Student'}
            </Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{user?.name ?? '—'}</Text>
          <View style={styles.divider} />
          <Text style={styles.infoLabel}>Email Address</Text>
          <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
          <View style={styles.divider} />
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{user?.role === 'admin' ? 'Administrator' : 'Student'}</Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>SmartQueue v1.0.0</Text>
          <View style={styles.divider} />
          <Text style={styles.infoLabel}>Backend</Text>
          <Text style={styles.infoValue}>Node.js + Express + MongoDB</Text>
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()} activeOpacity={0.8}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 16, gap: 16 },
  header: { paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '900', color: Colors.text },
  avatarSection: { alignItems: 'center', gap: 10, paddingVertical: 16 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
  userName: { fontSize: 20, fontWeight: '800', color: Colors.text },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 },
  adminBadge: { backgroundColor: '#FEF3C7' },
  studentBadge: { backgroundColor: '#EFF6FF' },
  roleText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  infoCard: { gap: 12 },
  infoLabel: { fontSize: 12, color: Colors.muted, fontWeight: '700', textTransform: 'uppercase' },
  infoValue: { fontSize: 15, color: Colors.text, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border },
  logoutBtn: {
    backgroundColor: Colors.danger,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
