import React from 'react';
import { Pressable, StyleSheet, Text, type PressableProps, ActivityIndicator, View } from 'react-native';

import { Colors } from '@/components/ui/Colors';

export function Button({
  title,
  loading,
  variant = 'primary',
  ...props
}: PressableProps & { title: string; loading?: boolean; variant?: 'primary' | 'ghost' }) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      {...props}
      disabled={props.disabled || loading}
      style={(state) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        state.pressed && !isGhost ? styles.pressed : null,
        props.disabled || loading ? styles.disabled : null,
        typeof props.style === 'function' ? props.style(state) : props.style,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={isGhost ? Colors.primary : '#fff'} /> : null}
        <Text style={[styles.text, isGhost ? styles.textGhost : styles.textPrimary]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  primary: { backgroundColor: Colors.primary },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.6 },
  text: { fontSize: 16, fontWeight: '700' },
  textPrimary: { color: '#fff' },
  textGhost: { color: Colors.primary },
});

