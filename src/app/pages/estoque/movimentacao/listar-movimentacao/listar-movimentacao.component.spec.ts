import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMovimentacaoComponent } from './listar-movimentacao.component';

describe('ListarMovimentacaoComponent', () => {
  let component: ListarMovimentacaoComponent;
  let fixture: ComponentFixture<ListarMovimentacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarMovimentacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarMovimentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
