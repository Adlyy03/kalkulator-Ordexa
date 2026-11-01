import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Layers,
  Receipt,
  Briefcase,
  PieChart,
  Target,
  Users,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import { ResultCard } from '../../components/ui/ResultCard';
import { formatIDR } from '../../engine/math';
import { useFinancialStore } from '../../store/useFinancialStore';

export default function KalkulatorScreen() {
  const router = useRouter();
  const { isInitialized, initialize, getFinancialSummary } = useFinancialStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized]);

  const summary = getFinancialSummary();
  const netProfit = summary.profitLoss.netProfit;

  const calculatorFeatures = [
    {
      id: 'revenue',
      title: '1. Omzet & Paket Langganan',
      desc: 'Atur jumlah resto & harga paket bulanan (Basic, Pro, Enterprise)',
      icon: Layers,
      color: '#8B5CF6',
      iconColor: '#FFFFFF',
      badge: `${summary.totalActiveRestaurants} Resto • ${formatIDR(summary.mrr)}`,
      route: '/paket-langganan',
    },
    {
      id: 'expenses',
      title: '2. Pengeluaran Operasional',
      desc: 'Catat sewa server, tim teknis, dan biaya WhatsApp API per resto',
      icon: Receipt,
      color: '#FF6B6B',
      iconColor: '#FFFFFF',
      badge: `${formatIDR(summary.totalExpenses)}/bln`,
      route: '/biaya-operasional',
    },
    {
      id: 'capex',
      title: '3. Modal Awal & Kapan Balik Modal',
      desc: 'Catat belanja laptop, legalitas PT & cek estimasi kapan modal balik',
      icon: Briefcase,
      color: '#C6F66A',
      iconColor: '#171717',
      badge: `${formatIDR(summary.totalCapitalInvestment)} Modal`,
      route: '/modal-awal',
    },
    {
      id: 'profit-loss',
      title: '4. Cek Untung / Rugi Bulanan',
      desc: 'Liat sisa uang bersih bulanan setelah semua pengeluaran dibayar',
      icon: PieChart,
      color: '#FBBF24',
      iconColor: '#171717',
      badge: `Sisa: ${formatIDR(netProfit)}`,
      route: '/profit-loss',
    },
    {
      id: 'bep',
      title: '5. Target Resto (Biar Ga Tekor)',
      desc: 'Cari tau butuh berapa resto langganan biar operasional ga rugi',
      icon: Target,
      color: '#38BDF8',
      iconColor: '#171717',
      badge: typeof summary.bep.breakEvenRestaurants === 'number'
        ? `Target: ${summary.bep.breakEvenRestaurants} Resto`
        : 'N/A',
      route: '/break-even',
    },
    {
      id: 'subscription',
      title: '6. Resto Masuk & Berhenti (Churn)',
      desc: 'Pantau resto baru yang gabung vs resto yang berhenti langganan',
      icon: Users,
      color: '#EC4899',
      iconColor: '#FFFFFF',
      badge: 'Retensi & Churn',
      route: '/subscription',
    },
    {
      id: 'gateway',
      title: '7. Potongan Payment Gateway',
      desc: 'Simulasi potongan biaya per transaksi (MDR QRIS & Virtual Account)',
      icon: CreditCard,
      color: '#10B981',
      iconColor: '#FFFFFF',
      badge: 'Biaya Transaksi',
      route: '/payment-gateway',
    },
  ];

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
            <Text style={styles.title}>Menu Kalkulator</Text>
            <Text style={styles.subtitle}>
              1 Fitur 1 Halaman — Langsung pilih hitungan yang mau dicek
            </Text>
          </View>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={16} color="#171717" />
            <Text style={styles.verifiedText}>Tersambung</Text>
          </View>
        </View>

        {/* Live Mini Overview */}
        <ResultCard
          title="UNTUNG / RUGI BULANAN SAAT INI"
          value={formatIDR(netProfit)}
          variant={netProfit >= 0 ? 'lime' : 'coral'}
          subtitle={`Omzet: ${formatIDR(summary.mrr)} • Biaya: ${formatIDR(summary.totalExpenses)}`}
          badgeText={netProfit >= 0 ? 'LAGI UNTUNG' : 'MASIH TEKOR'}
          style={styles.overviewCard}
        />

        {/* Section List */}
        <Text style={styles.sectionTitle}>Pilih Yang Mau Dihitung</Text>

        <View style={styles.featureList}>
          {calculatorFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={styles.featureCard}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                  <Icon size={24} color={item.iconColor} />
                </View>

                <View style={styles.textBox}>
                  <View style={styles.titleRow}>
                    <Text style={styles.featureTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.featureDesc}>{item.desc}</Text>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                </View>

                <View style={styles.arrowBox}>
                  <ArrowRight size={20} color="#171717" />
                </View>
              </TouchableOpacity>
            );
          })}
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
  verifiedBadge: {
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
  verifiedText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#171717',
  },
  overviewCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#171717',
    marginBottom: 12,
  },
  featureList: {
    gap: 12,
  },
  featureCard: {
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
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
  },
  featureDesc: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#334155',
  },
  arrowBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});
