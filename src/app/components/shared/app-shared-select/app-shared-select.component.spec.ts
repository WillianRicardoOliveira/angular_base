import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSharedSelectComponent } from './app-shared-select.component';

describe('AppSharedSelectComponent', () => {
  let component: AppSharedSelectComponent;
  let fixture: ComponentFixture<AppSharedSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSharedSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSharedSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
