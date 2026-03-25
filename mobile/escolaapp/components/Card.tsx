import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, onPress, style = {} }) => {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default Card;