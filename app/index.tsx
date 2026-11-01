import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calculator, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.92));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade & scale in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: false,
      }),
    ]).start();

    // Auto navigate after 2.4s
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const handleStartNow = () => {
    router.replace('/(tabs)');
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {/* Background Geometric Neubrutalism Shapes */}
      <View style={styles.bgBox1} />
      <View style={styles.bgBox2} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Brand Icon Box */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackdrop} />
          <View style={styles.iconBox}>
            <Calculator size={46} color="#171717" strokeWidth={2.5} />
          </View>
          <View style={styles.iconBadge}>
            <Sparkles size={16} color="#171717" />
          </View>
        </View>

        {/* Brand Titles */}
        <View style={styles.titleSection}>
          <Text style={styles.brandTitle}>ORDEXA</Text>
          <View style={styles.taglinePill}>
            <Text style={styles.taglinePillText}>BUSINESS CALCULATOR</Text>
          </View>
          <Text style={styles.descriptionText}>
            Simulasi Finansial, Proyeksi Omzet & Balik Modal Restoran
          </Text>
        </View>

        {/* Feature Highlights Pills */}
        <View style={styles.featureRow}>
          <View style={styles.featureBadge}>
            <TrendingUp size={13} color="#171717" />
            <Text style={styles.featureBadgeText}>MRR & ARR</Text>
          </View>
          <View style={styles.featureBadge}>
            <ShieldCheck size={13} color="#171717" />
            <Text style={styles.featureBadgeText}>Target BEP</Text>
          </View>
          <View style={styles.featureBadge}>
            <Text style={styles.featureBadgeText}>Offline SQLite</Text>
          </View>
        </View>

        {/* Loading Progress Bar */}
        <View style={styles.loadingContainer}>
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Menyiapkan sistem kalkulator...</Text>
        </View>

        {/* Direct Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.startButton}
          onPress={handleStartNow}
        >
          <Text style={styles.startButtonText}>Buka Aplikasi</Text>
          <ArrowRight size={18} color="#171717" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgBox1: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 220,
    height: 220,
    backgroundColor: '#C6F66A',
    borderWidth: 3,
    borderColor: '#171717',
    transform: [{ rotate: '15deg' }],
  },
  bgBox2: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    backgroundColor: '#FF6B6B',
    borderWidth: 3,
    borderColor: '#171717',
    transform: [{ rotate: '-12deg' }],
  },
  content: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#171717',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    zIndex: 10,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 18,
    marginTop: 4,
  },
  iconBackdrop: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 84,
    height: 84,
    backgroundColor: '#171717',
    borderRadius: 20,
  },
  iconBox: {
    width: 84,
    height: 84,
    backgroundColor: '#C6F66A',
    borderWidth: 3,
    borderColor: '#171717',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#171717',
    borderRadius: 14,
    padding: 5,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#171717',
    letterSpacing: -1,
  },
  taglinePill: {
    backgroundColor: '#171717',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  taglinePillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#C6F66A',
    letterSpacing: 1,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3EE',
    borderWidth: 1.5,
    borderColor: '#171717',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  featureBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#171717',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#171717',
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#C6F66A',
    borderWidth: 2,
    borderColor: '#171717',
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#171717',
  },
});
