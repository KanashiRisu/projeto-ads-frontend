import { ComponentFixture, TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LancamentoLista } from './lancamento-lista';

registerLocaleData(localePt);

describe('LancamentoLista', () => {
  let component: LancamentoLista;
  let fixture: ComponentFixture<LancamentoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
