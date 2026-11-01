import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Card } from './Card';
import { formatIDR } from '../../engine/math';

interface ResultCardProps {
  label?: string;
  title?: string;
  value: number | string;
  variant?: 'default' | 'purple' | 'lime' | 'coral' | 'featured' | 'profit' | 'loss';
  formula?: string;
  unit?: string;
  subtitle?: string;
  badgeText?: string;
  style?: StyleProp<ViewStyle>;
}

export function ResultCard({
  label,
  title,
  value,
  variant = 'purple',
  formula,
  unit = '',
  subtitle,
  badgeText,
  style,
}: ResultCardProps) {
  const displayLabel = title || label || '';
  const displayValue = typeof value === 'number' ? formatIDR(value) : value;
  const isNA = value === 'N/A';

  const isCoral = variant === 'coral' || variant === 'loss';
  const isLime = variant === 'lime' || variant === 'profit';
  const isPurple = variant === 'purple' || variant === 'featured';

  const cardVariant: 'default' | 'purple' | 'lime' | 'coral' = isLime
    ? 'lime'
    : isPurple
    ? 'purple'
    : isCoral
    ? 'coral'
    : 'default';

  return (
    <Card variant={cardVariant} size="large" style={style}>
      <View style={styles.topRow}>
        <Text
          style={[
            styles.label,
            isPurple && styles.labelLight,
            isLime && styles.labelDark,
            isCoral && styles.labelCoral,
          ]}
        >
          {displayLabel}
        </Text>
        {badgeText && (
          <View
            style={[
              styles.badgePill,
              isPurple && styles.badgePurple,
              isLime && styles.badgeLime,
              isCoral && styles.badgeCoral,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isPurple && styles.badgeTextPurple,
                isLime && styles.badgeTextLime,
                isCoral && styles.badgeTextCoral,
              ]}
            >
              {badgeText}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.value,
          isPurple && styles.valueLight,
          isLime && styles.valueDark,
          isCoral && styles.valueCoral,
          isNA && styles.valueNA,
        ]}
      >
        {displayValue}
        {unit}
      </Text>

      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            isPurple && styles.subtitleLight,
            isLime && styles.subtitleDark,
            isCoral && styles.subtitleCoral,
          ]}
        >
          {subtitle}
        </Text>
      )}

      {formula && (
        <Text
          style={[
            styles.formula,
            isPurple && styles.formulaLight,
            isLime && styles.formulaDark,
          ]}
        >
          {formula}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#64748B',
    letterSpacing: 0.5,
    flex: 1,
  },
  labelLight: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  labelDark: {
    color: '#171717',
  },
  labelCoral: {
    color: '#991B1B',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#171717',
    backgroundColor: '#FFFFFF',
  },
  badgePurple: {
    backgroundColor: '#C6F66A',
  },
  badgeLime: {
    backgroundColor: '#FFFFFF',
  },
  badgeCoral: {
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#171717',
  },
  badgeTextPurple: {
    color: '#171717',
  },
  badgeTextLime: {
    color: '#171717',
  },
  badgeTextCoral: {
    color: '#DC2626',
  },
  value: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 28,
    color: '#171717',
    fontVariant: ['tabular-nums'],
    marginBottom: 4,
  },
  valueLight: {
    color: '#FFFFFF',
  },
  valueDark: {
    color: '#171717',
  },
  valueCoral: {
    color: '#991B1B',
  },
  valueNA: {
    color: '#94A3B8',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  subtitleLight: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  subtitleDark: {
    color: '#171717',
  },
  subtitleCoral: {
    color: '#7F1D1D',
  },
  formula: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: 6,
  },
  formulaLight: {
    color: 'rgba(255, 255, 255, 0.75)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  formulaDark: {
    color: '#171717',
    borderTopColor: 'rgba(23, 23, 23, 0.15)',
  },
});
