import {
    CommonModule
} from '@angular/common';

import {
    NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    RouterTestingModule
} from '@angular/router/testing';

import {
    MenuItemComponent
} from './menu-item.component';

describe('MenuItemComponent', () => {
    let component:
        MenuItemComponent;

    let fixture:
        ComponentFixture<MenuItemComponent>;

    beforeEach(async () => {
        await TestBed
            .configureTestingModule({
                declarations: [
                    MenuItemComponent
                ],
                imports: [
                    CommonModule,
                    NoopAnimationsModule,
                    RouterTestingModule
                ]
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture =
            TestBed.createComponent(
                MenuItemComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it(
        'deve separar seleção visual do estado do painel',
        () => {
            component.menuItem = {
                name:
                    'Acesso e Segurança',
                iconClasses:
                    'fas fa-shield-alt',
                children: [
                    {
                        name: 'Usuários',
                        iconClasses:
                            'fas fa-users',
                        path: [
                            '/acesso/usuarios'
                        ]
                    }
                ]
            };

            component.isExpandable = true;
            component.selecionado = true;
            component.painelAberto = false;

            fixture.detectChanges();

            const botao:
                HTMLButtonElement =
                    fixture
                        .nativeElement
                        .querySelector(
                            'button'
                        );

            expect(
                botao.classList.contains(
                    'active'
                )
            ).toBeTrue();

            expect(
                botao.getAttribute(
                    'aria-expanded'
                )
            ).toBe('false');

            component.painelAberto = true;

            fixture.detectChanges();

            expect(
                botao.getAttribute(
                    'aria-expanded'
                )
            ).toBe('true');
        }
    );
});