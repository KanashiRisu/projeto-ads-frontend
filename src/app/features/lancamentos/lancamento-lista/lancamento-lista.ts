import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LancamentoService } from '../../../core/services/lancamento.service';
import { LancamentoResponse } from '../../../models/lancamento.model';
import { LancamentoForm } from '../lancamento-form/lancamento-form';
 
@Component({
  selector: 'app-lancamento-lista',
  imports: [CurrencyPipe, DatePipe, LancamentoForm],
  templateUrl: './lancamento-lista.html'
})
export class LancamentoLista implements OnInit {
  lancamentos = signal<LancamentoResponse[]>([]);
  lancamentoSelecionado = signal<LancamentoResponse | null>(null);
  carregando = signal(false);
  erro = signal('');
 
  constructor(private lancamentoService: LancamentoService) {}
  ngOnInit(): void { this.carregar(); }
 
  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.lancamentoService.listar().subscribe({
      next: dados => {
        this.lancamentos.set(dados);
        this.lancamentoSelecionado.set(null);
        this.carregando.set(false);
      },
      error: err => {
        if (err.status === 401) {
          this.erro.set('Sessão expirada ou usuário não autenticado. Entre novamente.');
        } else if (err.status === 403) {
          this.erro.set('Você não tem permissão para acessar os lançamentos.');
        } else if (err.status === 0) {
          this.erro.set('Servidor indisponível. Verifique se a API está ligada.');
        } else {
          this.erro.set('Não foi possível carregar os lançamentos.');
        }
        this.carregando.set(false);
        console.error(err);
      }
    });
  }
 
  editar(lancamento: LancamentoResponse): void {
    this.lancamentoSelecionado.set(lancamento);
  }
 
  cancelarEdicao(): void {
    this.lancamentoSelecionado.set(null);
  }
}
