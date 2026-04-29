import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb', tabBarInactiveTintColor: '#94a3b8', headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: 'white' }}>
      <Tabs.Screen name="index" options={{ title: 'Alunos', headerTitle: '🎓 Escola Admin', tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} /> }} />
    </Tabs>
  );
}