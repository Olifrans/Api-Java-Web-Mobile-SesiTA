import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Aluno } from '../types/aluno';

interface Props {
  aluno: Aluno;
  onPress?: () => void;
  onEdit?: (aluno: Aluno) => void;
  onDelete?: (aluno: Aluno) => void;
}

export default function AlunoCard({ aluno, onPress, onEdit, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{aluno.nome?.charAt(0).toUpperCase() || '?'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{aluno.nome}</Text>
        <Text style={styles.email} numberOfLines={1}>{aluno.email}</Text>
        <Text style={styles.phone}>{aluno.telefone}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={(e) => { e.stopPropagation(); onEdit?.(aluno); }}>
          <Ionicons name="create-outline" size={18} color="#f59e0b" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={(e) => { e.stopPropagation(); onDelete?.(aluno); }}>
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: 16, marginHorizontal: 16, marginVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#2563eb' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  email: { fontSize: 13, color: '#64748b' },
  phone: { fontSize: 13, color: '#64748b' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  editBtn: { backgroundColor: '#fef3c7' },
  deleteBtn: { backgroundColor: '#fee2e2' },
});