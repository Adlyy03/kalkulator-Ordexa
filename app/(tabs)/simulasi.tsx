import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  Target,
  Sparkles,
} from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { NumericInput } from '../../components/ui/NumericInput';
import { ResultCard } from '../../components/ui/ResultCard';
import { Button } from '../../components/ui/Button';
import { formatIDR } from '../../engine/math';
import { compareScenarios, type ScenarioType, type MultiScenarioComparison } from '../../engine/scenario-simulator';
import { simulateGrowth } from '../../engine/growth-simulator';
import { useFinancialStore } from '../../store/useFinancialStore';

const PERIODS: (3 | 6 | 12 | 24 | 36)[] = [3, 6, 12, 24, 36];

export default function SimulasiScreen() {
  const { getFinancialSummary } = useFinancialStore();
  const summary = getFinancialSummary();

  const [selectedMonths, setSelectedMonths] = useState<3 | 6 | 12 | 24 | 36>(12);
  const [selectedScenarioTab, setSelectedScenarioTab] = useState<ScenarioType>('realistic');

  // Parameters
  const [startingResto, setStartingResto] = useState(
    summary.totalActiveRestaurants > 0 ? summary.totalActiveRestaurants : 10
  );
  const [newRestoPerMonth, setNewRestoPerMonth] = useState(5);
  const [monthlyChurnPct, setMonthlyChurnPct] = useState(5); // 5%
  const [arpa, setArpa] = useState(
    typeof summary.arpa === 'number' && summary.arpa > 0 ? summary.arpa : 199000
  );
  const [marketingBudget, setMarketingBudget] = useState(2500000); // 2.5 jt
  const [fixedCost, setFixedCost] = useState(
    summary.profitLoss.operatingExpenses > 0 ? summary.profitLoss.operatingExpenses : 2000000
  );
  const [variableCostPerResto, setVariableCostPerResto] = useState(
    summary.variableCostPerResto > 0 ? summary.variableCostPerResto : 25000
  );

  // Run 3-way scenario comparison
  const comparison: MultiScenarioComparison = compareScenarios(
    {
      startingRestaurants: startingResto,
      newRestaurantsPerMonth: newRestoPerMonth,
      monthlyChurnRate: monthlyChurnPct / 100,
      arpa,
      fixedCost,
      variableCostPerRestaurant: variableCostPerResto,
    },
    selectedMonths
  );

  const activeScenario = comparison[selectedScenarioTab];

  // Also calculate LTV:CAC for realistic scenario
  const growthBI = simulateGrowth({
    startingRestaurants: startingResto,
    newRestaurantsPerMonth: newRestoPerMonth,
    monthlyChurnRate: monthlyChurnPct / 100,
    arpa,
    baseMonthlyExpenses: fixedCost,
    marketingBudget,
    simulationMonths: selectedMonths,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Simulasi & BI</Text>
            <Text style={styles.subtitle}>
              Proyeksi Multi-Skenario & Metrik LTV:CAC (Phase 5)
            </Text>
          </View>
          <View style={styles.badge}>
            <Sparkles size={16} color="#171717" />
            <Text style={styles.badgeText}>Compounding BI</Text>
          </View>
        </View>

        {/* Periode Selector (3, 6, 12, 24, 36 Bulan) */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => {
            const isSelected = selectedMonths === p;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, isSelected && styles.periodBtnActive]}
                onPress={() => setSelectedMonths(p)}
              >
                <Text
                  style={[
                    styles.periodBtnText,
                    isSelected && styles.periodBtnTextActive,
                  ]}
                >
                  {p} Bulan
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Scenario Switcher Tabs */}
        <View style={styles.scenarioTabs}>
          <TouchableOpacity
            style={[
              styles.scenarioTab,
              selectedScenarioTab === 'pessimistic' && styles.scenarioTabPessimistic,
            ]}
            onPress={() => setSelectedScenarioTab('pessimistic')}
          >
            <Text
              style={[
                styles.scenarioTabText,
                selectedScenarioTab === 'pessimistic' && styles.textWhite,
              ]}
            >
              Pesimis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.scenarioTab,
              selectedScenarioTab === 'realistic' && styles.scenarioTabRealistic,
            ]}
            onPress={() => setSelectedScenarioTab('realistic')}
          >
            <Text
              style={[
                styles.scenarioTabText,
                selectedScenarioTab === 'realistic' && styles.textWhite,
              ]}
            >
              Realistis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.scenarioTab,
              selectedScenarioTab === 'optimistic' && styles.scenarioTabOptimistic,
            ]}
            onPress={() => setSelectedScenarioTab('optimistic')}
          >
            <Text
              style={[
                styles.scenarioTabText,
                selectedScenarioTab === 'optimistic' && styles.textDark,
              ]}
            >
              Optimis
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Scenario Card Output */}
        <ResultCard
          title={`HASIL PROYEKSI ${selectedMonths} BULAN (${activeScenario.title.toUpperCase()})`}
          value={formatIDR(activeScenario.finalMRR)}
          variant={
            selectedScenarioTab === 'optimistic'
              ? 'lime'
              : selectedScenarioTab === 'pessimistic'
              ? 'coral'
              : 'purple'
          }
          subtitle={`ARR: ${formatIDR(activeScenario.finalARR)} • Kas Kumulatif: ${formatIDR(activeScenario.cumulativeCashFlow)}`}
          badgeText={`${activeScenario.finalRestaurants} Resto Akhir`}
          style={styles.summaryResultCard}
        />

        {/* 3-Way Scenario Matrix Comparison */}
        <Card variant="default" style={styles.matrixCard}>
          <Text style={styles.cardSectionTitle}>Perbandingan 3 Skenario Sekaligus</Text>

          <View style={styles.matrixHeaderRow}>
            <Text style={[styles.matrixColTitle, { flex: 1.2 }]}>Metrik Finansial</Text>
            <Text style={[styles.matrixColTitle, { color: '#EF4444' }]}>Pesimis</Text>
            <Text style={[styles.matrixColTitle, { color: '#8B5CF6' }]}>Realistis</Text>
            <Text style={[styles.matrixColTitle, { color: '#15803D' }]}>Optimis</Text>
          </View>

          <View style={styles.matrixRow}>
            <Text style={[styles.matrixLabel, { flex: 1.2 }]}>Total Resto</Text>
            <Text style={styles.matrixVal}>{comparison.pessimistic.finalRestaurants}</Text>
            <Text style={styles.matrixVal}>{comparison.realistic.finalRestaurants}</Text>
            <Text style={styles.matrixVal}>{comparison.optimistic.finalRestaurants}</Text>
          </View>

          <View style={styles.matrixRow}>
            <Text style={[styles.matrixLabel, { flex: 1.2 }]}>MRR Akhir</Text>
            <Text style={styles.matrixVal}>
              Rp{(comparison.pessimistic.finalMRR / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.matrixVal}>
              Rp{(comparison.realistic.finalMRR / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.matrixVal}>
              Rp{(comparison.optimistic.finalMRR / 1000000).toFixed(1)}M
            </Text>
          </View>

          <View style={styles.matrixRow}>
            <Text style={[styles.matrixLabel, { flex: 1.2 }]}>Laba Bersih/bln</Text>
            <Text
              style={[
                styles.matrixVal,
                { color: comparison.pessimistic.monthlyNetProfit >= 0 ? '#15803D' : '#EF4444' },
              ]}
            >
              Rp{(comparison.pessimistic.monthlyNetProfit / 1000000).toFixed(1)}M
            </Text>
            <Text
              style={[
                styles.matrixVal,
                { color: comparison.realistic.monthlyNetProfit >= 0 ? '#15803D' : '#EF4444' },
              ]}
            >
              Rp{(comparison.realistic.monthlyNetProfit / 1000000).toFixed(1)}M
            </Text>
            <Text
              style={[
                styles.matrixVal,
                { color: comparison.optimistic.monthlyNetProfit >= 0 ? '#15803D' : '#EF4444' },
              ]}
            >
              Rp{(comparison.optimistic.monthlyNetProfit / 1000000).toFixed(1)}M
            </Text>
          </View>

          <View style={styles.matrixRow}>
            <Text style={[styles.matrixLabel, { flex: 1.2 }]}>Kas Kumulatif</Text>
            <Text style={styles.matrixVal}>
              Rp{(comparison.pessimistic.cumulativeCashFlow / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.matrixVal}>
              Rp{(comparison.realistic.cumulativeCashFlow / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.matrixVal}>
              Rp{(comparison.optimistic.cumulativeCashFlow / 1000000).toFixed(1)}M
            </Text>
          </View>
        </Card>

        {/* Metrik Pertumbuhan Bisnis (LTV, CAC, LTV:CAC Ratio) */}
        <Card variant="lime" style={styles.biCard}>
          <Text style={styles.cardSectionTitle}>Analisis Efisiensi Pertumbuhan (LTV:CAC)</Text>

          <View style={styles.biGrid}>
            <View style={styles.biItem}>
              <Text style={styles.biLabel}>CAC (Biaya Akuisisi)</Text>
              <Text style={styles.biValue}>
                {typeof growthBI.cac === 'number' ? formatIDR(growthBI.cac) : 'N/A'}
              </Text>
            </View>

            <View style={styles.biItem}>
              <Text style={styles.biLabel}>LTV (Customer Value)</Text>
              <Text style={styles.biValue}>
                {typeof growthBI.ltv === 'number' ? formatIDR(growthBI.ltv) : 'N/A'}
              </Text>
            </View>

            <View style={styles.biItem}>
              <Text style={styles.biLabel}>Rasio LTV:CAC</Text>
              <Text style={[styles.biValue, { color: '#8B5CF6' }]}>
                {typeof growthBI.ltvToCacRatio === 'number'
                  ? `${growthBI.ltvToCacRatio}x`
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.biItem}>
              <Text style={styles.biLabel}>Bulan Impas Kumulatif</Text>
              <Text style={styles.biValue}>
                {growthBI.breakEvenMonth !== 'N/A'
                  ? `Bulan ke-${growthBI.breakEvenMonth}`
                  : 'Belum Impas'}
              </Text>
            </View>
          </View>

          <View style={styles.biNoteBox}>
            <Text style={styles.biNoteText}>
              Benchmark SaaS: Rasio LTV:CAC di atas 3.0x menandakan bisnis sangat sehat dan efisien dalam mengakuisisi mitra restoran baru.
            </Text>
          </View>
        </Card>

        {/* Input Parameter Skenario */}
        <Card variant="default" style={styles.paramCard}>
          <Text style={styles.cardSectionTitle}>Sesuaikan Parameter Dasar</Text>

          <NumericInput
            label="Mitra Restoran Awal"
            value={startingResto}
            onChangeValue={setStartingResto}
            placeholder="10"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Mitra Baru Bertambah / Bulan"
            value={newRestoPerMonth}
            onChangeValue={setNewRestoPerMonth}
            placeholder="5"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Estimasi Churn Bulanan (%)"
            value={monthlyChurnPct}
            onChangeValue={setMonthlyChurnPct}
            placeholder="5"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Budget Marketing Bulanan (IDR)"
            value={marketingBudget}
            onChangeValue={setMarketingBudget}
            placeholder="2500000"
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EE',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 22,
    color: '#171717',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6F66A',
    borderWidth: 2,
    borderColor: '#171717',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#171717',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: '#171717',
  },
  periodBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#171717',
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
  },
  scenarioTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  scenarioTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  scenarioTabPessimistic: {
    backgroundColor: '#FF6B6B',
  },
  scenarioTabRealistic: {
    backgroundColor: '#8B5CF6',
  },
  scenarioTabOptimistic: {
    backgroundColor: '#C6F66A',
  },
  scenarioTabText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#171717',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#171717',
  },
  summaryResultCard: {
    marginBottom: 16,
  },
  matrixCard: {
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
    marginBottom: 12,
  },
  matrixHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#171717',
    paddingBottom: 6,
    marginBottom: 8,
  },
  matrixColTitle: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  matrixRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  matrixLabel: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: '#334155',
  },
  matrixVal: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#171717',
    textAlign: 'center',
  },
  biCard: {
    marginBottom: 16,
  },
  biGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  biItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171717',
    borderRadius: 8,
    padding: 10,
  },
  biLabel: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    color: '#64748B',
  },
  biValue: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 14,
    color: '#171717',
    marginTop: 2,
  },
  biNoteBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#171717',
    borderRadius: 8,
    padding: 10,
  },
  biNoteText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  paramCard: {
    marginBottom: 20,
  },
});
