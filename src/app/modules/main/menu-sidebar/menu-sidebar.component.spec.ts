import {
    NO_ERRORS_SCHEMA
} from '@angular/core';

import {
    ComponentFixture,
    TestBed,
    waitForAsync
} from '@angular/core/testing';

import {
    Router
} from '@angular/router';

import {
    Store
} from '@ngrx/store';

import {
    BehaviorSubject,
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

    let estadoAutorizacaoSubject:
        BehaviorSubject<{
            carregado: boolean;
            permissoes: ReadonlySet<ChavePermissao>;
        }>;

    const storeMock = {
        select: jasmine
            .createSpy('select')
            .and.returnValue(
                of({
                    sidebarSkin:
                        'sidebar-dark-primary',
                    menuSidebarCollapsed:
                        false
                })
            )
    };

    const routerMock = {
        url: '/dashboard',
        events: of()
    };

    const autorizacaoServiceMock = {
        possuiPermissao: jasmine.createSpy(
            'possuiPermissao'
        ),
        retornarEstado: jasmine.createSpy(
            'retornarEstado'
        )
    };

    beforeEach(
        waitForAsync(() => {
            estadoAutorizacaoSubject =
                new BehaviorSubject({
                    carregado: true,
                    permissoes:
                        new Set<ChavePermissao>()
                });

            autorizacaoServiceMock
                .possuiPermissao
                .calls
                .reset();

            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(false);

            autorizacaoServiceMock
                .retornarEstado
                .calls
                .reset();

            autorizacaoServiceMock
                .retornarEstado
                .and.returnValue(
                    estadoAutorizacaoSubject
                        .asObservable()
                );

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
                        provide: Router,
                        useValue:
                            routerMock
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
                'sidebar-no-expand ' +
                'sidebar-dark-primary'
            );
        }
    );

    it(
        'deve preservar itens publicos e remover acessos nao autorizados',
        () => {
            expect(
                component.menu.length
            ).toBe(
                MENU.length
            );

            expect(
                component.menuConfiguracoes
            ).toEqual([]);

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
            ).toHaveBeenCalledWith(
                ChavePermissao.EmpresaListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.SubsidiariaListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(5);
        }
    );

    it(
        'deve reconstruir menus quando o estado de autorizacao mudar',
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

            estadoAutorizacaoSubject.next({
                carregado: true,
                permissoes:
                    new Set([
                        ChavePermissao
                            .UsuarioListar
                    ])
            });

            const grupoAcesso =
                component
                    .menuConfiguracoes
                    .find(
                        (item) =>
                            item.name ===
                            'Acesso e Segurança'
                    );

            expect(
                grupoAcesso?.children
                    ?.map((item) => item.name)
            ).toEqual([
                'Usuários'
            ]);

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(5);
        }
    );

    it(
        'deve exibir Perfis quando possuir a permissao de listar',
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
                MENU_CONFIGURACOES[0]
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
            ).toHaveBeenCalledWith(
                ChavePermissao.EmpresaListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.SubsidiariaListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(5);
        }
    );

    it(
        'deve exibir Permissoes quando possuir a permissao de listar',
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
                MENU_CONFIGURACOES[0]
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
            ).toHaveBeenCalledWith(
                ChavePermissao.EmpresaListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.SubsidiariaListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledTimes(5);
        }
    );

    it(
        'deve remover item quando usuario nao possuir a permissao',
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
                    name: 'Usuarios',
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
                            name: 'Usuarios',
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

    it(
        'deve selecionar o modulo pela rota atual',
        () => {
            const modulo: MenuItem = {
                name:
                    'Acesso e Segurança',
                iconClasses:
                    'fas fa-shield-alt',
                children: [
                    {
                        name: 'Usuarios',
                        iconClasses:
                            'fas fa-users',
                        path: [
                            '/acesso/usuarios'
                        ]
                    }
                ]
            };

            component.menu = [];
            component.menuConfiguracoes = [
                modulo
            ];

            component[
                'selecionarModuloPelaRota'
            ](
                '/acesso/usuarios/1?origem=lista'
            );

            expect(
                component.moduloSelecionado
            ).toBe(modulo);
        }
    );

    it(
        'deve alternar o painel flutuante no menu recolhido',
        () => {
            const modulo: MenuItem = {
                name:
                    'Acesso e Segurança',
                iconClasses:
                    'fas fa-shield-alt',
                children: [
                    {
                        name: 'Usuarios',
                        iconClasses:
                            'fas fa-users',
                        path: [
                            '/acesso/usuarios'
                        ]
                    }
                ]
            };

            const elemento =
                document.createElement(
                    'button'
                );

            component.menuRecolhido = true;

            component.selecionarModulo({
                item: modulo,
                elemento
            });

            expect(
                component.moduloSelecionado
            ).toBe(modulo);

            expect(
                component.painelFlutuanteAberto
            ).toBeTrue();

            component.selecionarModulo({
                item: modulo,
                elemento
            });

            expect(
                component.painelFlutuanteAberto
            ).toBeFalse();
        }
    );

    it(
        'deve fechar o painel flutuante ao pressionar Escape',
        () => {
            component.painelFlutuanteAberto =
                true;

            component.fecharPainelFlutuante();

            expect(
                component.painelFlutuanteAberto
            ).toBeFalse();
        }
    );

    it(
        'deve fechar o painel flutuante ao clicar fora',
        () => {
            component.painelFlutuanteAberto =
                true;

            const elementoExterno =
                document.createElement(
                    'div'
                );

            component
                .fecharPainelAoClicarFora(
                    {
                        target:
                            elementoExterno
                    } as unknown as MouseEvent
                );

            expect(
                component.painelFlutuanteAberto
            ).toBeFalse();
        }
    );

    it(
        'nao deve fechar o painel flutuante ao clicar dentro',
        () => {
            component.painelFlutuanteAberto =
                true;

            component
                .fecharPainelAoClicarFora(
                    {
                        target:
                            fixture.nativeElement
                    } as unknown as MouseEvent
                );

            expect(
                component.painelFlutuanteAberto
            ).toBeTrue();
        }
    );
});