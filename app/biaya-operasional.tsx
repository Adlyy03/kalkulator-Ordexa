import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Trash2, Layers } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { NumericInput } from '../components/ui/NumericInput';
import { ResultCard } from '../components/ui/ResultCard';
import { Button } from '../components/ui/Button';
import { formatIDR } from '../engine/math';
import { useFinancialStore } from '../store/useFinancialStore';

export default function BiayaOperasionalScreen() {
  const router = useRouter();
  const {
    fixedCosts,
    setFixedCosts,
    variableCostPerResto,
    setVariableCostPerResto,
    expenseList,
    addExpense,
    deleteExpense,
    getFinancialSummary,
  } = useFinancialStore();

  const summary = getFinancialSummary();

  const [showAddModal, setShowAddModal] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseType, setExpenseType] = useState<'FIXED' | 'VARIABLE'>('FIXED');

  const handleAddExpense = async () => {
    if (!expenseName.trim()) {
      Alert.alert('Perhatian', 'Nama pengeluaran harus diisi.');
      return;
    }
    if (expenseAmount <= 0) {
      Alert.alert('Perhatian', 'Nominal pengeluaran harus lebih dari Rp0.');
      return;
    }

    await addExpense({
      expense_name: expenseName.trim(),
      category_id: 1,
      amount: expenseAmount,
      expense_type: expenseType,
      frequency: 'MONTHLY',
    });

    setExpenseName('');
    setExpenseAmount(0);
    setShowAddModal(false);
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
          <Text style={styles.screenTitle}>Biaya Operasional</Text>
          <Text style={styles.screenSubtitle}>Catat biaya rutin kantor & biaya tambahan per restoran</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ringkasan Total Biaya Operasional */}
        <ResultCard
          title="TOTAL PENGELUARAN TIAP BULAN"
          value={formatIDR(summary.totalExpenses)}
          variant="coral"
          subtitle={`Biaya Rutin: ${formatIDR(summary.profitLoss.operatingExpenses)} • Variabel: ${formatIDR(summary.totalVariableCosts)}`}
          badgeText="Beban Bulanan"
          style={styles.summaryCard}
        />

        {/* Setting Biaya Utama */}
        <Card variant="default" style={styles.mainInputsCard}>
          <Text style={styles.cardHeaderTitle}>Biaya Rutin Kantor & Server</Text>
          <Text style={styles.cardHeaderSubtitle}>
            Isi biaya tetap bulanan atau rincikan satu-satu di daftar bawah
          </Text>

          <NumericInput
            label="Biaya Tetap Bulanan (Sewa Server, Kantor, Gaji Tim)"
            value={fixedCosts}
            onChangeValue={setFixedCosts}
            placeholder="0"
          />

          <View style={{ height: 12 }} />

          <NumericInput
            label="Biaya Tambahan per Resto (WhatsApp API, Kertas, CS)"
            value={variableCostPerResto}
            onChangeValue={setVariableCostPerResto}
            placeholder="0"
          />

          <View style={styles.calcInsightBox}>
            <Text style={styles.calcInsightText}>
              Hitungan biaya tambahan: {summary.totalActiveRestaurants} resto × {formatIDR(variableCostPerResto)} = {formatIDR(summary.totalVariableCosts)}/bln
            </Text>
          </View>
        </Card>

        {/* Section Header Rincian */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Rincian Pengeluaran</Text>
          <TouchableOpacity
            style={styles.addToggleBtn}
            onPress={() => setShowAddModal(!showAddModal)}
          >
            <Plus size={16} color="#171717" />
            <Text style={styles.addToggleText}>
              {showAddModal ? 'Tutup' : 'Tambah Biaya'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Tambah Item Biaya */}
        {showAddModal && (
          <Card variant="lime" style={styles.addCard}>
            <Text style={styles.addCardTitle}>Tambah Item Pengeluaran Baru</Text>

            {/* Type Switcher */}
            <View style={styles.typeSwitcherRow}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  expenseType === 'FIXED' && styles.typeBtnActive,
                ]}
                onPress={() => setExpenseType('FIXED')}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    expenseType === 'FIXED' && styles.typeBtnTextActive,
                  ]}
                >
                  Biaya Tetap (Fixed)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  expenseType === 'VARIABLE' && styles.typeBtnActive,
                ]}
                onPress={() => setExpenseType('VARIABLE')}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    expenseType === 'VARIABLE' && styles.typeBtnTextActive,
                  ]}
                >
                  Biaya Variabel
                </Text>
              </TouchableOpacity>
            </View>

            <NumericInput
              label="Nominal Biaya (IDR)"
              value={expenseAmount}
              onChangeValue={setExpenseAmount}
              placeholder="Contoh: 1500000"
            />

            <Button
              title="Simpan Pengeluaran"
              variant="primary"
              size="sm"
              onPress={handleAddExpense}
              style={{ marginTop: 10 }}
            />
          </Card>
        )}

        {/* List Pengeluaran */}
        {expenseList.length === 0 ? (
          <Card variant="default" style={styles.emptyCard}>
            <Layers size={28} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Belum ada rincian item pengeluaran</Text>
            <Text style={styles.emptyDesc}>
              Gunakan form di atas untuk mencatat rincian per pos biaya secara detail.
            </Text>
          </Card>
        ) : (
          expenseList.map((item) => (
            <Card key={item.id} variant="default" style={styles.expenseItemCard}>
              <View style={styles.expenseItemRow}>
                <View style={styles.expenseItemLeft}>
                  <Text style={styles.expenseItemName}>{item.expense_name}</Text>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          item.expense_type === 'FIXED' ? '#8B5CF6' : '#FBBF24',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        {
                          color:
                            item.expense_type === 'FIXED' ? '#FFFFFF' : '#171717',
                        },
                      ]}
                    >
                      {item.expense_type === 'FIXED' ? 'Biaya Tetap' : 'Biaya Variabel'}
                    </Text>
                  </View>
                </View>

                <View style={styles.expenseItemRight}>
                  <Text style={styles.expenseItemAmount}>
                    {formatIDR(item.amount)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => item.id && deleteExpense(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={16} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))
        )}

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
  mainInputsCard: {
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
    marginBottom: 4,
  },
  cardHeaderSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  calcInsightBox: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  calcInsightText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: '#334155',
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
  addCard: {
    marginBottom: 16,
  },
  addCardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
    marginBottom: 10,
  },
  typeSwitcherRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#171717',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#171717',
  },
  typeBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#171717',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
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
  },
  expenseItemCard: {
    marginBottom: 10,
  },
  expenseItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseItemLeft: {
    flex: 1,
  },
  expenseItemName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#171717',
  },
  typeBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
  },
  expenseItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseItemAmount: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#171717',
    marginRight: 8,
  },
  deleteBtn: {
    padding: 6,
  },
  doneBtn: {
    marginTop: 10,
  },
});
