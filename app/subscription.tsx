import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, UserMinus, UserPlus } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { NumericInput } from '../components/ui/NumericInput';
import { ResultCard } from '../components/ui/ResultCard';
import { Button } from '../components/ui/Button';
import { calculateSubscriptionMetrics } from '../engine/subscription';
import { formatIDR } from '../engine/math';
import { useFinancialStore } from '../store/useFinancialStore';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { getFinancialSummary } = useFinancialStore();
  const summary = getFinancialSummary();

  const [startingCustomers, setStartingCustomers] = useState(
    summary.totalActiveRestaurants > 0 ? summary.totalActiveRestaurants : 20
  );
  const [newCustomers, setNewCustomers] = useState(5);
  const [churnedCustomers, setChurnedCustomers] = useState(1);
  const [arpa, setArpa] = useState(
    typeof summary.arpa === 'number' && summary.arpa > 0 ? summary.arpa : 199000
  );

  const metrics = calculateSubscriptionMetrics(
    startingCustomers,
    newCustomers,
    churnedCustomers
  );

  const churnPct =
    typeof metrics.customerChurnRate === 'number'
      ? `${(metrics.customerChurnRate * 100).toFixed(1)}%`
      : 'N/A';

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
          <Text style={styles.screenTitle}>Churn & Retensi Mitra</Text>
          <Text style={styles.screenSubtitle}>Kalkulasi Fluktuasi & Pertumbuhan Mitra</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Card */}
        <ResultCard
          title="TINGKAT CHURN BULANAN (CHURN RATE)"
          value={churnPct}
          variant={typeof metrics.customerChurnRate === 'number' && metrics.customerChurnRate > 5 ? 'coral' : 'lime'}
          subtitle={`Net Penambahan Mitra: ${metrics.netGrowth > 0 ? `+${metrics.netGrowth}` : metrics.netGrowth} Resto`}
          badgeText={`${metrics.endingCustomers} Mitra Akhir`}
          style={styles.summaryCard}
        />

        {/* Input Parameters */}
        <Card variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Data Pelanggan Restoran</Text>

          <NumericInput
            label="Mitra Awal Bulan (Starting)"
            value={startingCustomers}
            onChangeValue={setStartingCustomers}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Mitra Baru Bergabung (New)"
            value={newCustomers}
            onChangeValue={setNewCustomers}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Mitra Berhenti / Churned (Lost)"
            value={churnedCustomers}
            onChangeValue={setChurnedCustomers}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Rata-rata Nilai Paket (ARPA)"
            value={arpa}
            onChangeValue={setArpa}
            placeholder="199000"
          />
        </Card>

        {/* Breakdown Card */}
        <Card variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Dampak Pendapatan (Revenue Churn)</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Mitra Berakhir (Ending):</Text>
            <Text style={styles.val}>{metrics.endingCustomers} Restoran</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Potensi MRR Hilang (Lost):</Text>
            <Text style={[styles.val, { color: '#FF6B6B' }]}>
              -{formatIDR(churnedCustomers * arpa)}/bln
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Omzet Baru Masuk (Gained):</Text>
            <Text style={[styles.val, { color: '#15803D' }]}>
              +{formatIDR(newCustomers * arpa)}/bln
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.label, styles.bold]}>Net Perubahan Omzet:</Text>
            <Text style={[styles.val, styles.bold]}>
              {formatIDR((newCustomers - churnedCustomers) * arpa)}/bln
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
  summaryCard: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
    marginBottom: 12,
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
