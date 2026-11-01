import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  TrendingUp,
  Receipt,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Calculator,
  SlidersHorizontal,
} from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { formatIDR } from '../../engine/math';
import { useFinancialStore } from '../../store/useFinancialStore';

export default function DashboardScreen() {
  const router = useRouter();
  const { isInitialized, initialize, getFinancialSummary } = useFinancialStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized]);

  const summary = getFinancialSummary();
  const netProfit = summary.profitLoss.netProfit;
  const isProfit = netProfit >= 0;
  const bepTarget =
    typeof summary.bep.breakEvenRestaurants === 'number'
      ? summary.bep.breakEvenRestaurants
      : 0;
  const activeRestaurants = summary.totalActiveRestaurants;
  const bepProgress =
    bepTarget > 0 ? Math.min(100, Math.round((activeRestaurants / bepTarget) * 100)) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Dashboard */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>ORDEXA</Text>
            <Text style={styles.headerSubtitle}>Kalkulator Bisnis & Perencanaan Mitra</Text>
          </View>
          <View style={styles.statusBadge}>
            <ShieldCheck size={16} color="#171717" />
            <Text style={styles.statusBadgeText}>Data Otomatis</Text>
          </View>
        </View>

        {/* Kartu Utama: Total Omzet Langganan */}
        <Card variant="purple" style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <Text style={styles.mainCardLabel}>ESTIMASI OMZET BULANAN (MRR)</Text>
            <View style={styles.pillLime}>
              <Text style={styles.pillLimeText}>
                {activeRestaurants > 0 ? `${activeRestaurants} Resto Aktif` : 'Mulai Masukin Data'}
              </Text>
            </View>
          </View>
          <Text style={styles.mainCardValue}>{formatIDR(summary.mrr)}</Text>
          <View style={styles.mainCardDivider} />
          <View style={styles.mainCardFooter}>
            <Text style={styles.mainCardFooterText}>
              Setahun Kira-kira: <Text style={styles.boldWhite}>{formatIDR(summary.arr)}</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.mainCardAction}
              onPress={() => router.push('/paket-langganan')}
            >
              <Text style={styles.mainCardActionText}>Atur Paket</Text>
              <ArrowRight size={14} color="#171717" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Grid Metrik Cepat */}
        <View style={styles.metricGrid}>
          {/* Sisa Uang / Untung Bersih */}
          <Card
            variant={isProfit ? 'lime' : 'coral'}
            style={styles.metricCard}
          >
            <View style={styles.metricCardTop}>
              <TrendingUp size={20} color="#171717" />
              <Text style={styles.metricCardLabel}>
                {isProfit ? 'UNTUNG BERSIH' : 'BONCOS / TEKOR'}
              </Text>
            </View>
            <Text style={styles.metricCardValue}>{formatIDR(netProfit)}</Text>
            <View
              style={[
                styles.marginBadge,
                { backgroundColor: isProfit ? '#A3E635' : '#FECACA' },
              ]}
            >
              <Text style={styles.marginBadgeText}>
                {summary.profitLoss.netProfitMargin === 'N/A'
                  ? '0% Margin'
                  : `${summary.profitLoss.netProfitMargin}% Margin`}
              </Text>
            </View>
          </Card>

          {/* Pengeluaran Bulanan */}
          <Card variant="default" style={styles.metricCard}>
            <View style={styles.metricCardTop}>
              <Receipt size={20} color="#171717" />
              <Text style={styles.metricCardLabel}>TOTAL BIAYA KELUAR</Text>
            </View>
            <Text style={styles.metricCardValue}>
              {formatIDR(summary.totalExpenses)}
            </Text>
            <View style={[styles.marginBadge, { backgroundColor: '#F1F5F9' }]}>
              <Text style={[styles.marginBadgeText, { color: '#475569' }]}>
                {formatIDR(summary.profitLoss.operatingExpenses)} Tetap
              </Text>
            </View>
          </Card>
        </View>

        {/* Progres Balik Modal (BEP) */}
        <Card variant="default" style={styles.bepCard}>
          <View style={styles.bepHeader}>
            <Text style={styles.bepTitle}>Target Resto (Biar Ga Tekor)</Text>
            <Text style={styles.bepPercentText}>{bepProgress}%</Text>
          </View>
          <Text style={styles.bepSubtitle}>
            {activeRestaurants >= bepTarget && bepTarget > 0
              ? 'Mantap jiwa! Pemasukan udah nutup semua biaya operasional bulanan.'
              : `Kurang ${Math.max(0, bepTarget - activeRestaurants)} restoran lagi biar biaya bulanan tertutup impas.`}
          </Text>

          {/* Progress Bar Neubrutalism */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(bepProgress, 100)}%` },
              ]}
            />
          </View>

          <View style={styles.bepFooter}>
            <Text style={styles.bepFooterText}>
              Saat ini: <Text style={styles.boldText}>{activeRestaurants} Resto</Text>
            </Text>
            <Text style={styles.bepStatusTag}>
              Target Impas: {bepTarget > 0 ? `${bepTarget} Restoran` : 'Belum Ada'}
            </Text>
          </View>
        </Card>

        {/* Menu Cepat 1 Fitur 1 Halaman */}
        <View style={styles.quickActionSection}>
          <Text style={styles.sectionTitle}>Pilih Yang Mau Kamu Atur</Text>
          <Text style={styles.sectionSubtitle}>
            Tiap fitur halamannya terpisah, ga bakal ketuker-tuker lagi
          </Text>

          <View style={styles.actionGrid}>
            {/* 1. Paket Langganan */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionCard}
              onPress={() => router.push('/paket-langganan')}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#8B5CF6' }]}>
                <Calculator size={22} color="#FFFFFF" />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>1. Isi Paket Langganan</Text>
                <Text style={styles.actionDesc}>
                  Atur harga & jumlah resto langganan (Basic, Pro, Enterprise)
                </Text>
              </View>
              <ArrowRight size={18} color="#171717" />
            </TouchableOpacity>

            {/* 2. Biaya Operasional */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionCard}
              onPress={() => router.push('/biaya-operasional')}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FF6B6B' }]}>
                <Receipt size={22} color="#FFFFFF" />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>2. Masukin Biaya Operasional</Text>
                <Text style={styles.actionDesc}>
                  Catat biaya sewa server, gaji tim, & biaya WhatsApp API
                </Text>
              </View>
              <ArrowRight size={18} color="#171717" />
            </TouchableOpacity>

            {/* 3. Modal Awal */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionCard}
              onPress={() => router.push('/modal-awal')}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#C6F66A' }]}>
                <Briefcase size={22} color="#171717" />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>3. Catat Modal Awal (Alat & Izin)</Text>
                <Text style={styles.actionDesc}>
                  Catat beli laptop, legalitas PT & cek estimasi kapan modal balik
                </Text>
              </View>
              <ArrowRight size={18} color="#171717" />
            </TouchableOpacity>

            {/* 4. Simulasi */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/simulasi')}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FBBF24' }]}>
                <SlidersHorizontal size={22} color="#171717" />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>4. Simulasi Proyeksi Masa Depan</Text>
                <Text style={styles.actionDesc}>
                  Cek skenario Pesimis, Realistis, & Optimis sampai 36 bulan ke depan
                </Text>
              </View>
              <ArrowRight size={18} color="#171717" />
            </TouchableOpacity>
          </View>
        </View>
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
  brandTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 24,
    color: '#171717',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  statusBadge: {
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
  statusBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#171717',
  },
  mainCard: {
    marginBottom: 16,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mainCardLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#E9D5FF',
    letterSpacing: 0.5,
  },
  pillLime: {
    backgroundColor: '#C6F66A',
    borderWidth: 1.5,
    borderColor: '#171717',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  pillLimeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#171717',
  },
  mainCardValue: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  mainCardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  mainCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainCardFooterText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#E9D5FF',
  },
  boldWhite: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF',
  },
  mainCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6F66A',
    borderWidth: 2,
    borderColor: '#171717',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  mainCardActionText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#171717',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 14,
  },
  metricCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metricCardLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#171717',
  },
  metricCardValue: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 18,
    color: '#171717',
    marginBottom: 8,
  },
  marginBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  marginBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#171717',
  },
  bepCard: {
    marginBottom: 16,
  },
  bepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bepTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  bepPercentText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    color: '#171717',
  },
  bepSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#171717',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  bepFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bepFooterText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#475569',
  },
  boldText: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#171717',
  },
  bepStatusTag: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#8B5CF6',
  },
  quickActionSection: {
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#171717',
  },
  sectionSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  actionGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171717',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#171717',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  actionDesc: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
});
