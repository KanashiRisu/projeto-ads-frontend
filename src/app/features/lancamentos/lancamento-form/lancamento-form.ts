import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { LancamentoService } from '../../../core/services/lancamento.service';
import { LancamentoRequest, LancamentoResponse } from '../../../models/lancamento.model';
 
@Component({
  selector: 'app-lancamento-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './lancamento-form.html'
})
export class LancamentoForm {
  usuarioId = input.required<number>();
  lancamento = input<LancamentoResponse | null>(null);
  salvou = output<void>();
  cancelou = output<void>();
  categorias = signal<Categoria[]>([]);
  erro = signal('');
  salvando = signal(false);
 
  formulario = new FormGroup({
    descricao: new FormControl('', {nonNullable:true,
      validators:[Validators.required, Validators.minLength(3), Validators.maxLength(200)]}),
    valor: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    dataLancamento: new FormControl('', {nonNullable:true, validators:[Validators.required]}),
    observacao: new FormControl(''),
    categoriaId: new FormControl<number | null>(null, [Validators.required])
  });
 
  constructor(private categoriasService: CategoriaService,
              private lancamentosService: LancamentoService) {
    effect(() => {
      this.carregarCategorias(this.lancamento());
    });
  }
 
  private carregarCategorias(lancamentoHistorico: LancamentoResponse | null): void {
    this.categoriasService.listar().subscribe({
      next: dados => {
        let categoriasVisiveis = dados.filter(c => c.ativa);
 
        // Em edição, mantém a categoria histórica mesmo que tenha sido inativada.
        if (lancamentoHistorico) {
          const categoriaHistorica = dados.find(c => c.id === lancamentoHistorico.categoriaId);
          if (categoriaHistorica && !categoriaHistorica.ativa) {
            categoriasVisiveis = [...categoriasVisiveis, categoriaHistorica];
          }
 
          this.formulario.patchValue({
            descricao: lancamentoHistorico.descricao,
            valor: lancamentoHistorico.valor,
            dataLancamento: lancamentoHistorico.dataLancamento,
            observacao: lancamentoHistorico.observacao,
            categoriaId: lancamentoHistorico.categoriaId
          });
        } else {
          this.formulario.reset();
        }
 
        this.categorias.set(categoriasVisiveis);
      },
      error: err => this.erro.set(this.formatarErroCategoria(err))
    });
  }
 
  cancelar(): void {
    if (this.salvando()) return;
    this.formulario.reset();
    this.erro.set('');
    this.cancelou.emit();
  }
 
  salvar(): void {
    if (this.salvando()) return;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.erro.set('Preencha corretamente os campos antes de salvar.');
      return;
    }
 
    const v = this.formulario.getRawValue();
    const dados: LancamentoRequest = {
      descricao: v.descricao.trim(),
      valor: v.valor!,
      dataLancamento: v.dataLancamento,
      observacao: v.observacao || null,
      categoriaId: v.categoriaId!
    };
 
    const lancamento = this.lancamento();
    this.salvando.set(true);
    this.erro.set('');
 
    const operacao = lancamento
      ? this.lancamentosService.atualizar(this.usuarioId(), lancamento.id, dados)
      : this.lancamentosService.cadastrar(this.usuarioId(), dados);
 
    operacao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.formulario.reset();
        this.salvou.emit();
      },
      error: err => {
        this.salvando.set(false);
        this.erro.set(this.formatarErroLancamento(err));
      }
    });
  }
 
  private formatarErroCategoria(err: any): string {
    if (err.status === 0) return 'Servidor indisponível. Verifique se a API está ligada.';
    return 'Falha ao carregar categorias.';
  }
 
  private formatarErroLancamento(err: any): string {
    if (err.status === 400) return 'Dados inválidos. Verifique valor, categoria e campos obrigatórios.';
    if (err.status === 404) return 'Categoria ou lançamento não encontrado.';
    if (err.status === 0) return 'Servidor indisponível. Verifique se a API está ligada.';
    return err.error?.erro || 'Não foi possível salvar o lançamento.';
  }
}
