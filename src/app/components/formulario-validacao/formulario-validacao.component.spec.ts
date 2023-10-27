import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioValidacaoComponent } from './formulario-validacao.component';

describe('FormularioValidacaoComponent', () => {
  let component: FormularioValidacaoComponent;
  let fixture: ComponentFixture<FormularioValidacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioValidacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioValidacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
