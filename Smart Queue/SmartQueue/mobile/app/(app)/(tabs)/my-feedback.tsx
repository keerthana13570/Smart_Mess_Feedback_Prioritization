import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Colors, severityColor } from '@/components/ui/Colors';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';

type FeedbackItem = {
  _id: string;
  message: string;
  topic: 'taste' | 'hygiene' | 'delay' | 'spicy' | 'others';
  severity: 'minor' | 'moderate' | 'serious';
  createdAt: string;
};

const TOPIC_EMOJI: Record<string, string> = {
  taste: '🍽️',
  hygiene: '🧹',
  delay: '⏱️',
  spicy: '🌶️',
  others: '📝',
};

export default function MyFeedbackScreen() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setItems([]);
    const res = await api.get('/feedback/user');
    setItems(res.data?.feedback ?? []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load()
        .catch((e) => setError(e?.response?.data?.message ?? e?.message ?? 'Failed to load'))
        .finally(() => setLoading(false));
    }, [load])
  );

  async function handleRefresh() {
    setRefreshing(true);
    try { await load(); } catch {}
    setRefreshing(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Feedback</Text>
          <Text style={styles.subtitle}>
            {items.length} submission{items.length !== 1 ? 's' : ''} • Pull to refresh
          </Text>
        </View>

        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </Card>
        )}

        {items.length === 0 && !error ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No feedback yet</Text>
            <Text style={styles.emptyText}>
              Go to the Submit tab to report your first issue.
            </Text>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item._id} style={styles.feedbackCard}>
              {/* Header row */}
              <View style={styles.cardHeader}>
                <View style={styles.topicRow}>
                  <Text style={styles.topicEmoji}>{TOPIC_EMOJI[item.topic] ?? '📌'}</Text>
                  <Text style={styles.topicName}>{item.topic.toUpperCase()}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: severityColor(item.severity) }]}>
                  <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
                </View>
              </View>

              {/* Message */}
              <Text style={styles.message}>{item.message}</Text>

              {/* Date */}
              <Text style={styles.date}>
                🕐 {new Date(item.createdAt).toLocaleString()}
              </Text>
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
  scroll: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { gap: 4, paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.muted },

  errorCard: { backgroundColor: '#FEF2F2', borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontWeight: '700' },

  emptyCard: { alignItems: 'center', gap: 10, paddingVertical: 40 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptyText: { color: Colors.muted, textAlign: 'center', lineHeight: 20 },

  feedbackCard: { gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  topicEmoji: { fontSize: 18 },
  topicName: { fontSize: 14, fontWeight: '900', color: Colors.text },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  severityText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  message: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  date: { color: Colors.muted, fontSize: 12 },
});
