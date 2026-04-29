// services/api.ts
import axios, { AxiosError } from 'axios';
import { Aluno } from '../types/aluno';

// ✅ Remove barra final da baseURL
const API_BASE_URL = 'http://localhost:8080/alunos';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptors para debug
api.interceptors.request.use((config) => {
  if (__DEV__) {
    console.log(`[📡 API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (!error.response) {
      console.error('[❌ Network] CORS ou API offline:', error.message);
      return Promise.reject(new Error('Servidor indisponível. Verifique se a API está rodando.'));
    }
    
    const status = error.response.status;
    console.error(`[❌ HTTP ${status}]`, error.config?.url);
    
    if (status === 404) return Promise.reject(new Error('Recurso não encontrado'));
    if (status === 500) return Promise.reject(new Error('Erro interno do servidor'));
    
    return Promise.reject(error);
  }
);

export const alunoAPI = {
  async listar(): Promise<Aluno[]> {
    // ✅ Não use barra no início quando baseURL já tem o caminho
    const res = await api.get<Aluno[]>(''); // ← Mude de '/' para ''
    return Array.isArray(res.data) ? res.data : [];
  },
  
  async buscar(id: number): Promise<Aluno | null> {
    try {
      const res = await api.get<Aluno>(`/${id}`);
      return res.data;
    } catch (e) {
      if ((e as AxiosError)?.response?.status === 404) return null;
      throw e;
    }
  },
  
  async criar(aluno: Omit<Aluno, 'id'>): Promise<Aluno> {
    const res = await api.post<Aluno>('', aluno); // ← Mude de '/' para ''
    return res.data;
  },
  
  async atualizar(id: number, aluno: Partial<Aluno>): Promise<Aluno> {
    const res = await api.put<Aluno>(`/${id}`, aluno);
    return res.data;
  },
  
  async deletar(id: number): Promise<void> {
    await api.delete(`/${id}`);
  },
};

export const formatApiError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Ocorreu um erro inesperado.';
};

export default api;