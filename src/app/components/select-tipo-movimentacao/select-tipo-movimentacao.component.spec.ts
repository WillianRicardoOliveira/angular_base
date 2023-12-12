import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTipoMovimentacaoComponent } from './select-tipo-movimentacao.component';

describe('SelectTipoMovimentacaoComponent', () => {
  let component: SelectTipoMovimentacaoComponent;
  let fixture: ComponentFixture<SelectTipoMovimentacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTipoMovimentacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTipoMovimentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
