import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Target, AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { NumericInput } from '../components/ui/NumericInput';
import { ResultCard } from '../components/ui/ResultCard';
import { Button } from '../components/ui/Button';
import { calculateBreakEven } from '../engine/break-even';
import { formatIDR } from '../engine/math';
import { useFinancialStore } from '../store/useFinancialStore';

export default function BreakEvenScreen() {
  const router = useRouter();
  const { getFinancialSummary } = useFinancialStore();
  const summary = getFinancialSummary();

  const [fixedCost, setFixedCost] = useState(summary.profitLoss.operatingExpenses);
  const [arpa, setArpa] = useState(typeof summary.arpa === 'number' && summary.arpa > 0 ? summary.arpa : 199000);
  const [variableCost, setVariableCost] = useState(summary.variableCostPerResto);
  const [currentRestaurants, setCurrentRestaurants] = useState(summary.totalActiveRestaurants);

  useEffect(() => {
    setFixedCost(summary.profitLoss.operatingExpenses);
    if (typeof summary.arpa === 'number' && summary.arpa > 0) setArpa(summary.arpa);
    setVariableCost(summary.variableCostPerResto);
    setCurrentRestaurants(summary.totalActiveRestaurants);
  }, [
    summary.profitLoss.operatingExpenses,
    summary.arpa,
    summary.variableCostPerResto,
    summary.totalActiveRestaurants,
  ]);

  const result = calculateBreakEven({
    fixedCost,
    arpa,
    variableCostPerRestaurant: variableCost,
  });

  const bepCount = result.breakEvenRestaurants;
  const isAchievable = result.isAchievable;
  const isReached = typeof bepCount === 'number' && currentRestaurants >= bepCount;
  const progress =
    typeof bepCount === 'number' && bepCount > 0
      ? Math.min(100, Math.round((currentRestaurants / bepCount) * 100))
      : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#171717" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.screenTitle}>Target Balik Modal</Text>
          <Text style={styles.screenSubtitle}>Berapa minimal resto langganan biar ga rugi?</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status BEP Card */}
        <ResultCard
          title="TARGET MINIMAL RESTO BIAR GA TEKOR"
          value={
            typeof bepCount === 'number'
              ? `${bepCount} Restoran`
              : 'BELUM BISA DICAPAI'
          }
          variant={isReached ? 'lime' : 'purple'}
          subtitle={
            typeof result.breakEvenRevenue === 'number'
              ? `Omzet Minimal Masuk: ${formatIDR(result.breakEvenRevenue)}/bln`
              : 'Harga langganan lebih kecil dibanding biaya per resto'
          }
          badgeText={isReached ? 'SUDAH BALIK MODAL' : `Kurang ${Math.max(0, (typeof bepCount === 'number' ? bepCount : 0) - currentRestaurants)} Resto`}
          style={styles.mainResultCard}
        />

        {/* Progress Bar Neubrutalism */}
        <Card variant="default" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Target Balik Modal Operasional</Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: isReached ? '#C6F66A' : '#8B5CF6',
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressFooterText}>
              Resto Sekarang: <Text style={styles.bold}>{currentRestaurants} Resto</Text>
            </Text>
            <Text style={styles.progressFooterText}>
              Target: <Text style={styles.bold}>{typeof bepCount === 'number' ? bepCount : '-'} Resto</Text>
            </Text>
          </View>
        </Card>

        {/* Input Parameters */}
        <Card variant="default" style={styles.paramCard}>
          <Text style={styles.cardSectionTitle}>Hitungan Biaya & Harga</Text>

          <NumericInput
            label="Biaya Rutin Kantor (Server, Gaji Tim, Sewa)"
            value={fixedCost}
            onChangeValue={setFixedCost}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Rata-rata Harga Paket per Resto"
            value={arpa}
            onChangeValue={setArpa}
            placeholder="199000"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Biaya Tambahan Tiap 1 Resto (WA API, dll)"
            value={variableCost}
            onChangeValue={setVariableCost}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Jumlah Resto yang Langganan Sekarang"
            value={currentRestaurants}
            onChangeValue={setCurrentRestaurants}
            placeholder="0"
          />
        </Card>

        {/* Contribution Margin Breakdown */}
        <Card variant="default" style={styles.marginCard}>
          <Text style={styles.cardSectionTitle}>Analisis Margin Kontribusi</Text>

          <View style={styles.row}>
            <Text style={styles.label}>ARPA per Mitra</Text>
            <Text style={styles.val}>{formatIDR(arpa)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Biaya Variabel per Mitra</Text>
            <Text style={[styles.val, { color: '#FF6B6B' }]}>
              -{formatIDR(variableCost)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.label, styles.bold]}>Margin Kontribusi Bersih / Resto</Text>
            <Text style={[styles.val, styles.bold]}>
              {typeof result.contributionMargin === 'number'
                ? formatIDR(result.contributionMargin)
                : 'N/A'}
            </Text>
          </View>
        </Card>

        <Button
          title="Kembali ke Menu"
          variant="primary"
          size="lg"
          onPress={() => router.back()}
          style={styles.doneBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EE',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#171717',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: '#F5F3EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleBox: {
    flex: 1,
  },
  screenTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#171717',
  },
  screenSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainResultCard: {
    marginBottom: 16,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  progressPercent: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    color: '#171717',
  },
  progressTrack: {
    height: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171717',
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressFooterText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#475569',
  },
  paramCard: {
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
    marginBottom: 12,
  },
  marginCard: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 13,
    color: '#334155',
  },
  val: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  bold: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#171717',
  },
  doneBtn: {
    marginTop: 8,
  },
});
