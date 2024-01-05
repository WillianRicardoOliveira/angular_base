import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaContaComponent } from './categoria-conta.component';

describe('CategoriaContaComponent', () => {
  let component: CategoriaContaComponent;
  let fixture: ComponentFixture<CategoriaContaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaContaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
