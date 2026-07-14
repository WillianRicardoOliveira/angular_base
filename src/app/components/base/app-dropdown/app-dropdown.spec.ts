import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDropdown } from './app-dropdown';

describe('AppDropdown', () => {
  let component: AppDropdown;
  let fixture: ComponentFixture<AppDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppDropdown],
      imports: [CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});