import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerigoComponent } from './perigo.component';

describe('PerigoComponent', () => {
  let component: PerigoComponent;
  let fixture: ComponentFixture<PerigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerigoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
