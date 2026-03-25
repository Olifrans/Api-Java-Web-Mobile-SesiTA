import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nome?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || 'usuario@email.com'}</Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{user?.nome || '---'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>E-mail:</Text>
          <Text style={styles.infoValue}>{user?.email || '---'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{user?.role || 'Administrador'}</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o App</Text>
        <Text style={styles.aboutText}>
          Sistema Escolar Admin - Versão 1.0.0
        </Text>
        <Text style={styles.aboutText}>
          Aplicativo para gerenciamento de alunos, professores e turmas.
        </Text>
      </Card>

      <Button
        title="Sair da Conta"
        variant="danger"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  aboutText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
});