import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { alunos } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

export default function AlunosScreen() {
  const [alunosList, setAlunosList] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadAlunos = async () => {
    try {
      const response = await alunos.list();
      setAlunosList(response.data);
      setFilteredAlunos(response.data);
    } catch (error) {
      console.error('Error loading alunos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os alunos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAlunos();
    }, [])
  );

  useEffect(() => {
    filterAlunos();
  }, [searchText, alunosList]);

  const filterAlunos = () => {
    if (!searchText.trim()) {
      setFilteredAlunos(alunosList);
    } else {
      const filtered = alunosList.filter(
        (aluno: any) =>
          aluno.nome.toLowerCase().includes(searchText.toLowerCase()) ||
          aluno.email.toLowerCase().includes(searchText.toLowerCase()) ||
          aluno.telefone.includes(searchText)
      );
      setFilteredAlunos(filtered);
    }
  };

  const handleDelete = (id: number, nome: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o aluno ${nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await alunos.delete(id);
              loadAlunos();
              Alert.alert('Sucesso', 'Aluno excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o aluno');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAlunos();
  };

  const renderItem = ({ item }: any) => (
    <Card
      onPress={() => router.push({ pathname: '/(tabs)/aluno-form', params: { id: item.id.toString() } })}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.phone}>{item.telefone}</Text>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return <Loading visible={true} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar aluno..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#94a3b8"
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
        <Button
          title="+ Novo Aluno"
          onPress={() => router.push('/(tabs)/aluno-form')}
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={filteredAlunos}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum aluno encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 40,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 10,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4f46e5',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  phone: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
});