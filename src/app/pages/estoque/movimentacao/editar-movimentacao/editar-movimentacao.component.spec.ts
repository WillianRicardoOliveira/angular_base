import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMovimentacaoComponent } from './editar-movimentacao.component';

describe('EditarMovimentacaoComponent', () => {
  let component: EditarMovimentacaoComponent;
  let fixture: ComponentFixture<EditarMovimentacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarMovimentacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMovimentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
