import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { alunoAPI, formatApiError } from '../../services/api';
import { Aluno } from '../../types/aluno';

export default function DetailsScreen() {
  const params = useLocalSearchParams<{ id: string; aluno?: string }>();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const cached = params.aluno ? JSON.parse(params.aluno) : null;
        const idNum = parseInt(params.id, 10);
        if (cached?.id === idNum) { setAluno(cached); setLoading(false); return; }
        const data = await alunoAPI.buscar(idNum);
        if (!data) throw new Error('Aluno não encontrado');
        setAluno(data);
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, params.aluno]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3b82f6" /></View>;
  if (error || !aluno) return <View style={styles.center}><Ionicons name="alert-circle" size={48} color="#ef4444" /><Text style={styles.errText}>{error || 'Não encontrado'}</Text><TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}><Text style={styles.retryText}>← Voltar</Text></TouchableOpacity></View>;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}><Text style={styles.avatarTxt}>{aluno.nome?.charAt(0).toUpperCase()}</Text></View>
        <Text style={styles.name}>{aluno.nome}</Text>
        {aluno.id && <Text style={styles.badge}>ID: {aluno.id}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📧 Contato</Text>
        <TouchableOpacity style={styles.row} onPress={() => aluno.email && Linking.openURL(`mailto:${aluno.email}`)}>
          <Ionicons name="mail-outline" size={22} color="#64748b" />
          <View style={styles.rowInfo}><Text style={styles.rowLabel}>E-mail</Text><Text style={styles.rowVal}>{aluno.email}</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => aluno.telefone && Linking.openURL(`tel:${aluno.telefone.replace(/\D/g, '')}`)}>
          <Ionicons name="phone-portrait-outline" size={22} color="#64748b" />
          <View style={styles.rowInfo}><Text style={styles.rowLabel}>Telefone</Text><Text style={styles.rowVal}>{aluno.telefone}</Text></View>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actBtn, styles.actEdit]} onPress={() => router.push({ pathname: '/aluno/form', params: { aluno: JSON.stringify(aluno), mode: 'edit' } })}><Ionicons name="create-outline" size={18} color="white" /><Text style={styles.actTxt}>Editar</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.actBtn, styles.actBack]} onPress={() => router.back()}><Ionicons name="arrow-back" size={18} color="#475569" /><Text style={[styles.actTxt, { color: '#475569' }]}>Voltar</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, backgroundColor: '#f8fafc', flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#f8fafc' },
  errText: { marginTop: 16, fontSize: 15, color: '#ef4444', textAlign: 'center' },
  retryBtn: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#e2e8f0', borderRadius: 8 },
  retryText: { color: '#475569', fontWeight: '600' },
  avatarWrap: { alignItems: 'center', marginBottom: 24, paddingTop: 20 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarTxt: { fontSize: 36, fontWeight: '700', color: '#2563eb' },
  name: { fontSize: 22, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
  badge: { marginTop: 8, fontSize: 12, color: '#94a3b8', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowInfo: { flex: 1, marginLeft: 12 },
  rowLabel: { fontSize: 12, color: '#94a3b8' },
  rowVal: { fontSize: 15, color: '#1e293b', fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12 },
  actBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 10 },
  actEdit: { backgroundColor: '#3b82f6' },
  actBack: { backgroundColor: '#f1f5f9' },
  actTxt: { fontWeight: '600', fontSize: 14 },
});