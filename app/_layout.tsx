import { Stack } from 'expo-router';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import '../global.css';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const content = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="paket-langganan" options={{ presentation: 'card' }} />
      <Stack.Screen name="biaya-operasional" options={{ presentation: 'card' }} />
      <Stack.Screen name="modal-awal" options={{ presentation: 'card' }} />
      <Stack.Screen name="profit-loss" options={{ presentation: 'card' }} />
      <Stack.Screen name="break-even" options={{ presentation: 'card' }} />
      <Stack.Screen name="subscription" options={{ presentation: 'card' }} />
      <Stack.Screen name="payment-gateway" options={{ presentation: 'card' }} />
      <Stack.Screen name="revenue" options={{ presentation: 'card' }} />
    </Stack>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.phoneFrame}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F3EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webWrapper: {
    flex: 1,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 430,
    height: '100%',
    backgroundColor: '#F5F3EE',
    overflow: 'hidden',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#171717',
    position: 'relative',
  },
});
