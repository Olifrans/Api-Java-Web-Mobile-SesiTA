import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { auth } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await auth.register({
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
      });
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.');
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Loading visible={loading} />
      <View style={styles.content}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

        <Input
          label="Nome completo"
          value={formData.nome}
          onChangeText={(text) => setFormData({ ...formData, nome: text })}
          placeholder="Digite seu nome"
          error={errors.nome}
        />

        <Input
          label="E-mail"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Senha"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="••••••••"
          secureTextEntry
          error={errors.password}
        />

        <Input
          label="Confirmar senha"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          placeholder="••••••••"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <Button title="Cadastrar" onPress={handleRegister} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
});