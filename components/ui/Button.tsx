import { Pressable, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children?: string;
  title?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'default' | 'large' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  onPress,
  children,
  title,
  variant = 'primary',
  size = 'default',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const label = children || title || '';
  const isLarge = size === 'large' || size === 'lg';
  const isSmall = size === 'sm';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        isLarge && styles.large,
        isSmall && styles.small,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'accent' && styles.accent,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.text,
            isSmall && styles.textSmall,
            variant === 'primary' && styles.textPrimary,
            variant === 'secondary' && styles.textSecondary,
            variant === 'accent' && styles.textAccent,
            variant === 'outline' && styles.textOutline,
            disabled && styles.textDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  fullWidth: {
    width: '100%',
  },
  large: {
    minHeight: 52,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  small: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowOffset: { width: 2, height: 2 },
  },
  primary: {
    backgroundColor: '#8B5CF6',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
  },
  accent: {
    backgroundColor: '#C6F66A',
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#171717',
  },
  disabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.5,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
  },
  text: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
  },
  textSmall: {
    fontSize: 12,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#171717',
  },
  textAccent: {
    color: '#171717',
  },
  textOutline: {
    color: '#171717',
  },
  textDisabled: {
    color: '#FFFFFF',
  },
});
