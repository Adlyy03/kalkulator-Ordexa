import { Modal, View, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { GlassBar } from './GlassBar';
import type { ReactNode } from 'react';

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ModalSheet({ visible, onClose, children }: ModalSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Glass backdrop - tap to close */}
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={styles.backdropOverlay} />
        </Pressable>
        
        {/* Bottom sheet content */}
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(23, 23, 23, 0.5)',
  },
  backdropOverlay: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 2,
    borderColor: '#171717',
    borderBottomWidth: 0,
    paddingTop: 12,
    maxHeight: '80%',
    // Hard shadow upward
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#94A3B8',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
