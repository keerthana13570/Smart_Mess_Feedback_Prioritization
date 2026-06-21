import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Colors } from '@/components/ui/Colors';

export function Card(props: ViewProps) {
  return <View {...props} style={[styles.card, props.style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
});

