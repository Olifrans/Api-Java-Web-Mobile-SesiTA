import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, Text, FlatList, StyleSheet, RefreshControl, 
  Alert, TouchableOpacity, TextInput, SafeAreaView, 
  KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Imports relativos
import AlunoCard from '../../components/AlunoCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { alunoAPI, formatApiError } from '../../services/api';
import { Aluno } from '../../types/aluno';

export default function HomeScreen() {
  // ============================================================================
  // 1. STATES (Definidos primeiro)
  // ============================================================================
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ============================================================================
  // 2. DATA FETCHING & EFFECTS
  // ============================================================================
  const carregarAlunos = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await alunoAPI.listar();
      setAlunos(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetch = async () => {
        if (isActive) await carregarAlunos();
      };
      fetch();
      return () => { isActive = false; };
    }, [carregarAlunos])
  );

  // ============================================================================
  // 3. COMPUTED VALUES & HANDLERS
  // ============================================================================
  const alunosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return alunos;
    const term = searchTerm.toLowerCase();
    return alunos.filter(a => 
      a.nome?.toLowerCase().includes(term) || 
      a.email?.toLowerCase().includes(term)
    );
  }, [alunos, searchTerm]);

  const handleRefresh = useCallback(() => carregarAlunos(true), [carregarAlunos]);

  const handleDelete = useCallback((aluno: Aluno) => {
    Alert.alert('Excluir', `Tem certeza que deseja excluir ${aluno.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          if (aluno.id) {
            await alunoAPI.deletar(aluno.id);
            setAlunos(prev => prev.filter(a => a.id !== aluno.id));
            Alert.alert('Sucesso', 'Aluno removido.');
          }
        } catch (err) { Alert.alert('Erro', formatApiError(err)); }
      }}
    ]);
  }, []);

  const handleView = useCallback((aluno: Aluno) => {
    if (aluno.id) {
      router.push({ 
        pathname: '/aluno/[id]', 
        params: { id: String(aluno.id), aluno: JSON.stringify(aluno) } 
      });
    }
  }, []);

  const handleEdit = useCallback((aluno: Aluno) => {
    router.push({ 
      pathname: '/aluno/form', 
      params: { aluno: JSON.stringify(aluno), mode: 'edit' } 
    });
  }, []);

  const handleAdd = useCallback(() => {
    router.push('/aluno/form');
  }, []);

  // ============================================================================
  // 4. RENDER HELPERS (Definidos ANTES dos retornos condicionais)
  // ============================================================================
  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput 
          style={styles.input} 
          placeholder="Buscar..." 
          value={searchTerm} 
          onChangeText={setSearchTerm} 
          autoCapitalize="none" 
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Ionicons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.stats}>{alunosFiltrados.length} de {alunos.length} alunos</Text>
    </View>
  ), [searchTerm, alunosFiltrados.length, alunos.length]);

  const renderItem = useCallback(({ item }: { item: Aluno }) => (
    <AlunoCard 
      aluno={item} 
      onPress={() => handleView(item)} 
      onEdit={handleEdit} 
      onDelete={handleDelete} 
    />
  ), [handleView, handleEdit, handleDelete]);

  const renderEmpty = useCallback(() => (
    <View style={styles.empty}>
      <Ionicons name="school-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>Nenhum aluno encontrado</Text>
      {!searchTerm && (
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addBtnText}>Cadastrar Aluno</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [searchTerm, handleAdd]);

  // ============================================================================
  // 5. EARLY RETURNS (Movidos para o final para garantir estabilidade dos Hooks)
  // ============================================================================
  
  if (loading && !refreshing) return <Loading />;
  
  if (error && alunos.length === 0 && !refreshing) {
    return <ErrorMessage message={error} onRetry={carregarAlunos} />;
  }

  // ============================================================================
  // 6. MAIN RENDER
  // ============================================================================
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        
        {/* Header Fixo */}
        {renderHeader()}

        {/* Lista */}
        <FlatList
          data={alunosFiltrados}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3b82f6" />
          }
          contentContainerStyle={styles.list}
        />

        {/* Botão Flutuante */}
        <TouchableOpacity style={styles.fab} onPress={handleAdd}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  keyboard: { flex: 1 },
  header: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  stats: { marginTop: 12, fontSize: 13, color: '#64748b', textAlign: 'right' },
  list: { paddingVertical: 12 },
  empty: { alignItems: 'center', padding: 40 },
  emptyTitle: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#475569' },
  addBtn: { marginTop: 24, flexDirection: 'row', backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: '600', marginLeft: 8 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', elevation: 6 }
});