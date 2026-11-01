import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { NumericInput } from '../components/ui/NumericInput';
import { ResultCard } from '../components/ui/ResultCard';
import { Button } from '../components/ui/Button';
import { formatIDR } from '../engine/math';
import { useFinancialStore } from '../store/useFinancialStore';

export default function PaketLanggananScreen() {
  const router = useRouter();
  const {
    packages,
    otherRevenue,
    updatePackageCount,
    updatePackagePrice,
    addPackage,
    deletePackage,
    setOtherRevenue,
    getFinancialSummary,
  } = useFinancialStore();

  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const summary = getFinancialSummary();

  const handleCreatePackage = () => {
    if (!newPkgName.trim()) {
      Alert.alert('Perhatian', 'Nama paket tidak boleh kosong.');
      return;
    }
    if (newPkgPrice <= 0) {
      Alert.alert('Perhatian', 'Harga paket harus lebih dari Rp0.');
      return;
    }
    addPackage(newPkgName.trim(), newPkgPrice);
    setNewPkgName('');
    setNewPkgPrice(0);
    setShowAddForm(false);
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
          <Text style={styles.screenTitle}>Paket Langganan</Text>
          <Text style={styles.screenSubtitle}>Atur harga paket & liat omzet bulanan yang masuk</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ringkasan Omzet Langganan */}
        <ResultCard
          title="TOTAL OMZET BULANAN (MRR)"
          value={formatIDR(summary.mrr)}
          variant="purple"
          subtitle={`ARR (Estimasi 1 Tahun): ${formatIDR(summary.arr)}`}
          badgeText={`${summary.totalActiveRestaurants} Mitra Resto`}
          style={styles.summaryCard}
        />

        {/* Section Input Per Paket */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Daftar Paket Langganan</Text>
          <TouchableOpacity
            style={styles.addToggleBtn}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={16} color="#171717" />
            <Text style={styles.addToggleText}>
              {showAddForm ? 'Tutup' : 'Tambah Paket'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Tambah Paket Baru */}
        {showAddForm && (
          <Card variant="lime" style={styles.addCard}>
            <Text style={styles.addCardTitle}>Buat Paket Kustom Baru</Text>
            <NumericInput
              label="Harga Paket Bulanan (IDR)"
              value={newPkgPrice}
              onChangeValue={setNewPkgPrice}
              placeholder="Contoh: 499000"
            />
            <Button
              title="Simpan Paket"
              variant="primary"
              size="sm"
              onPress={handleCreatePackage}
              style={{ marginTop: 8 }}
            />
          </Card>
        )}

        {/* List Paket Langganan */}
        {packages.map((pkg, index) => {
          const subtotal = pkg.restaurantCount * pkg.monthlyPrice;
          return (
            <Card key={`${pkg.name}-${index}`} variant="default" style={styles.pkgCard}>
              <View style={styles.pkgHeader}>
                <View style={styles.pkgBadge}>
                  <Text style={styles.pkgBadgeText}>{pkg.name}</Text>
                </View>
                <View style={styles.pkgHeaderRight}>
                  <Text style={styles.pkgSubtotal}>{formatIDR(subtotal)}/bln</Text>
                  {packages.length > 1 && (
                    <TouchableOpacity
                      onPress={() => deletePackage(index)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <NumericInput
                    label="Jumlah Mitra Resto"
                    value={pkg.restaurantCount}
                    onChangeValue={(val) => updatePackageCount(index, val)}
                    placeholder="0"
                  />
                </View>
                <View style={styles.inputCol}>
                  <NumericInput
                    label="Harga Paket (IDR)"
                    value={pkg.monthlyPrice}
                    onChangeValue={(val) => updatePackagePrice(index, val)}
                    placeholder="0"
                  />
                </View>
              </View>
            </Card>
          );
        })}

        {/* Pendapatan Berulang Lainnya */}
        <Card variant="default" style={styles.otherCard}>
          <Text style={styles.otherTitle}>Pendapatan Berulang Tambahan</Text>
          <Text style={styles.otherSubtitle}>
            Contoh: Add-on modul inventory, hardware rental bulanan, dll.
          </Text>
          <NumericInput
            label="Nominal Bulanan (IDR)"
            value={otherRevenue}
            onChangeValue={setOtherRevenue}
            placeholder="0"
          />
        </Card>

        {/* Metrik Detail */}
        <Card variant="default" style={styles.metricCard}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Rata-rata Omzet / Resto (ARPA):</Text>
            <Text style={styles.metricValue}>
              {typeof summary.arpa === 'number' ? formatIDR(summary.arpa) : 'N/A'}
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Mitra Aktif Terdaftar:</Text>
            <Text style={styles.metricValue}>{summary.totalActiveRestaurants} Restoran</Text>
          </View>
        </Card>

        <Button
          title="Selesai & Kembali ke Menu"
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionHeader: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#171717',
  },
  addToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6F66A',
    borderWidth: 2,
    borderColor: '#171717',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addToggleText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#171717',
    marginLeft: 4,
  },
  addCard: {
    marginBottom: 16,
  },
  addCardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
    marginBottom: 10,
  },
  pkgCard: {
    marginBottom: 14,
  },
  pkgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pkgBadge: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#171717',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pkgBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  pkgHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pkgSubtotal: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
    marginRight: 8,
  },
  deleteBtn: {
    padding: 6,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  inputCol: {
    flex: 1,
  },
  otherCard: {
    marginBottom: 16,
  },
  otherTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
    marginBottom: 4,
  },
  otherSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  metricCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 13,
    color: '#475569',
  },
  metricValue: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  metricDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  doneBtn: {
    marginTop: 8,
  },
});
