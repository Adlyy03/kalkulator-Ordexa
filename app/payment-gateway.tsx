import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { NumericInput } from '../components/ui/NumericInput';
import { ResultCard } from '../components/ui/ResultCard';
import { Button } from '../components/ui/Button';
import { calculatePaymentGateway } from '../engine/payment-gateway';
import { formatIDR } from '../engine/math';

export default function PaymentGatewayScreen() {
  const router = useRouter();

  const [totalTransactions, setTotalTransactions] = useState(1000);
  const [successRate, setSuccessRate] = useState(98);
  const [avgTransactionValue, setAvgTransactionValue] = useState(150000);
  const [percentageFee, setPercentageFee] = useState(1.5); // 1.5%
  const [fixedFee, setFixedFee] = useState(2000); // Rp2.000 per trx
  const [feeBearer, setFeeBearer] = useState<'ORDEXA' | 'RESTAURANT'>('ORDEXA');

  const result = calculatePaymentGateway({
    totalTransactions,
    successRate: successRate / 100,
    averageTransactionValue: avgTransactionValue,
    config: {
      name: 'Midtrans / Xendit',
      mdrPercentage: percentageFee,
      fixedFeePerTransaction: fixedFee,
      paymentMethod: 'QRIS & VA',
    },
  });

  const netGtv = result.grossTransactionVolume - result.totalGatewayFee;

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
          <Text style={styles.screenTitle}>Payment Gateway</Text>
          <Text style={styles.screenSubtitle}>Biaya Transaksi MDR & Biaya Tetap</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Card */}
        <ResultCard
          title="TOTAL BIAYA GATEWAY"
          value={formatIDR(result.totalGatewayFee)}
          variant="coral"
          subtitle={`GTV Diproses: ${formatIDR(result.grossTransactionVolume)} (${result.successfulTransactions} trx)`}
          badgeText={`Beban: ${feeBearer}`}
          style={styles.summaryCard}
        />

        {/* Setting Fee Bearer */}
        <Card variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Pihak Penanggung Biaya MDR</Text>
          <View style={styles.bearerRow}>
            <TouchableOpacity
              style={[
                styles.bearerBtn,
                feeBearer === 'ORDEXA' && styles.bearerBtnActive,
              ]}
              onPress={() => setFeeBearer('ORDEXA')}
            >
              <Text
                style={[
                  styles.bearerText,
                  feeBearer === 'ORDEXA' && styles.bearerTextActive,
                ]}
              >
                Ditanggung ORDEXA
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bearerBtn,
                feeBearer === 'RESTAURANT' && styles.bearerBtnActive,
              ]}
              onPress={() => setFeeBearer('RESTAURANT')}
            >
              <Text
                style={[
                  styles.bearerText,
                  feeBearer === 'RESTAURANT' && styles.bearerTextActive,
                ]}
              >
                Dibebankan ke Resto
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Inputs */}
        <Card variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Parameter Transaksi</Text>

          <NumericInput
            label="Estimasi Total Transaksi (Bulan)"
            value={totalTransactions}
            onChangeValue={setTotalTransactions}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Rata-rata Nilai per Transaksi (IDR)"
            value={avgTransactionValue}
            onChangeValue={setAvgTransactionValue}
            placeholder="150000"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Biaya Tetap per Trx (IDR)"
            value={fixedFee}
            onChangeValue={setFixedFee}
            placeholder="2000"
          />
        </Card>

        {/* Breakdown Card */}
        <Card variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Rincian Pemotongan MDR</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Total Volume Transaksi (GTV):</Text>
            <Text style={styles.val}>{formatIDR(result.grossTransactionVolume)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Potongan MDR Persentase:</Text>
            <Text style={[styles.val, { color: '#FF6B6B' }]}>
              -{formatIDR(result.percentageFee)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Potongan Biaya Tetap ({fixedFee}/trx):</Text>
            <Text style={[styles.val, { color: '#FF6B6B' }]}>
              -{formatIDR(result.fixedFee)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.label, styles.bold]}>Pendapatan Bersih GTV:</Text>
            <Text style={[styles.val, styles.bold]}>
              {formatIDR(netGtv)}
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
  bearerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bearerBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  bearerBtnActive: {
    backgroundColor: '#171717',
  },
  bearerText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#171717',
  },
  bearerTextActive: {
    color: '#FFFFFF',
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
