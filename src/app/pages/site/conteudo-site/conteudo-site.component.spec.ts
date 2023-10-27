import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteudoSiteComponent } from './conteudo-site.component';

describe('ConteudoSiteComponent', () => {
  let component: ConteudoSiteComponent;
  let fixture: ComponentFixture<ConteudoSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConteudoSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConteudoSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
