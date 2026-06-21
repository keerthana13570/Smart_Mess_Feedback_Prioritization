import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/Colors';

type InputProps = TextInputProps & {
  label?: string;
  showToggle?: boolean;
};

export function Input({ label, showToggle, secureTextEntry, style, ...props }: InputProps) {
  const [visible, setVisible] = useState(false);

  // When showToggle is true we manage secureTextEntry ourselves
  const isSecure = showToggle ? !visible : secureTextEntry;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          placeholderTextColor="#98A2B3"
          autoCapitalize={props.autoCapitalize ?? 'none'}
          style={[styles.input, showToggle && styles.inputPadded, style]}
        />
        {showToggle && (
          <TouchableOpacity
            style={styles.eye}
            onPress={() => setVisible((v) => !v)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={visible ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={Colors.muted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { color: Colors.muted, fontSize: 13, fontWeight: '600' },
  row: { position: 'relative', justifyContent: 'center' },
  input: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 16,
  },
  inputPadded: { paddingRight: 48 },
  eye: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
