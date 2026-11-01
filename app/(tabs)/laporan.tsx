import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2, CheckCircle2, FileText, Download, Printer, ShieldCheck } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatIDR } from '../../engine/math';
import { useFinancialStore } from '../../store/useFinancialStore';

export default function LaporanScreen() {
  const { getFinancialSummary, packages, capitalInvestments } = useFinancialStore();
  const summary = getFinancialSummary();

  const [isExporting, setIsExporting] = useState(false);

  const mrr = summary.mrr;
  const arr = summary.arr;
  const totalExpenses = summary.totalExpenses;
  const netProfit = summary.profitLoss.netProfit;
  const netMargin = summary.profitLoss.netProfitMargin;
  const activeResto = summary.totalActiveRestaurants;
  const totalCapex = summary.totalCapitalInvestment;
  const paybackPeriod = summary.roi.paybackPeriodMonths;

  // Generate Neubrutalist HTML Document for PDF
  const generatePdfHtml = () => {
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const packageRows = packages
      .map(
        (p) => `
        <tr>
          <td style="padding: 8px; border: 1.5px solid #171717;">${p.name}</td>
          <td style="padding: 8px; border: 1.5px solid #171717; text-align: center;">${p.restaurantCount} Resto</td>
          <td style="padding: 8px; border: 1.5px solid #171717; text-align: right;">${formatIDR(p.monthlyPrice)}</td>
          <td style="padding: 8px; border: 1.5px solid #171717; text-align: right; font-weight: bold;">${formatIDR(p.restaurantCount * p.monthlyPrice)}</td>
        </tr>`
      )
      .join('');

    const capexRows =
      capitalInvestments.length > 0
        ? capitalInvestments
            .map(
              (c) => `
        <tr>
          <td style="padding: 8px; border: 1.5px solid #171717;">${c.item_name}</td>
          <td style="padding: 8px; border: 1.5px solid #171717; text-align: center;">${c.category}</td>
          <td style="padding: 8px; border: 1.5px solid #171717; text-align: right; font-weight: bold;">${formatIDR(c.amount)}</td>
        </tr>`
            )
            .join('')
        : `<tr><td colspan="3" style="padding: 8px; border: 1.5px solid #171717; text-align: center; color: #64748B;">Belum ada rincian modal awal</td></tr>`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #171717;
              padding: 24px;
              background-color: #FAFAFA;
            }
            .header-box {
              border: 3px solid #171717;
              box-shadow: 5px 5px 0px #171717;
              background-color: #8B5CF6;
              color: #FFFFFF;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 24px;
            }
            .header-title {
              font-size: 24px;
              font-weight: 900;
              margin: 0;
            }
            .header-sub {
              font-size: 13px;
              color: #E9D5FF;
              margin-top: 4px;
            }
            .card {
              border: 2px solid #171717;
              box-shadow: 4px 4px 0px #171717;
              background-color: #FFFFFF;
              border-radius: 10px;
              padding: 16px;
              margin-bottom: 20px;
            }
            .card-title {
              font-size: 16px;
              font-weight: 800;
              margin-bottom: 12px;
              border-bottom: 2px solid #171717;
              padding-bottom: 6px;
            }
            .metric-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            .metric-table th {
              background-color: #C6F66A;
              border: 1.5px solid #171717;
              padding: 8px;
              font-size: 12px;
              text-align: left;
            }
            .highlight-val {
              font-size: 20px;
              font-weight: 900;
              color: #171717;
            }
            .status-pill {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 6px;
              border: 1.5px solid #171717;
              font-weight: 800;
              font-size: 12px;
              background-color: ${netProfit >= 0 ? '#C6F66A' : '#FF6B6B'};
              color: #171717;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              color: #64748B;
              margin-top: 30px;
              border-top: 1px dashed #CBD5E1;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h1 class="header-title">ORDEXA BUSINESS CALCULATOR</h1>
            <div class="header-sub">Laporan Finansial Resmi & Ringkasan Performa Usaha • ${dateStr}</div>
          </div>

          <div class="card">
            <div class="card-title">1. RINGKASAN KESEHATAN FINANSIAL</div>
            <table style="width: 100%;">
              <tr>
                <td style="width: 50%;">
                  <div>Status Operasional:</div>
                  <div class="status-pill">${summary.profitLoss.status} (${netMargin === 'N/A' ? '0' : netMargin}% Net Margin)</div>
                </td>
                <td style="width: 50%;">
                  <div>Estimasi Balik Modal (Payback Period):</div>
                  <div style="font-weight: bold; font-size: 15px;">
                    ${typeof paybackPeriod === 'number' && paybackPeriod > 0 ? `${paybackPeriod} Bulan` : 'N/A'}
                  </div>
                </td>
              </tr>
            </table>

            <table class="metric-table" style="margin-top: 16px;">
              <tr>
                <th style="background-color: #8B5CF6; color: #FFF;">Omzet Bulanan (MRR)</th>
                <th style="background-color: #FF6B6B; color: #FFF;">Total Biaya Bulanan</th>
                <th style="background-color: #C6F66A; color: #171717;">Laba Bersih Bulanan</th>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1.5px solid #171717; font-weight: bold;">${formatIDR(mrr)}</td>
                <td style="padding: 10px; border: 1.5px solid #171717; font-weight: bold;">${formatIDR(totalExpenses)}</td>
                <td style="padding: 10px; border: 1.5px solid #171717; font-weight: bold; color: ${netProfit >= 0 ? '#15803D' : '#DC2626'};">${formatIDR(netProfit)}</td>
              </tr>
            </table>
          </div>

          <div class="card">
            <div class="card-title">2. KONTRIBUSI PAKET LANGGANAN</div>
            <table class="metric-table">
              <tr>
                <th>Paket</th>
                <th style="text-align: center;">Jumlah Mitra</th>
                <th style="text-align: right;">Harga Satuan</th>
                <th style="text-align: right;">Subtotal MRR</th>
              </tr>
              ${packageRows}
            </table>
          </div>

          <div class="card">
            <div class="card-title">3. INVESTASI MODAL AWAL (CAPEX)</div>
            <table class="metric-table">
              <tr>
                <th>Nama Modal / Peralatan</th>
                <th style="text-align: center;">Kategori</th>
                <th style="text-align: right;">Nominal Investasi</th>
              </tr>
              ${capexRows}
              <tr>
                <td colspan="2" style="padding: 8px; border: 1.5px solid #171717; font-weight: bold;">TOTAL INVESTASI AWAL</td>
                <td style="padding: 8px; border: 1.5px solid #171717; text-align: right; font-weight: 900; background-color: #E2E8F0;">${formatIDR(totalCapex)}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            Dokumen ini di-generate secara otomatis oleh Sistem Ordexa Calculator (Offline First Storage).
          </div>
        </body>
      </html>
    `;
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      const html = generatePdfHtml();
      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'Bagikan Laporan Finansial ORDEXA (PDF)',
        });
      } else {
        await Print.printAsync({ html });
      }
    } catch (err: any) {
      Alert.alert('Gagal Ekspor PDF', err.message || 'Terjadi kesalahan saat membuat PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const csvContent = [
        'Kategori,Item,Nilai,Satuan',
        `MRR,Omzet Bulanan,${mrr},IDR`,
        `ARR,Estimasi Tahunan,${arr},IDR`,
        `Biaya,Beban Operasional Tetap,${summary.profitLoss.operatingExpenses},IDR`,
        `Biaya,Biaya Variabel,${summary.totalVariableCosts},IDR`,
        `Biaya,Total Beban Pengeluaran,${totalExpenses},IDR`,
        `Profit,Laba Bersih Bulanan,${netProfit},IDR`,
        `Mitra,Total Mitra Resto,${activeResto},Unit`,
        `Capex,Total Modal Awal,${totalCapex},IDR`,
        ...packages.map((p) => `Paket,${p.name},${p.restaurantCount * p.monthlyPrice},IDR`),
        ...capitalInvestments.map((c) => `Modal Awal,${c.item_name},${c.amount},IDR`),
      ].join('\n');

      const htmlDummy = `<html><body><pre>${csvContent}</pre></body></html>`;
      const { uri } = await Print.printToFileAsync({ html: htmlDummy });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Bagikan Laporan Finansial ORDEXA (CSV)',
        });
      } else {
        Alert.alert('Data CSV', csvContent);
      }
    } catch (err: any) {
      Alert.alert('Gagal Ekspor CSV', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsExporting(false);
    }
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
          <View>
            <Text style={styles.title}>Laporan Keuangan</Text>
            <Text style={styles.subtitle}>
              Ekspor Resmi PDF & CSV Siap Cetak (Phase 6)
            </Text>
          </View>
          <View style={styles.badge}>
            <ShieldCheck size={16} color="#171717" />
            <Text style={styles.badgeText}>Live Verified</Text>
          </View>
        </View>

        {/* Status Kesehatan Bisnis */}
        <Card variant={netProfit >= 0 ? 'lime' : 'coral'} style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <CheckCircle2 size={24} color="#171717" />
            <View style={styles.healthHeaderTitleBox}>
              <Text style={styles.healthStatusTitle}>
                {netProfit >= 0
                  ? `Bisnis Menguntungkan (Net Profit ${formatIDR(netProfit)})`
                  : `Bisnis Defisit (Minus ${formatIDR(Math.abs(netProfit))})`}
              </Text>
              <Text style={styles.healthStatusSubtitle}>
                {mrr > 0
                  ? `Omzet ${formatIDR(mrr)}/bln dengan margin ${netMargin === 'N/A' ? '0' : netMargin}%`
                  : 'Belum ada data omzet yang dimasukkan'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Tombol Ekspor PDF & CSV */}
        <View style={styles.exportActionRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.exportBtn, { backgroundColor: '#8B5CF6' }]}
            onPress={handleExportPdf}
            disabled={isExporting}
          >
            <Printer size={20} color="#FFFFFF" />
            <Text style={styles.exportBtnText}>Cetak / Ekspor PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.exportBtn, { backgroundColor: '#C6F66A' }]}
            onPress={handleExportCsv}
            disabled={isExporting}
          >
            <Download size={20} color="#171717" />
            <Text style={[styles.exportBtnText, { color: '#171717' }]}>Ekspor CSV Data</Text>
          </TouchableOpacity>
        </View>

        {/* Rangkuman Data Finansial */}
        <Card variant="default" style={styles.dataCard}>
          <Text style={styles.cardTitle}>Ringkasan Angka Laporan</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Omzet Bulanan (MRR):</Text>
            <Text style={styles.val}>{formatIDR(mrr)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estimasi Omzet Tahunan (ARR):</Text>
            <Text style={styles.val}>{formatIDR(arr)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Biaya Operasional:</Text>
            <Text style={[styles.val, { color: '#FF6B6B' }]}>
              {formatIDR(totalExpenses)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Laba Bersih Bulanan:</Text>
            <Text
              style={[
                styles.val,
                styles.bold,
                { color: netProfit >= 0 ? '#15803D' : '#DC2626' },
              ]}
            >
              {formatIDR(netProfit)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Total Investasi Modal Awal:</Text>
            <Text style={styles.val}>{formatIDR(totalCapex)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estimasi Waktu Balik Modal:</Text>
            <Text style={[styles.val, styles.bold]}>
              {typeof paybackPeriod === 'number' && paybackPeriod > 0
                ? `${paybackPeriod} Bulan`
                : 'Belum Profit'}
            </Text>
          </View>
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
  healthCard: {
    marginBottom: 16,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthHeaderTitleBox: {
    flex: 1,
  },
  healthStatusTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#171717',
  },
  healthStatusSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  exportActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#171717',
    gap: 8,
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  exportBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  dataCard: {
    marginBottom: 20,
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
    paddingVertical: 5,
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
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },
});
