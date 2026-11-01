import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import {
  LayoutDashboard,
  Calculator,
  SlidersHorizontal,
  FileText,
  Settings,
  type LucideIcon,
} from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_CONFIG: Record<string, { label: string; icon: LucideIcon }> = {
  index: {
    label: 'Beranda',
    icon: LayoutDashboard,
  },
  kalkulator: {
    label: 'Kalkulator',
    icon: Calculator,
  },
  simulasi: {
    label: 'Simulasi',
    icon: SlidersHorizontal,
  },
  laporan: {
    label: 'Laporan',
    icon: FileText,
  },
  pengaturan: {
    label: 'Pengaturan',
    icon: Settings,
  },
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : 12;

  return (
    <View style={[styles.outerContainer, { bottom: bottomInset }]}>
      <BlurView intensity={24} tint="light" style={styles.blurContainer}>
        <View style={styles.tabBarInner}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[route.name] || {
              label: route.name,
              icon: LayoutDashboard,
            };
            const Icon = config.icon;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={config.label}
                testID={`tab-${route.name}`}
                onPress={onPress}
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  isFocused && styles.tabItemActive,
                ]}
              >
                <Icon
                  size={19}
                  color={isFocused ? '#FFFFFF' : '#64748B'}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    shadowColor: '#171717',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    overflow: 'hidden',
  },
  blurContainer: {
    width: '100%',
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 7,
    paddingHorizontal: 6,
    minHeight: 64,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 14,
    minHeight: 48,
    minWidth: 44,
  },
  tabItemActive: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#171717',
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: '#64748B',
    fontWeight: '600',
  },
});
