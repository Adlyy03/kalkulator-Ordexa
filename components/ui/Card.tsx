import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'purple' | 'lime' | 'coral';
  size?: 'default' | 'large';
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', size = 'default', style }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        size === 'large' && styles.large,
        variant === 'default' && styles.default,
        variant === 'purple' && styles.purple,
        variant === 'lime' && styles.lime,
        variant === 'coral' && styles.coral,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171717',
    padding: 16,
    shadowColor: '#171717',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  large: {
    padding: 24,
    shadowOffset: { width: 5, height: 5 },
  },
  default: {
    backgroundColor: '#FFFFFF',
  },
  purple: {
    backgroundColor: '#8B5CF6',
  },
  lime: {
    backgroundColor: '#C6F66A',
  },
  coral: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
});
