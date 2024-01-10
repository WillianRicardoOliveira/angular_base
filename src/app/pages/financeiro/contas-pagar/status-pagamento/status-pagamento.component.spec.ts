import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPagamentoComponent } from './status-pagamento.component';

describe('StatusPagamentoComponent', () => {
  let component: StatusPagamentoComponent;
  let fixture: ComponentFixture<StatusPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusPagamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
