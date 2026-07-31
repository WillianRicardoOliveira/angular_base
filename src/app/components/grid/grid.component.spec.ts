import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import {
    MatPaginatorIntl
} from '@angular/material/paginator';

import {
    GridComponent
} from './grid.component';

describe('GridComponent', () => {
    let component: GridComponent;

    let fixture:
        ComponentFixture<GridComponent>;

    beforeEach(async () => {
        await TestBed
            .configureTestingModule({
                declarations: [
                    GridComponent
                ],
                providers: [
                    MatPaginatorIntl
                ]
            })
            .overrideComponent(
                GridComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                GridComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve exibir a ação adicionar por padrão', () => {
        expect(
            component.b_adicionar
        ).toBeTrue();
    });

    it('deve permitir ocultar a ação adicionar', () => {
        component.b_adicionar = false;

        expect(
            component.b_adicionar
        ).toBeFalse();
    });

    it('deve emitir o evento de adicionar', () => {
        const adicionarSpy =
            jasmine.createSpy(
                'adicionar'
            );

        component.adicionar.subscribe(
            adicionarSpy
        );

        component.botaoAdicionar();

        expect(
            adicionarSpy
        ).toHaveBeenCalledTimes(1);
    });
});