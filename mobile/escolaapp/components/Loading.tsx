import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

interface LoadingProps {
  visible?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ visible = false }) => {
  if (!visible) return null;
  
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },
});

export default Loading;