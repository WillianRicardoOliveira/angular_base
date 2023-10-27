import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabecalhoPaginaComponent } from './cabecalho-pagina.component';

describe('CabecalhoPaginaComponent', () => {
  let component: CabecalhoPaginaComponent;
  let fixture: ComponentFixture<CabecalhoPaginaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabecalhoPaginaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabecalhoPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
