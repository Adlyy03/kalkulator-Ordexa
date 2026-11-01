import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { formatIDR, parseIDR } from '../../engine/math';

interface NumericInputProps {
  value: number;
  onChangeValue: (value: number) => void;
  label?: string;
  placeholder?: string;
}

export function NumericInput({
  value,
  onChangeValue,
  label,
  placeholder = 'Rp0'
}: NumericInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(formatIDR(value));

  const handleChange = (text: string) => {
    setDisplayValue(text);
    const numValue = parseIDR(text);
    onChangeValue(numValue);
  };

  const handleBlur = () => {
    setFocused(false);
    // Re-format on blur
    setDisplayValue(formatIDR(value));
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused
        ]}
        value={displayValue}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 14,
    color: '#171717',
    marginBottom: 8,
  },
  input: {
    minHeight: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171717',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    // Tabular numbers for financial data
    fontVariant: ['tabular-nums'],
  },
  inputFocused: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3EE',
  },
});
