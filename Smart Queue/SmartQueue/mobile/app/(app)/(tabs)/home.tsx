import React, { useState } from 'react';
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

import { Colors, severityColor } from '@/components/ui/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const TOPICS = [
  { id: 'taste', label: 'Taste', emoji: '🍽️' },
  { id: 'hygiene', label: 'Hygiene', emoji: '🧹' },
  { id: 'delay', label: 'Delay', emoji: '⏱️' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
  { id: 'others', label: 'Others', emoji: '📝' },
] as const;

const SEVERITIES = [
  { id: 'minor', label: 'Minor', desc: 'Small issue', color: Colors.success },
  { id: 'moderate', label: 'Moderate', desc: 'Noticeable issue', color: Colors.warn },
  { id: 'serious', label: 'Serious', desc: 'Urgent issue', color: Colors.danger },
] as const;

type TopicId = (typeof TOPICS)[number]['id'];
type SeverityId = (typeof SEVERITIES)[number]['id'];

export default function HomeScreen() {
  const { state } = useAuth();
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState<TopicId>('taste');
  const [severity, setSeverity] = useState<SeverityId>('minor');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const userName = state.status === 'signed_in' ? state.user.name : '';

  async function handleSubmit() {
    const trimmed = message.trim();
    if (!trimmed) {
      Alert.alert('Message required', 'Please describe the issue before submitting.');
      return;
    }
    if (trimmed.length > 500) {
      Alert.alert('Message too long', 'Please keep the feedback within 500 characters.');
      return;
    }
    try {
      setLoading(true);
      await api.post('/feedback/add', { message: trimmed, topic, severity });
      setMessage('');
      setTopic('taste');
      setSeverity('minor');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Submission failed. Try again.';
      Alert.alert('Failed to submit', msg);
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {userName} 👋</Text>
            <Text style={styles.title}>Submit Feedback</Text>
            <Text style={styles.subtitle}>Help improve the mess by reporting issues</Text>
          </View>

          {/* Success banner */}
          {submitted && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>✅ Feedback submitted successfully!</Text>
            </View>
          )}

          {/* Topic selection */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Select Topic</Text>
            <View style={styles.topicGrid}>
              {TOPICS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.topicChip, topic === t.id && styles.topicChipActive]}
                  onPress={() => setTopic(t.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.topicEmoji}>{t.emoji}</Text>
                  <Text style={[styles.topicLabel, topic === t.id && styles.topicLabelActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Severity selection */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Severity Level</Text>
            <View style={styles.severityRow}>
              {SEVERITIES.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.severityCard,
                    severity === s.id && { borderColor: s.color, backgroundColor: s.color + '15' },
                  ]}
                  onPress={() => setSeverity(s.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioOuter, severity === s.id && { borderColor: s.color }]}>
                    {severity === s.id && (
                      <View style={[styles.radioInner, { backgroundColor: s.color }]} />
                    )}
                  </View>
                  <Text style={[styles.severityLabel, severity === s.id && { color: s.color }]}>
                    {s.label}
                  </Text>
                  <Text style={styles.severityDesc}>{s.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Color indicator bar */}
            <View style={[styles.severityBar, { backgroundColor: severityColor(severity) }]} />
          </Card>

          {/* Message input */}
          <Card style={styles.section}>
            <Input
              label="Describe the Issue"
              value={message}
              onChangeText={setMessage}
              placeholder="e.g. The food was too salty today and the serving area was dirty..."
              multiline
              maxLength={500}
              style={styles.messageInput}
            />
            <Text style={styles.charCount}>{message.length}/500</Text>
          </Card>

          {/* Submit button */}
          <Button
            title={loading ? 'Submitting...' : 'Submit Feedback'}
            loading={loading}
            onPress={handleSubmit}
          />

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 16, gap: 14 },

  header: { gap: 4, paddingTop: 8 },
  greeting: { fontSize: 13, color: Colors.muted },
  title: { fontSize: 24, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.muted },

  successBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successText: { color: Colors.success, fontWeight: '700', textAlign: 'center' },

  section: { gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },

  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  topicChipActive: {
    borderColor: Colors.primary,
    backgroundColor: '#EFF6FF',
  },
  topicEmoji: { fontSize: 16 },
  topicLabel: { fontSize: 13, fontWeight: '700', color: Colors.muted },
  topicLabelActive: { color: Colors.primary },

  severityRow: { flexDirection: 'row', gap: 8 },
  severityCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  severityLabel: { fontSize: 13, fontWeight: '800', color: Colors.muted },
  severityDesc: { fontSize: 10, color: Colors.muted, textAlign: 'center' },
  severityBar: { height: 5, borderRadius: 999 },

  messageInput: { minHeight: 100, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: Colors.muted, textAlign: 'right' },
});
