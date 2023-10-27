import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepoimentoSiteComponent } from './depoimento-site.component';

describe('DepoimentoSiteComponent', () => {
  let component: DepoimentoSiteComponent;
  let fixture: ComponentFixture<DepoimentoSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepoimentoSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepoimentoSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
