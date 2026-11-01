import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Briefcase,
  AlertTriangle,
} from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { NumericInput } from '../components/ui/NumericInput';
import { ResultCard } from '../components/ui/ResultCard';
import { Button } from '../components/ui/Button';
import { formatIDR } from '../engine/math';
import { useFinancialStore } from '../store/useFinancialStore';
import type { CapitalInvestment } from '../db/repositories/capital';

const CATEGORIES = [
  'Bikin Aplikasi / Dev',
  'Laptop & Alat Kerja',
  'Izin & Legalitas PT',
  'Iklan & Promosi Awal',
  'Sewa Tempat / Kantor',
  'Lain-lain',
];

export default function ModalAwalScreen() {
  const router = useRouter();
  const {
    capitalInvestments,
    addCapitalInvestment,
    updateCapitalInvestment,
    deleteCapitalInvestment,
    getFinancialSummary,
  } = useFinancialStore();

  const summary = getFinancialSummary();
  const monthlyProfit = summary.profitLoss.netProfit;

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setItemName('');
    setSelectedCategory(CATEGORIES[0]);
    setAmount(0);
    setNotes('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (item: CapitalInvestment) => {
    if (!item.id) return;
    setEditingId(item.id);
    setItemName(item.item_name);
    setSelectedCategory(item.category);
    setAmount(item.amount);
    setNotes(item.notes || '');
    setShowAddForm(true);
  };

  const handleSaveItem = async () => {
    if (!itemName.trim()) {
      Alert.alert('Eits, Kurang Lengkap', 'Tolong isi dulu nama pengeluaran modal awalnya ya.');
      return;
    }
    if (amount <= 0) {
      Alert.alert('Nominal Kosong', 'Nominal biaya harus lebih dari Rp0.');
      return;
    }

    if (editingId !== null) {
      await updateCapitalInvestment(editingId, {
        item_name: itemName.trim(),
        category: selectedCategory,
        amount,
        notes: notes.trim(),
      });
      Alert.alert('Beres!', 'Data modal awal berhasil diperbarui.');
    } else {
      await addCapitalInvestment({
        item_name: itemName.trim(),
        category: selectedCategory,
        amount,
        notes: notes.trim(),
      });
    }

    resetForm();
  };

  const handleDeleteItem = (id: number, name: string) => {
    Alert.alert(
      'Hapus Item Ini?',
      `Yakin mau hapus pengeluaran "${name}" dari catatan modal awal?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: async () => {
            await deleteCapitalInvestment(id);
          },
        },
      ]
    );
  };

  const totalCapital = summary.totalCapitalInvestment;
  const paybackMonths = summary.roi.paybackPeriodMonths;

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
          <Text style={styles.screenTitle}>Catatan Modal Awal</Text>
          <Text style={styles.screenSubtitle}>Berapa uang yang keluar & kapan bisa balik modal</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ringkasan Modal Awal */}
        <ResultCard
          title="TOTAL MODAL YANG DIKELUARIN"
          value={formatIDR(totalCapital)}
          variant="purple"
          subtitle={`Untung Bersih Tiap Bulan: ${formatIDR(monthlyProfit)}`}
          badgeText="Investasi Pertama"
          style={styles.summaryCard}
        />

        {/* Status Kapan Balik Modal */}
        <Card
          variant={
            typeof paybackMonths === 'number' && paybackMonths > 0
              ? 'lime'
              : 'coral'
          }
          style={styles.paybackCard}
        >
          <View style={styles.paybackHeader}>
            <View style={styles.paybackIconBox}>
              {typeof paybackMonths === 'number' && paybackMonths > 0 ? (
                <Clock size={22} color="#171717" />
              ) : (
                <AlertTriangle size={22} color="#171717" />
              )}
            </View>
            <View style={styles.paybackTitleBox}>
              <Text style={styles.paybackTitle}>
                {typeof paybackMonths === 'number' && paybackMonths > 0
                  ? `Kira-kira Balik Modal: ~${Math.ceil(paybackMonths)} Bulan Lagi`
                  : totalCapital === 0
                  ? 'Belum Ada Catatan Modal Awal'
                  : 'Operasional Masih Tekor / Belum Untung'}
              </Text>
              <Text style={styles.paybackDesc}>
                {typeof paybackMonths === 'number' && paybackMonths > 0
                  ? `Mantap! Dari keuntungan bersih ${formatIDR(monthlyProfit)}/bln, modal awal ${formatIDR(totalCapital)} bakal lunas tertutup dalam kurun ${paybackMonths} bulan.`
                  : totalCapital === 0
                  ? 'Ketik pengeluaran awal kamu (misal laptop, server, bikin PT) di bawah biar sistem bisa itung estimasinya.'
                  : 'Bulan ini pengeluaran masih lebih gede dari pemasukan. Tambahin mitra resto biar cepet nutup modal awal!'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Header List CRUD */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Daftar Pengeluaran Modal</Text>
          <TouchableOpacity
            style={styles.addToggleBtn}
            onPress={() => {
              if (showAddForm) {
                resetForm();
              } else {
                setShowAddForm(true);
              }
            }}
          >
            <Plus size={16} color="#171717" />
            <Text style={styles.addToggleText}>
              {showAddForm ? 'Batal' : 'Tambah Pengeluaran'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Input / Edit Modal Awal */}
        {showAddForm && (
          <Card variant="default" style={styles.formCard}>
            <Text style={styles.formCardTitle}>
              {editingId !== null ? '✏️ Edit Catatan Modal' : '➕ Catat Modal Baru'}
            </Text>

            {/* Nama Pengeluaran */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Buat beli / bayar apa?</Text>
              <TextInput
                style={styles.textInput}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Misal: Beli laptop dev, urus PT, beli domain"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Pilihan Kategori */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kategori Kebutuhan</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catPill,
                        isSelected && styles.catPillSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catPillText,
                          isSelected && styles.catPillTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Nominal */}
            <NumericInput
              label="Berapa biayanya? (Rp)"
              value={amount}
              onChangeValue={setAmount}
              placeholder="Contoh: 15.000.000"
            />

            {/* Catatan Tambahan */}
            <View style={[styles.inputGroup, { marginTop: 12 }]}>
              <Text style={styles.inputLabel}>Catatan Tambahan (Boleh dikosongin)</Text>
              <TextInput
                style={[styles.textInput, { height: 60, textAlignVertical: 'top' }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Misal: Beli 2 unit second mulus bergaransi"
                placeholderTextColor="#94A3B8"
                multiline
              />
            </View>

            {/* Tombol Simpan */}
            <View style={styles.formActionRow}>
              <Button
                title={editingId !== null ? 'Simpan Perubahan' : 'Catat Pengeluaran Ini'}
                variant="primary"
                size="default"
                onPress={handleSaveItem}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        )}

        {/* List Modal Awal */}
        {capitalInvestments.length === 0 ? (
          <Card variant="default" style={styles.emptyCard}>
            <Briefcase size={32} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Belum Ada Modal yang Dicatat</Text>
            <Text style={styles.emptyDesc}>
              Ketik modal pertama kamu (misal beli laptop kerja, sewa server, atau biaya izin) pakai tombol di atas.
            </Text>
          </Card>
        ) : (
          capitalInvestments.map((item) => (
            <Card key={item.id} variant="default" style={styles.itemCard}>
              <View style={styles.itemMainRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{item.item_name}</Text>
                  <View style={styles.itemCategoryBadge}>
                    <Text style={styles.itemCategoryText}>{item.category}</Text>
                  </View>
                  {item.notes ? (
                    <Text style={styles.itemNotes}>"{item.notes}"</Text>
                  ) : null}
                </View>

                <View style={styles.itemRight}>
                  <Text style={styles.itemAmount}>{formatIDR(item.amount)}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      onPress={() => handleStartEdit(item)}
                      style={styles.actionIconBtn}
                    >
                      <Edit3 size={16} color="#475569" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        item.id && handleDeleteItem(item.id, item.item_name)
                      }
                      style={styles.actionIconBtn}
                    >
                      <Trash2 size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          ))
        )}

        <Button
          title="Selesai & Balik ke Menu"
          variant="primary"
          size="large"
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
    marginBottom: 14,
  },
  paybackCard: {
    marginBottom: 16,
    padding: 14,
  },
  paybackHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  paybackIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paybackTitleBox: {
    flex: 1,
  },
  paybackTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
    marginBottom: 2,
  },
  paybackDesc: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  formCard: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#171717',
  },
  formCardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#171717',
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    borderWidth: 2,
    borderColor: '#171717',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#171717',
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: '#F8FAFC',
  },
  catPillSelected: {
    backgroundColor: '#8B5CF6',
  },
  catPillText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#475569',
  },
  catPillTextSelected: {
    color: '#FFFFFF',
  },
  formActionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
  },
  emptyDesc: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  itemCard: {
    marginBottom: 10,
  },
  itemMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemLeft: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  itemCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#171717',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  itemCategoryText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#334155',
  },
  itemNotes: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
    marginBottom: 6,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionIconBtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
  },
  doneBtn: {
    marginTop: 10,
  },
});
