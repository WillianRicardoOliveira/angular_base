import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraItemComponent } from './compra-item.component';

describe('CompraItemComponent', () => {
  let component: CompraItemComponent;
  let fixture: ComponentFixture<CompraItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
