import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PaginaEmBreve } from './pagina-em-breve';

describe('PaginaEmBreve', () => {
  let component: PaginaEmBreve;
  let fixture: ComponentFixture<PaginaEmBreve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEmBreve],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEmBreve);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
