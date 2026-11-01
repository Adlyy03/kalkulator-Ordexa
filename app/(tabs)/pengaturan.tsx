import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Database, ShieldCheck, Save, RefreshCw } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { NumericInput } from '../../components/ui/NumericInput';
import { Button } from '../../components/ui/Button';
import { useFinancialStore } from '../../store/useFinancialStore';

export default function PengaturanScreen() {
  const { packages, updatePackagePrice, resetToDefaults } = useFinancialStore();

  const [basicPrice, setBasicPrice] = useState(
    packages.find((p) => p.name === 'Basic')?.monthlyPrice || 99000
  );
  const [proPrice, setProPrice] = useState(
    packages.find((p) => p.name === 'Pro')?.monthlyPrice || 199000
  );
  const [enterprisePrice, setEnterprisePrice] = useState(
    packages.find((p) => p.name === 'Enterprise')?.monthlyPrice || 399000
  );

  useEffect(() => {
    const b = packages.find((p) => p.name === 'Basic');
    const pr = packages.find((p) => p.name === 'Pro');
    const ent = packages.find((p) => p.name === 'Enterprise');
    if (b) setBasicPrice(b.monthlyPrice);
    if (pr) setProPrice(pr.monthlyPrice);
    if (ent) setEnterprisePrice(ent.monthlyPrice);
  }, [packages]);

  const handleSave = () => {
    packages.forEach((pkg, index) => {
      if (pkg.name === 'Basic') updatePackagePrice(index, basicPrice);
      if (pkg.name === 'Pro') updatePackagePrice(index, proPrice);
      if (pkg.name === 'Enterprise') updatePackagePrice(index, enterprisePrice);
    });

    Alert.alert('Berhasil Disimpan', 'Standar harga paket langganan berhasil diperbarui di seluruh kalkulator & database lokal.');
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset Data',
      'Apakah Anda yakin ingin mengembalikan seluruh data simulasi, paket, dan kalkulator ke nilai default awal?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Reset Bersih',
          style: 'destructive',
          onPress: async () => {
            await resetToDefaults();
            setBasicPrice(99000);
            setProPrice(199000);
            setEnterprisePrice(399000);
            Alert.alert('Selesai', 'Data berhasil direset.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pengaturan</Text>
          <Text style={styles.subtitle}>
            Kelola harga dasar paket dan preferensi sistem
          </Text>
        </View>

        {/* Database Offline Status */}
        <Card variant="default" style={styles.dbCard}>
          <View style={styles.dbHeader}>
            <Database size={20} color="#8B5CF6" />
            <Text style={styles.dbTitle}>Database Offline (SQLite Aktif)</Text>
          </View>
          <Text style={styles.dbDesc}>
            Seluruh data finansial, belanja modal awal, dan simulasi tersimpan aman di perangkat lokal Anda tanpa koneksi server (Local-First).
          </Text>
          <View style={styles.dbBadge}>
            <ShieldCheck size={14} color="#15803D" />
            <Text style={styles.dbBadgeText}>100% Offline-First</Text>
          </View>
        </Card>

        {/* Form Harga Dasar */}
        <Card variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Standar Harga Paket Langganan</Text>
          <Text style={styles.cardSubtitle}>
            Harga ini akan digunakan sebagai nilai dasar di seluruh kalkulator.
          </Text>

          <NumericInput
            label="Paket Basic (IDR/Bulan)"
            value={basicPrice}
            onChangeValue={setBasicPrice}
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Paket Pro (IDR/Bulan)"
            value={proPrice}
            onChangeValue={setProPrice}
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Paket Enterprise (IDR/Bulan)"
            value={enterprisePrice}
            onChangeValue={setEnterprisePrice}
          />

          <Button
            title="Simpan Perubahan Harga"
            variant="primary"
            size="md"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </Card>

        {/* Zona Bahaya / Reset */}
        <Card variant="coral" style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Zona Pengaturan Ulang</Text>
          <Text style={styles.dangerDesc}>
            Kembalikan seluruh parameter perhitungan dan data inputan ke kondisi default kosong (0).
          </Text>
          <Button
            title="Reset Seluruh Data"
            variant="outline"
            size="sm"
            onPress={handleReset}
            style={styles.resetBtn}
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
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 24,
    color: '#171717',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  dbCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  dbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dbTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  dbDesc: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  dbBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  dbBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 11,
    color: '#15803D',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#171717',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  saveBtn: {
    marginTop: 16,
  },
  dangerCard: {
    marginBottom: 20,
  },
  dangerTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
    marginBottom: 4,
  },
  dangerDesc: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#475569',
    marginBottom: 12,
  },
  resetBtn: {
    borderColor: '#171717',
    backgroundColor: '#FFFFFF',
  },
});
