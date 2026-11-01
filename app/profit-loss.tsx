import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { NumericInput } from '../components/ui/NumericInput';
import { ResultCard } from '../components/ui/ResultCard';
import { Button } from '../components/ui/Button';
import { calculateProfitLoss } from '../engine/profit-loss';
import { formatIDR } from '../engine/math';
import { useFinancialStore } from '../store/useFinancialStore';

export default function ProfitLossScreen() {
  const router = useRouter();
  const { getFinancialSummary } = useFinancialStore();
  const summary = getFinancialSummary();

  const [revenue, setRevenue] = useState(summary.mrr);
  const [directCosts, setDirectCosts] = useState(summary.totalVariableCosts);
  const [operatingExpenses, setOperatingExpenses] = useState(summary.profitLoss.operatingExpenses);

  useEffect(() => {
    setRevenue(summary.mrr);
    setDirectCosts(summary.totalVariableCosts);
    setOperatingExpenses(summary.profitLoss.operatingExpenses);
  }, [summary.mrr, summary.totalVariableCosts, summary.profitLoss.operatingExpenses]);

  const result = calculateProfitLoss({
    totalRevenue: revenue,
    directCosts,
    operatingExpenses,
  });

  const getStatusColor = () => {
    switch (result.status) {
      case 'PROFIT':
        return '#C6F66A';
      case 'LOSS':
        return '#FF6B6B';
      case 'BREAK_EVEN':
        return '#8B5CF6';
    }
  };

  const getStatusLabel = () => {
    switch (result.status) {
      case 'PROFIT':
        return 'SURPLUS / UNTUNG';
      case 'LOSS':
        return 'DEFISIT / RUGI';
      case 'BREAK_EVEN':
        return 'TITIK IMPAS';
    }
  };

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
          <Text style={styles.screenTitle}>Cek Untung & Rugi</Text>
          <Text style={styles.screenSubtitle}>Liat sisa uang bersih bulanan setelah semua biaya dibayar</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text
            style={[
              styles.statusText,
              result.status === 'LOSS' && { color: '#FFFFFF' },
            ]}
          >
            STATUS: {getStatusLabel()}
          </Text>
        </View>

        {/* Kartu Hasil Utama */}
        <ResultCard
          title="LABA BERSIH BULANAN (NET PROFIT)"
          value={formatIDR(result.netProfit)}
          variant={result.status === 'PROFIT' ? 'lime' : result.status === 'LOSS' ? 'coral' : 'purple'}
          subtitle={`Net Margin: ${result.netProfitMargin === 'N/A' ? 'N/A' : `${result.netProfitMargin}%`}`}
          badgeText={result.status}
          style={styles.mainResultCard}
        />

        {/* Input & Kaskade Parameter */}
        <Card variant="default" style={styles.sectionCard}>
          <Text style={styles.cardSectionTitle}>Komponen Pendapatan & Biaya</Text>

          <NumericInput
            label="Total Omzet Bulanan (Revenue)"
            value={revenue}
            onChangeValue={setRevenue}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Biaya Langsung / Variabel (Direct Costs)"
            value={directCosts}
            onChangeValue={setDirectCosts}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Biaya Operasional Tetap (Operating Expenses)"
            value={operatingExpenses}
            onChangeValue={setOperatingExpenses}
            placeholder="0"
          />
        </Card>

        {/* Kaskade Finansial Breakdown */}
        <Card variant="default" style={styles.breakdownCard}>
          <Text style={styles.cardSectionTitle}>Rincian Alur Uang Masuk & Keluar</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>(+) Total Omzet Kotor Masuk</Text>
            <Text style={styles.breakdownValue}>{formatIDR(result.totalRevenue)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>(-) Biaya Langsung Resto (WA API, dll)</Text>
            <Text style={[styles.breakdownValue, { color: '#FF6B6B' }]}>
              -{formatIDR(result.directCosts)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, styles.bold]}>(=) Sisa Kotor (Gross Profit)</Text>
            <Text style={[styles.breakdownValue, styles.bold]}>
              {formatIDR(result.grossProfit)}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownSub}>Persentase Margin Kotor</Text>
            <Text style={styles.breakdownSub}>
              {result.grossProfitMargin === 'N/A' ? 'N/A' : `${result.grossProfitMargin}%`}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>(-) Biaya Rutin Kantor (Server, Gaji, Sewa)</Text>
            <Text style={[styles.breakdownValue, { color: '#FF6B6B' }]}>
              -{formatIDR(result.operatingExpenses)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, styles.extraBold]}>
              (=) Untung Bersih (Net Profit)
            </Text>
            <Text
              style={[
                styles.breakdownValue,
                styles.extraBold,
                { color: result.netProfit >= 0 ? '#15803D' : '#DC2626' },
              ]}
            >
              {formatIDR(result.netProfit)}
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
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#171717',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#171717',
  },
  mainResultCard: {
    marginBottom: 16,
  },
  sectionCard: {
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
    marginBottom: 12,
  },
  breakdownCard: {
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 13,
    color: '#334155',
  },
  breakdownValue: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  breakdownSub: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 6,
  },
  bold: {
    fontFamily: 'PlusJakartaSans-Bold',
  },
  extraBold: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 15,
  },
  doneBtn: {
    marginTop: 8,
  },
});
