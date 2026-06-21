import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Colors, severityColor } from '@/components/ui/Colors';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useAuth } from '@/lib/auth';

type QueueItem = {
  topic: string;
  number_of_reports: number;
  recurrence_last_7_days: number;
  severity_weight: number;
  severity_level: 'minor' | 'moderate' | 'serious';
  score: number;
  latest_timestamp?: string;
  sampleMessages?: string[];
};

const TOPIC_EMOJI: Record<string, string> = {
  taste: '🍽️',
  hygiene: '🧹',
  delay: '⏱️',
  spicy: '🌶️',
  others: '📝',
};

export default function AdminDashboard() {
  const router = useRouter();
  const { state, signOut } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Redirect to login once signed out — in useEffect, never during render
  useEffect(() => {
    if (state.status === 'signed_out') {
      router.replace('/(auth)/login');
    }
  }, [state.status]);

  const loadQueue = useCallback(async () => {
    const res = await api.get('/smartqueue');
    setQueue(res.data?.queue ?? []);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    loadQueue()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [loadQueue]);

  // Real-time Socket.IO updates
  useEffect(() => {
    const socket = getSocket();
    const onUpdate = (items: QueueItem[]) => {
      setQueue(items);
      setLastUpdated(new Date());
    };
    socket.on('smartqueue:update', onUpdate);
    return () => {
      socket.off('smartqueue:update', onUpdate);
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try { await loadQueue(); } catch {}
    setRefreshing(false);
  }

  function handleSignOut() {
    disconnectSocket();
    signOut();
  }


  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading SmartQueue...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              👋 Hello, {state.status === 'signed_in' ? state.user.name : 'Admin'}
            </Text>
            <Text style={styles.headerTitle}>SmartQueue Dashboard</Text>
            {lastUpdated && (
              <Text style={styles.lastUpdated}>
                Updated: {lastUpdated.toLocaleTimeString()}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Live badge */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE — Real-time updates via Socket.IO</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.statNum}>{queue.length}</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.statNum, { color: Colors.danger }]}>
              {queue.filter((q) => q.severity_level === 'serious').length}
            </Text>
            <Text style={styles.statLabel}>Serious</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.statNum, { color: Colors.warn }]}>
              {queue.reduce((s, q) => s + q.number_of_reports, 0)}
            </Text>
            <Text style={styles.statLabel}>Complaints</Text>
          </View>
        </View>

        {/* Queue list */}
        <Text style={styles.sectionTitle}>Prioritized Issues</Text>

        {queue.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyTitle}>All clear!</Text>
            <Text style={styles.emptyText}>No feedback in the last 7 days.</Text>
          </Card>
        ) : (
          queue.map((item, index) => (
            <Card key={item.topic} style={styles.queueCard}>
              {/* Rank badge */}
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>

              {/* Topic row */}
              <View style={styles.topicRow}>
                <Text style={styles.topicEmoji}>{TOPIC_EMOJI[item.topic] ?? '📌'}</Text>
                <Text style={styles.topicName}>{item.topic.toUpperCase()}</Text>
                <View style={[styles.severityBadge, { backgroundColor: severityColor(item.severity_level) }]}>
                  <Text style={styles.severityText}>{item.severity_level.toUpperCase()}</Text>
                </View>
              </View>

              {/* Score bar */}
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Priority Score</Text>
                <Text style={styles.scoreValue}>{item.score.toFixed(2)}</Text>
              </View>
              <View style={styles.scoreBarBg}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${Math.min(100, (item.score / 10) * 100)}%`,
                      backgroundColor: severityColor(item.severity_level),
                    },
                  ]}
                />
              </View>

              {/* Metrics */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricNum}>{item.number_of_reports}</Text>
                  <Text style={styles.metricLabel}>Complaints</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricNum}>{item.recurrence_last_7_days}</Text>
                  <Text style={styles.metricLabel}>Recurrence (7d)</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricNum}>{item.severity_weight}</Text>
                  <Text style={styles.metricLabel}>Severity Wt.</Text>
                </View>
              </View>

              {/* Sample messages */}
              {item.sampleMessages && item.sampleMessages.length > 0 && (
                <View style={styles.samplesBox}>
                  <Text style={styles.samplesTitle}>Sample Reports</Text>
                  {item.sampleMessages.slice(0, 2).map((msg, i) => (
                    <View key={i} style={styles.sampleRow}>
                      <Text style={styles.sampleBullet}>•</Text>
                      <Text style={styles.sampleText}>{msg}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Last reported */}
              {item.latest_timestamp && (
                <Text style={styles.lastReported}>
                  Latest report: {new Date(item.latest_timestamp).toLocaleString()}
                </Text>
              )}
            </Card>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: Colors.muted, fontSize: 15 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1, gap: 2 },
  greeting: { fontSize: 13, color: Colors.muted },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.text },
  lastUpdated: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: { color: Colors.danger, fontWeight: '700', fontSize: 13 },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  liveText: { fontSize: 11, color: Colors.success, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 24, fontWeight: '900', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.muted, fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '900', color: Colors.text, marginTop: 4 },

  emptyCard: { alignItems: 'center', gap: 8, paddingVertical: 32 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptyText: { color: Colors.muted },

  queueCard: { gap: 12, position: 'relative' },
  rankBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: { color: '#fff', fontSize: 12, fontWeight: '900' },

  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 36 },
  topicEmoji: { fontSize: 22 },
  topicName: { fontSize: 16, fontWeight: '900', color: Colors.text, flex: 1 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  severityText: { color: '#fff', fontSize: 11, fontWeight: '900' },

  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreLabel: { fontSize: 12, color: Colors.muted, fontWeight: '700' },
  scoreValue: { fontSize: 18, fontWeight: '900', color: Colors.text },
  scoreBarBg: { height: 8, backgroundColor: Colors.border, borderRadius: 999, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 999 },

  metricsGrid: { flexDirection: 'row', gap: 8 },
  metricBox: {
    flex: 1,
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  metricNum: { fontSize: 20, fontWeight: '900', color: Colors.text },
  metricLabel: { fontSize: 10, color: Colors.muted, fontWeight: '600', textAlign: 'center' },

  samplesBox: { gap: 6, backgroundColor: Colors.bg, borderRadius: 10, padding: 10 },
  samplesTitle: { fontSize: 12, fontWeight: '800', color: Colors.muted },
  sampleRow: { flexDirection: 'row', gap: 6 },
  sampleBullet: { color: Colors.muted, fontSize: 13 },
  sampleText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 18 },

  lastReported: { fontSize: 11, color: Colors.muted, textAlign: 'right' },
});
