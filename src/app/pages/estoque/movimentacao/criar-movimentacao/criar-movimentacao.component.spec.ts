import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarMovimentacaoComponent } from './criar-movimentacao.component';

describe('CriarMovimentacaoComponent', () => {
  let component: CriarMovimentacaoComponent;
  let fixture: ComponentFixture<CriarMovimentacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriarMovimentacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarMovimentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
