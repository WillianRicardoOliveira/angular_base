import {
    NO_ERRORS_SCHEMA
} from '@angular/core';

import {
    ComponentFixture,
    TestBed,
    waitForAsync
} from '@angular/core/testing';

import {
    Store
} from '@ngrx/store';

import {
    of
} from 'rxjs';

import {
    MenuItem
} from '@/components/menu-item/models/menu-item.model';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    MENU,
    MENU_CONFIGURACOES,
    MenuSidebarComponent
} from './menu-sidebar.component';

describe('MenuSidebarComponent', () => {
    let component:
        MenuSidebarComponent;

    let fixture:
        ComponentFixture<MenuSidebarComponent>;

    const storeMock = {
        select: jasmine
            .createSpy('select')
            .and.returnValue(
                of({
                    sidebarSkin:
                        'sidebar-dark-primary'
                })
            )
    };

    const autorizacaoServiceMock = {
        possuiPermissao: jasmine.createSpy(
            'possuiPermissao'
        )
    };

    beforeEach(
        waitForAsync(() => {
            autorizacaoServiceMock
                .possuiPermissao
                .calls
                .reset();

            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(false);

            TestBed.configureTestingModule({
                declarations: [
                    MenuSidebarComponent
                ],
                providers: [
                    {
                        provide: Store,
                        useValue:
                            storeMock
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoServiceMock
                    }
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture =
            TestBed.createComponent(
                MenuSidebarComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it(
        'deve aplicar o tema do menu lateral',
        () => {
            expect(
                component.classes
            ).toBe(
                'main-sidebar elevation-4 ' +
                'sidebar-dark-primary'
            );
        }
    );

    it(
        'deve preservar itens públicos e remover acessos não autorizados',
        () => {
            expect(
                component.menu.length
            ).toBe(
                MENU.length
            );

            expect(
                component.menuConfiguracoes
            ).toEqual([
                MENU_CONFIGURACOES[0]
            ]);

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PerfilListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PermissaoListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.UsuarioListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(3);
        }
    );

    it(
        'deve exibir Perfis quando possuir a permissão de listar',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .calls
                .reset();

            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PerfilListar
                );

            const resultado =
                component['filtrarMenu'](
                    MENU_CONFIGURACOES
                );

            const grupoAcesso =
                resultado.find(
                    (item) =>
                        item.name ===
                        'Acesso e Segurança'
                );

            const perfil =
                MENU_CONFIGURACOES[1]
                    .children![0];

            expect(
                grupoAcesso?.children
            ).toEqual([
                perfil
            ]);

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PerfilListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PermissaoListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.UsuarioListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(3);
        }
    );

    it(
        'deve exibir Permissões quando possuir a permissão de listar',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .calls
                .reset();

            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PermissaoListar
                );

            const resultado =
                component['filtrarMenu'](
                    MENU_CONFIGURACOES
                );

            const grupoAcesso =
                resultado.find(
                    (item) =>
                        item.name ===
                        'Acesso e Segurança'
                );

            const permissao =
                MENU_CONFIGURACOES[1]
                    .children![1];

            expect(
                grupoAcesso?.children
            ).toEqual([
                permissao
            ]);

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PerfilListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PermissaoListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.UsuarioListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(3);
        }
    );

    it(
        'deve remover item quando usuário não possuir a permissão',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .calls
                .reset();

            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioListar
                );

            const itens: MenuItem[] = [
                {
                    name: 'Usuários',
                    iconClasses:
                        'fas fa-users',
                    path: [
                        '/usuarios'
                    ],
                    permissao:
                        ChavePermissao
                            .UsuarioListar
                },
                {
                    name: 'Perfis',
                    iconClasses:
                        'fas fa-user-tag',
                    path: [
                        '/perfis'
                    ],
                    permissao:
                        ChavePermissao
                            .PerfilListar
                }
            ];

            const resultado =
                component['filtrarMenu'](
                    itens
                );

            expect(
                resultado
            ).toEqual([
                itens[0]
            ]);

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(2);
        }
    );

    it(
        'deve remover grupo quando nenhum submenu estiver autorizado',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .calls
                .reset();

            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(false);

            const itens: MenuItem[] = [
                {
                    name: 'Acesso',
                    iconClasses:
                        'fas fa-shield-alt',
                    children: [
                        {
                            name: 'Usuários',
                            iconClasses:
                                'fas fa-users',
                            path: [
                                '/usuarios'
                            ],
                            permissao:
                                ChavePermissao
                                    .UsuarioListar
                        }
                    ]
                }
            ];

            const resultado =
                component['filtrarMenu'](
                    itens
                );

            expect(
                resultado
            ).toEqual([]);

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledOnceWith(
                ChavePermissao.UsuarioListar
            );
        }
    );
});