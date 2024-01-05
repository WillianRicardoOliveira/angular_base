import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriaContaComponent } from './sub-categoria-conta.component';

describe('SubCategoriaContaComponent', () => {
  let component: SubCategoriaContaComponent;
  let fixture: ComponentFixture<SubCategoriaContaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoriaContaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoriaContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
