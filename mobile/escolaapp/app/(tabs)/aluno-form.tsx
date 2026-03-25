import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { alunos } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

export default function AlunoFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadAluno();
    }
  }, [id]);

  const loadAluno = async () => {
    setLoading(true);
    try {
      const response = await alunos.getById(Number(id));
      setFormData({
        nome: response.data.nome,
        email: response.data.email,
        telefone: response.data.telefone,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do aluno');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await alunos.update(Number(id), formData);
        Alert.alert('Sucesso', 'Aluno atualizado com sucesso!');
      } else {
        await alunos.create(formData);
        Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o aluno');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o aluno ${formData.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await alunos.delete(Number(id));
              Alert.alert('Sucesso', 'Aluno excluído com sucesso!');
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o aluno');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Loading visible={loading} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
          </Text>

          <Input
            label="Nome completo"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            placeholder="Digite o nome completo"
            error={errors.nome}
          />

          <Input
            label="E-mail"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="exemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Telefone"
            value={formData.telefone}
            onChangeText={(text) => setFormData({ ...formData, telefone: text })}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={() => router.back()}
              style={styles.button}
            />
            <Button
              title="Salvar"
              onPress={handleSave}
              style={styles.button}
            />
          </View>

          {isEditing && (
            <Button
              title="Excluir Aluno"
              variant="danger"
              onPress={handleDelete}
              style={styles.deleteButton}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 12,
  },
  button: {
    flex: 1,
  },
  deleteButton: {
    marginTop: 12,
  },
});