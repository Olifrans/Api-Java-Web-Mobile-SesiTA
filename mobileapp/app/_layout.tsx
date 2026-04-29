import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: 'white', headerTitleStyle: { fontWeight: '600' } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="aluno/form" options={{ title: 'Novo Aluno', presentation: 'modal' }} />
        <Stack.Screen name="aluno/[id]" options={{ title: 'Detalhes' }} />
      </Stack>
    </>
  );
}