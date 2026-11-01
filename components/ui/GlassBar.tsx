import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';

interface GlassBarProps {
  children: ReactNode;
  intensity?: number;
}

export function GlassBar({ children, intensity = 16 }: GlassBarProps) {
  if (Platform.OS === 'web') {
    // Fallback for web: CSS backdrop-filter
    return (
      <View style={[styles.container, styles.webFallback]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} style={styles.container} tint="light">
      <View style={styles.overlay}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    padding: 12,
  },
  webFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
  },
});
