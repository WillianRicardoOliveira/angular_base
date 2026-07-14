import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppImage } from './app-image';

describe('AppImage', () => {
  let component: AppImage;
  let fixture: ComponentFixture<AppImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});