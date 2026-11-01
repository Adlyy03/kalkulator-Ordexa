import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../components/navigation/FloatingTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="kalkulator"
        options={{
          title: 'Kalkulator',
        }}
      />
      <Tabs.Screen
        name="simulasi"
        options={{
          title: 'Simulasi',
        }}
      />
      <Tabs.Screen
        name="laporan"
        options={{
          title: 'Laporan',
        }}
      />
      <Tabs.Screen
        name="pengaturan"
        options={{
          title: 'Pengaturan',
        }}
      />
    </Tabs>
  );
}
