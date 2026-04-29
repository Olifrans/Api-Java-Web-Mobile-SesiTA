import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { alunoAPI, formatApiError } from '../../services/api';
import { Aluno } from '../../types/aluno';

export default function FormScreen() {
  const params = useLocalSearchParams<{ aluno?: string; mode?: string }>();
  const initialAluno = params.aluno ? JSON.parse(params.aluno) : null;
  const isEdit = params.mode === 'edit';

  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAluno) setForm({ nome: initialAluno.nome || '', email: initialAluno.email || '', telefone: initialAluno.telefone || '' });
  }, [initialAluno]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório';
    if (!form.email.trim()) e.email = 'Email obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.telefone.trim()) e.telefone = 'Telefone obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit && initialAluno?.id) {
        await alunoAPI.atualizar(initialAluno.id, form);
        Alert.alert('✅ Sucesso', 'Aluno atualizado!', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        await alunoAPI.criar(form);
        Alert.alert('✅ Sucesso', 'Aluno cadastrado!', [{ text: 'OK', onPress: () => router.back() }]);
      }
    } catch (err) {
      Alert.alert('❌ Erro', formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, field, placeholder, keyboardType = 'default' }: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label} *</Text>
      <TextInput style={[styles.input, errors[field] && styles.inputErr]} placeholder={placeholder} placeholderTextColor="#94a3b8" value={form[field]} onChangeText={(t) => { setForm(p => ({ ...p, [field]: t })); if (errors[field]) setErrors(p => ({ ...p, [field]: '' })); }} keyboardType={keyboardType} autoCapitalize={field === 'email' ? 'none' : 'words'} />
      {errors[field] && <Text style={styles.errText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <InputField label="Nome completo" field="nome" placeholder="Digite o nome" />
        <InputField label="E-mail" field="email" placeholder="exemplo@email.com" keyboardType="email-address" />
        <InputField label="Telefone" field="telefone" placeholder="(11) 99999-9999" keyboardType="phone-pad" />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => router.back()} disabled={loading}><Text style={styles.btnCancelText}>Cancelar</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSave, loading && styles.btnDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnSaveText}>{isEdit ? 'Atualizar' : 'Cadastrar'}</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: '#475569' },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1e293b' },
  inputErr: { borderColor: '#ef4444' },
  errText: { fontSize: 12, color: '#ef4444', marginTop: 2 },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#e2e8f0' },
  btnCancelText: { color: '#475569', fontWeight: '600' },
  btnSave: { backgroundColor: '#3b82f6' },
  btnSaveText: { color: 'white', fontWeight: '600' },
  btnDisabled: { opacity: 0.6 },
});