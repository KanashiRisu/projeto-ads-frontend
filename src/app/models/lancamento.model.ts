import { Categoria } from './categoria.model';
import { Usuario } from './usuario.model'; 

export interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  dataLancamento: Date;
  observacao?: string;
  categoria: Categoria;
  usuario: Usuario;
}

export interface LancamentoInput {
  descricao: string;
  valor: number;
  dataLancamento: string;
  observacao?: string;
  categoria: { id: number }; 
  usuario: { id: number };
}