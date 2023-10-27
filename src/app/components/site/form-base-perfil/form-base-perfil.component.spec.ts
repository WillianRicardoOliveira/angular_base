import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBasePerfilComponent } from './form-base-perfil.component';

describe('FormBasePerfilComponent', () => {
  let component: FormBasePerfilComponent;
  let fixture: ComponentFixture<FormBasePerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBasePerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBasePerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
