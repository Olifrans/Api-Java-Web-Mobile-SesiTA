import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { alunos } from '../../services/api';
import Card from '../../components/Card';
import Loading from '../../components/Loading';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalProfessores: 12,
    totalTurmas: 8,
    taxaAprovacao: 94,
  });
  const [recentAlunos, setRecentAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const response = await alunos.list();
      const totalAlunos = response.data.length;
      const recent = response.data.slice(-5).reverse();

      setStats(prev => ({ ...prev, totalAlunos }));
      setRecentAlunos(recent);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [5, 8, 12, 18, 24, 30],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const pieData = [
    {
      name: '1º Ano',
      population: 45,
      color: '#3b82f6',
      legendFontColor: '#1e293b',
    },
    {
      name: '2º Ano',
      population: 52,
      color: '#10b981',
      legendFontColor: '#1e293b',
    },
    {
      name: '3º Ano',
      population: 48,
      color: '#f59e0b',
      legendFontColor: '#1e293b',
    },
  ];

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Text style={[styles.statIconText, { color }]}>{icon}</Text>
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </Card>
  );

  if (loading && !refreshing) {
    return <Loading visible={true} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Bem-vindo de volta!</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Alunos"
          value={stats.totalAlunos}
          icon="👨‍🎓"
          color="#3b82f6"
        />
        <StatCard
          title="Professores"
          value={stats.totalProfessores}
          icon="👨‍🏫"
          color="#10b981"
        />
        <StatCard
          title="Turmas"
          value={stats.totalTurmas}
          icon="📚"
          color="#f59e0b"
        />
        <StatCard
          title="Aprovação"
          value={`${stats.taxaAprovacao}%`}
          icon="📈"
          color="#ef4444"
        />
      </View>

      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Matrículas por Mês</Text>
        <LineChart
          data={chartData}
          width={width - 64}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Distribuição por Turma</Text>
        <PieChart
          data={pieData}
          width={width - 64}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </Card>

      <Card>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Últimos Alunos</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/alunos')}>
            <Text style={styles.viewAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {recentAlunos.map((aluno: any) => (
          <TouchableOpacity
            key={aluno.id}
            style={styles.recentItem}
            onPress={() => router.push({ pathname: '/(tabs)/aluno-form', params: { id: aluno.id.toString() } })}
          >
            <View style={styles.recentAvatar}>
              <Text style={styles.recentAvatarText}>
                {aluno.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>{aluno.nome}</Text>
              <Text style={styles.recentEmail}>{aluno.email}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconText: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  chartCard: {
    marginHorizontal: 12,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  viewAll: {
    color: '#3b82f6',
    fontSize: 14,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4f46e5',
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  recentEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});